module.exports = function setupLogoutRoutes(router) {
  router.post('/api/logout', (ctx) => {
    const {response} = ctx;

    if (ctx.session.loggedIn) {
      ctx.session = null;
    }

    response.body = {
      'status': 'ok'
    }
  });

};
