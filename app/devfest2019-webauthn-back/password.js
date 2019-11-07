const utils = require('./utils');
const database = require('./db');

module.exports = function setupPasswordRoutes(router) {
  router.post('/api/password/signin', (ctx) => {
    const {request, response} = ctx;
    if (!request.body || !request.body.login || !request.body.password || !request.body.username) {
      response.body = {
        status: 'failed',
        message: 'Request missing required field!'
      };

      return
    }

    let login = request.body.login;
    let password = request.body.password;
    let username = request.body.username;

    if (database[login]) {
      response.status = 400;
      response.body = {
        status: 'failed',
        message: `login ${login} already exists`
      };

      return
    }


    database[login] = {
      login: login,
      username: username,
      password: password,
      id: utils.randomBase64URLBuffer()
    };

    ctx.session.loggedIn = true;
    ctx.session.login = login;

    response.status = 200;
    response.body = {
      status: 'ok',
      user: {username}
    }
  });

  router.post('/api/password/authenticate', (ctx) => {
    const {request, response} = ctx;
    if (!request.body || !request.body.login || !request.body.password) {
      response.status = 400;
      response.body = {
        status: 'failed',
        message: 'Request missing login or password!'
      };

      return
    }

    let login = request.body.login;
    let password = request.body.password;

    if (!database[login] || database[login].password !== password) {
      response.status = 400;
      response.body = {
        status: 'failed',
        message: `Wrong login or password!`
      };

      return
    }

    ctx.session.loggedIn = true;
    ctx.session.login = login;
    response.status = 200
    response.body = {
      status: 'ok',
      user: {username: database[login].username}
    }
  })
};
