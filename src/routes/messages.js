const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next) {
  ctx.state.mensaje = await ctx.orm.mensaje.findByPk(ctx.params.id);
  return next();
}

async function loadUser(ctx, next) {
  ctx.state.usuario = await ctx.orm.usuario.findByPk(ctx.params.id);
  return next();
}


router.get('message.list', '/', async (ctx) => {
  const userList = await ctx.orm.usuario.findAll();
  const user = ctx.orm.usuario.build();
  await ctx.render('messages/index', {
    userList,
    user,
    openMessageBoxPath: (user_friend) => ctx.router.url('message.box', { id: user_friend.id }),
  });
});

router.get('message.box', '/:id/box', loadUser, async (ctx) => {
  const Op = ctx.orm.Sequelize.Op;
  const user = ctx.state.usuario;
  const mensaje = ctx.orm.mensaje.build();
  const messageList = await ctx.orm.mensaje.findAll({
    where: {
      [Op.or]: [
        {transmitter_id: ctx.session.userId, receiver_id: user.id},
        {transmitter_id: user.id, receiver_id: ctx.session.userId}
      ]
    }
  });
  await ctx.render('messages/box', {
    messageList,
    user,
    mensaje,
    deleteMessagePath: (mensaje, user) => ctx.router.url('message.delete', { id: mensaje.id}),
    submitMessagePath: (user) => ctx.router.url('message.create', { id: user.id }),
  });
});

router.post('message.create', '/:id/', loadUser, async (ctx) => {
  const user = ctx.state.usuario;
  const mensaje = ctx.orm.mensaje.build(ctx.request.body);
  if (ctx.request.body.body) {
    await mensaje.save({ fields: ['body', 'transmitter_id', 'receiver_id'] });
  }
  ctx.redirect(ctx.router.url('message.box', { id: user.id }));
});

router.del('message.delete', '/:id/', loadMessage, async (ctx) => {
  const { mensaje } = ctx.state;
  await mensaje.destroy();
  ctx.redirect(ctx.router.url('message.box', { id: mensaje.receiver_id }));
});

module.exports = router;
