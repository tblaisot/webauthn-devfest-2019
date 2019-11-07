const Koa = require('koa');
const koaRouter = require('koa-router');
const session = require('koa-session');
var bodyParser = require('koa-bodyparser');

const setupPasswordRoutes = require('./password');

const setupWebAuthnRoutes = require('./webauthn.result');
const setupLogoutRoutes = require('./logout');

const app = new Koa();
app.keys = ['newest secret key', 'older secret key'];
app.use(bodyParser());

const router = koaRouter();

app.use(session(app));


setupPasswordRoutes(router);
setupLogoutRoutes(router);
setupWebAuthnRoutes(router);

router.get('*', async (ctx) => {
  /*
    if cookies sent are of the form: 'name=abc; age=20; token = xyz;'
    Then ctx.cookie is an object of the form:
    {
      name: 'abc',
      age: '20',
      token: 'xyz'
    }
  */
  ctx.response.body = "OK"
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
