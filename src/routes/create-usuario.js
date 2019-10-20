const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.usuario = await ctx.orm.usuario.findByPk(ctx.params.id);
  return next();
}


router.get('create-usuario.list', '/', async (ctx) => {
  const userList = await ctx.orm.usuario.findAll();
  await ctx.render('create-usuario/index', {
    userList,
    newUserPath: ctx.router.url('create-usuario.new'),
    editUserPath: (usuario) => ctx.router.url('create-usuario.edit', { id: usuario.id }),
    viewUserPath: (usuario) => ctx.router.url('create-usuario.view', {id:usuario.id}),
    deleteUserPath: (usuario) => ctx.router.url('create-usuario.delete', { id: usuario.id }),
    getPetPerUserPath: (usuario) => ctx.router.url('get-pets.list', { id: usuario.id}),
  });
});

//Obtener lista de pets por usuario
router.get('get-pets.list', '/:id/get', async (ctx) => {
  const PetUserList = await ctx.orm.mascota.findAll({
    where: { usuarioId: ctx.params.id}
  });
  await ctx.render('create-usuario/publications', {
    PetUserList,
    deletePetPath: (mascota) => ctx.router.url('pets.delete', { id: mascota.id })
  });
  console.log(ctx.params);
});

router.get('create-usuario.view', '/:id/profile', async (ctx) => {
  usuario = await ctx.orm.usuario.findByPk(ctx.params.id);
  console.log("iddddd:", ctx.params.id);
  console.log("ormmmm:", ctx.orm.usuario);
  console.log("usuario:", usuario);
  const PetUserList = await ctx.orm.mascota.findAll({
    where: { usuarioId: ctx.params.id}
  });
  await ctx.render('create-usuario/profile', {
    usuario,
    PetUserList,
    deletePetPath: (mascota) => ctx.router.url('pets.delete', { id: mascota.id }),
    deleteUserPath: (user) => ctx.router.url('create-usuario.delete', { id: user.id }),
  });
});

router.get('create-usuario.notifications', '/:id/notifications', async (ctx) => {
  usuario = await ctx.orm.usuario.findByPk(ctx.params.id);
  const PetUserList = await ctx.orm.mascota.findAll({
    where: { usuarioId: ctx.params.id}
  });
  const UserList = await ctx.orm.usuario.findAll();
  const PersonalRequestList = await ctx.orm.request.findAll({
    where: { usuarioId: ctx.params.id, status: false}
  });
  var PersonalRequestList1 = [];
  try {
    PersonalRequestList.forEach(async (element) => {
      var info1 = [];
      const adopter = await ctx.orm.usuario.findAll({where: {id: element.adopterId}});
      const mascota = await ctx.orm.mascota.findAll({where: {id: element.mascotaId}});
      info1.push(adopter);
      info1.push(mascota);
      info1.push(element);
      PersonalRequestList1.push(info1);
    });

  } catch {

  };
  const PersonalAcceptedRequestList = await ctx.orm.request.findAll({
    where: { usuarioId: ctx.params.id, status: true}
  });
  var PersonalAcceptedRequestList1 = [];
  try {
    PersonalAcceptedRequestList.forEach(async (element) => {
      var info2 = [];
      const adopter2 = await ctx.orm.usuario.findAll({where: {id: element.adopterId}});
      const mascota2 = await ctx.orm.mascota.findAll({where: {id: element.mascotaId}});
      info2.push(adopter2);
      info2.push(mascota2);
      PersonalAcceptedRequestList1.push(info2);
    });

  } catch {

  };
  
  const RequestDoneList = await ctx.orm.request.findAll({
    where: { adopterId: ctx.params.id, status: false}
  });
  var RequestDoneList1 = [];
  try {
    RequestDoneList.forEach(async (element) => {
      var info3 = [];
      const owner = await ctx.orm.usuario.findAll({where: {id: element.usuarioId}});
      const mascota3 = await ctx.orm.mascota.findAll({where: {id: element.mascotaId}});
      info3.push(owner);
      info3.push(mascota3);
      RequestDoneList1.push(info3);
      console.log(info3);
    });

  } catch(errors) {
    console.log(errors);

  };
  
  const RequestDoneAcceptedList = await ctx.orm.request.findAll({
    where: { adopterId: ctx.params.id, status: true}
  });
  var RequestDoneAcceptedList1 = [];
  try {
    RequestDoneAcceptedList.forEach(async (element) => {
      var info4 = [];
      const owner1 = await ctx.orm.usuario.findAll({where: {id: element.usuarioId}});
      const mascota4 = await ctx.orm.mascota.findAll({where: {id: element.mascotaId}});
      info4.push(owner1);
      info4.push(mascota4);
      RequestDoneAcceptedList1.push(info4);
      
    });

  } catch(errors) {
    console.log(errors);

  };
  
  await ctx.render('create-usuario/notifications', {
    usuario,
    UserList,
    PersonalAcceptedRequestList1,
    PersonalRequestList1,
    RequestDoneAcceptedList1,
    RequestDoneList1,
    PetUserList,
    acceptPetRequest: (request) => ctx.router.url('pets.editrequest', { id: request.id }),
    deletePetRequest: (request) => ctx.router.url('pets.deleterequest', { id: request.id }),
  });
});


router.get('create-usuario.new', '/new', async (ctx) => {
  const usuario = ctx.orm.usuario.build();
  await ctx.render('create-usuario/new', {
    usuario,
    submitUserPath: ctx.router.url('create-usuario.create'),
  });
});


router.get('create-usuario.edit', '/:id/edit', loadUser, async (ctx) => {
  const { usuario } = ctx.state;
  await ctx.render('create-usuario/edit', {
    usuario,
    submitUserPath: ctx.router.url('create-usuario.update', { id: usuario.id }),
  });
});

router.post('create-usuario.create', '/', async (ctx) => {
  const usuario = ctx.orm.usuario.build(ctx.request.body);
  try {
    await usuario.save({ fields: ['name', 'username', 'email', 'password', 'telefono', 'nationality', 'space', 2] });
    ctx.session.userId = usuario.id;
    ctx.redirect(ctx.router.url('create-usuario.list'));
  } catch (ValidationError) {
    await ctx.render('create-usuario/new', {
      usuario,
      errors: ValidationError.errors,
      submitUserPath: ctx.router.url('create-usuario.create'),});
    }
  });

router.patch('create-usuario.update', '/:id', loadUser, async (ctx) => {
  const { usuario } = ctx.state;
  try {
    const { name, username, email, password, telefono, nationality, space} = ctx.request.body;
    await usuario.update({ name, username, email, password, telefono, nationality, space });
    ctx.redirect(ctx.router.url('create-usuario.list'));
  } catch (validationError) {
    await ctx.render('create-usuario/edit', {
      usuario,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('create-usuario.update'),
    });
  }
});

router.del('create-usuario.delete', '/:id', loadUser, async (ctx) => {
  const { usuario } = ctx.state;
  await usuario.destroy();
  ctx.redirect(ctx.router.url('create-usuario.list'));
});

module.exports = router;
