const utils = require("./utils");
const config = require("./config.json");
const base64url = require("base64url");
const database = require("./db");

module.exports = function setupWebAuthnRoutes(router) {

  router.post("/api/webauthn/register", ctx => {
    const {request, response} = ctx;
    if (!request.body || !request.body.login) {
      response.body = {
        status: "failed",
        message: "Request missing login field!"
      };
      response.status = 200;
      return;
    }

    let login = request.body.login;

    if (database[login] && database[login].registered) {
      response.body = {
        status: "failed",
        message: `login ${login} already exists`
      };
      response.status = 400;
      return;
    }

    // TODO
  });

  router.post("/api/webauthn/login", (ctx) => {
    const {request, response} = ctx;
    if (!request.body || !request.body.login) {
      response.body = {
        status: "failed",
        message: "Request missing login field!"
      };
      response.status = 400;

      return;
    }

    let login = request.body.login;

    if (!database[login] || !database[login].registered) {
      response.body = {
        status: "failed",
        message: `User ${login} does not exist!`
      };
      response.status = 400;

      return;
    }

    // TODO
  });

  router.post("/api/webauthn/response", (ctx) => {
    const {request, response} = ctx;
    if (
      !request.body ||
      !request.body.id ||
      !request.body.rawId ||
      !request.body.response ||
      !request.body.type ||
      request.body.type !== "public-key"
    ) {
      response.body = {
        status: "failed",
        message:
          "Response missing one or more of id/rawId/response/type fields, or type is not public-key!"
      };
      response.status = 400;

      return;
    }

    // TODO
  });
};
