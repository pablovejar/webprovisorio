const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPet(ctx, next) {
  ctx.state.mascota = await ctx.orm.mascota.findByPk(ctx.params.id);
  return next();
}

async function loadRequest(ctx, next) {
  ctx.state.request = await ctx.orm.request.findByPk(ctx.params.id);
  return next();
}

router.get('pets.list', '/', async (ctx) => {
  const petList = await ctx.orm.mascota.findAll();
  await ctx.render('pets/index', {
    petList,
    newPetPath: ctx.router.url('pets.new'),
    adoptPetPath: (mascota) => ctx.router.url('pets.adopt-request', { id: mascota.id}),
    editPetPath: (mascota) => ctx.router.url('pets.edit', { id: mascota.id }),
    deletePetPath: (mascota) => ctx.router.url('pets.delete', { id: mascota.id }),
  });
});

router.get('pets.new', '/new', async (ctx) => {
  const mascota = ctx.orm.mascota.build();
  const userList = await ctx.orm.usuario.findAll();
  await ctx.render('pets/new', {
    mascota,
    userList,
    submitPetPath: ctx.router.url('pets.create'),
  });
});

router.get('pets.edit', '/:id/edit', loadPet, async (ctx) => {
  const { mascota } = ctx.state;
  await ctx.render('pets/edit', {
    mascota,
    submitPetPath: ctx.router.url('pets.update', { id: mascota.id }),
  });
});

router.get('pets.editrequest', '/:id/editrequest', loadRequest, async (ctx) => {
  const { request } = ctx.state;
  await ctx.render('pets/accept', {
    request,
    acceptPetPath: ctx.router.url('pets.accept', { id: request.id }),
  });
});
router.post('pets.create', '/', async (ctx) => {
  const mascota = ctx.orm.mascota.build(ctx.request.body);
  const userList = await ctx.orm.usuario.findAll();
  try {
    await mascota.save({ fields: ['type', 'gender', 'age', 'country', 'city', 'address', 'herido', 'weight', 'name', 'description', 'hogar_temporal', 'usuarioId'] });
    ctx.redirect(ctx.router.url('pets.list'));
  } catch (ValidationError) {
    await ctx.render('pets/new', {
      mascota,
      errors: ValidationError.errors,
      submitPetPath: ctx.router.url('pets.create'),
    });
  }
});

router.patch('pets.update', '/:id', loadPet, async (ctx) => {
  const { mascota } = ctx.state;
  try {
    const { type, gender, age, country, city, address, herido, weight, name, description, hogar_temporal} = ctx.request.body;
    await mascota.update({ type, gender, age, country, city, address, herido, weight, name, description, hogar_temporal});
    ctx.redirect(ctx.router.url('pets.list'));
  } catch (validationError) {
    await ctx.render('pets/edit', {
      mascota,
      errors: validationError.errors,
      submitPetPath: ctx.router.url('pets.update'),
    });
  }
});

router.del('pets.delete', '/:id', loadPet, async (ctx) => {
  const { mascota } = ctx.state;
  await mascota.destroy();
  ctx.redirect(ctx.router.url('pets.list'));
});



router.get('pets.adopt-request', '/:id/request', async (ctx) => {
  const mascota = await ctx.orm.mascota.findAll({raw: true, where: {id: ctx.params.id}});
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@HOLA", mascota[0]);
  const request = ctx.orm.request.build();
  const owner = mascota[0].usuarioId;
  console.log(owner);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@FALLE AQUI");
  const usuario = await ctx.orm.usuario.findAll({where: {id: owner}});
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@FALLE AQUI1122222");
  const adopter = ctx.state.currentUser;
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@FALLE HEREEEEEEE", adopter);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@FALLE dsafdsfds", usuario[0]);
  await ctx.render('pets/request', {
    request,
    mascota,
    owner,
    usuario,
    adopter,
    confirmRequestPath: ctx.router.url('pets.requests', {id: ctx.params.id}),
  });
});

router.post('pets.requests', '/:id/newrequest', async (ctx) => {
  const request = ctx.orm.request.build(ctx.request.body);
  // const mascota = await ctx.orm.mascota.findByPk(id);
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  await request.save({ fields: ['status','adopterId', 'usuarioId', 'mascotaId'] });
  ctx.redirect(ctx.router.url('pets.list'));
  });

router.patch('pets.accept', '/:id/accepted', loadRequest, async (ctx) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@estoy aceptandolo ');
  const { request } = ctx.state;
  const {status, adopterId, usuarioId, mascotaId} = ctx.request.body;
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@estoy aceptandolo ');
  await request.update({ status, adopterId, usuarioId, mascotaId });
  ctx.redirect(ctx.router.url('pets.list'));
  });

router.del('pets.deleterequest', '/:id', loadRequest, async (ctx) => {
  const { request } = ctx.state;
  await request.destroy();
  ctx.redirect(ctx.router.url('pets.list'));
});



module.exports = router;
