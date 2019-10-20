const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadHouse(ctx, next) {
  ctx.state.hogares = await ctx.orm.hogares.findByPk(ctx.params.id);
  return next();
}

router.get('houses.list', '/', async (ctx) => {
  const housesList = await ctx.orm.hogares.findAll();
  const userList = await ctx.orm.usuario.findAll();
  await ctx.render('houses/index', {
    housesList,
    userList,
    newHousePath: ctx.router.url('houses.new'),
    editHousePath: (hogares) => ctx.router.url('houses.edit', { id: hogares.id }),
    deleteHousePath: (hogares) => ctx.router.url('houses.delete', { id: hogares.id }),
  });
});

router.get('houses.new', '/new', async (ctx) => {
  const hogares = ctx.orm.hogares.build();
  const userList = await ctx.orm.usuario.findAll();
  console.log(userList);
  await ctx.render('houses/new', {
    hogares,
    userList,
    submitHousePath: ctx.router.url('houses.create'),
  });
});

router.get('houses.edit', '/:id/edit', loadHouse, async (ctx) => {
  const { hogares } = ctx.state;
  const userList = await ctx.orm.usuario.findAll();
  await ctx.render('houses/edit', {
    hogares,
    userList,
    submitHousePath: ctx.router.url('houses.update', { id: hogares.id }),
  });
});

router.post('houses.create', '/', async (ctx) => {
  const hogares = ctx.orm.hogares.build(ctx.request.body);
  try {
    await hogares.save({ fields: ['address', 'space', 'country', 'city', 'preference', 'limit_date', 'description', 'usuarioId'] });
    ctx.redirect(ctx.router.url('houses.list'));
  } catch (validationError) {
    await ctx.render('houses/new', {
      hogares,
      errors: validationError.errors,
      submitHousePath: ctx.router.url('houses.create'),
    });
  }
});

router.patch('houses.update', '/:id', loadHouse, async (ctx) => {
  const { hogares } = ctx.state;
  try {
    const { address, space, country, city, preference, limit_date, description } = ctx.request.body;
    await hogares.update({ address, space, country, city, preference, limit_date, description });
    ctx.redirect(ctx.router.url('houses.list'));
  } catch (validationError) {
    await ctx.render('houses/edit', {
      hogares,
      errors: validationError.errors,
      submitHousePath: ctx.router.url('houses.update'),
    });
  }
});

router.del('houses.delete', '/:id', loadHouse, async (ctx) => {
  const { hogares } = ctx.state;
  await hogares.destroy();
  ctx.redirect(ctx.router.url('houses.list'));
});

module.exports = router;
