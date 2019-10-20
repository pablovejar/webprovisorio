const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  await ctx.render('index', {
    goToUsers: ctx.router.url('create-usuario.list'),
    goToPets: ctx.router.url('pets.list'),
    //adoptPet: ctx.router.url('pets.adopt'),
  }
  );
});

module.exports = router;
