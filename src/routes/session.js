const KoaRouter = require('koa-router');

	const router = new KoaRouter();

	router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
	  createSessionPath: ctx.router.url('session.create'),
	  notice: ctx.flashMessage.notice,
	}));

	router.put('session.create', '/', async (ctx) => {
	  const { email, password } = ctx.request.body;
	  const usuario = await ctx.orm.usuario.findOne({ where: { email } });
	  const isPasswordCorrect = usuario && await usuario.checkPassword(password);
	  if (isPasswordCorrect) {
	    ctx.session.userId = usuario.id;
	    return ctx.redirect(ctx.router.url('create-usuario.list'));
	  }
	  return ctx.render('session/new', {
	    email,
	    createSessionPath: ctx.router.url('session.create'),
	    error: 'Incorrect mail or password',
	  });
	});

	router.delete('session.destroy', '/', (ctx) => {
	  ctx.session = null;
	  ctx.redirect(ctx.router.url('session.new'));
	});

	module.exports = router;
