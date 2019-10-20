const KoaRouter = require('koa-router');


//const hello = require('./routes/hello');
const index = require('./routes/index');
const usuario = require('./routes/create-usuario');
const mascota = require('./routes/pets');
const mensaje = require('./routes/messages');
const session = require('./routes/session');
const hogares = require('./routes/houses')


const router = new KoaRouter();

router.use(async (ctx, next) => {
    Object.assign(ctx.state, {
      currentUser: ctx.session.userId && await ctx.orm.usuario.findByPk(ctx.session.userId),
      newSessionPath: ctx.router.url('session.new'),
      destroySessionPath: ctx.router.url('session.destroy'),
      usersPath: ctx.router.url('create-usuario.list'),
    });
    return next();
  });

router.use('/', index.routes());
//router.use('/hello', hello.routes());
router.use('/usuario', usuario.routes());
router.use('/mascota', mascota.routes());
router.use('/mensaje', mensaje.routes());
router.use('/hogares', hogares.routes());
router.use('/session', session.routes());


module.exports = router;
