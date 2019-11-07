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

    database[login] = {
      registered: false,
      id: utils.randomBase64URLBuffer(),
      authenticators: []
    };

    let challengeMakeCred = utils.generateServerMakeCredRequest(
      login,
      database[login].id
    );
    challengeMakeCred.status = "ok";

    ctx.session.challenge = challengeMakeCred.challenge;
    ctx.session.login = login;
    ctx.session.loggedIn = false;

    response.body = challengeMakeCred;
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

    let getAssertion = utils.generateServerGetAssertion(
      database[login].authenticators
    );
    getAssertion.status = "ok";

    ctx.session.challenge = getAssertion.challenge;
    ctx.session.login = login;
    ctx.session.loggedIn = false;

    response.body = getAssertion;
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

    let webauthnResp = request.body;
    let clientData = JSON.parse(
      base64url.decode(webauthnResp.response.clientDataJSON)
    );

    /* Check challenge... */
    if (clientData.challenge !== ctx.session.challenge) {
      response.body = {
        status: "failed",
        message: "Challenges don't match!"
      };
      response.status = 400;
    }

    /* ...and origin */
    if (clientData.origin !== config.origin) {
      response.body = {
        status: "failed",
        message: "Origins don't match!"
      };
      response.status = 400;
    }

    let result;
    if (webauthnResp.response.attestationObject !== undefined) {
      /* This is create cred */
      result = utils.verifyAuthenticatorAttestationResponse(webauthnResp);

      if (result.verified) {
        database[ctx.session.login].authenticators.push(result.authrInfo);
        database[ctx.session.login].registered = true;
      }
    } else if (webauthnResp.response.authenticatorData !== undefined) {
      /* This is get assertion */
      result = utils.verifyAuthenticatorAssertionResponse(
        webauthnResp,
        database[ctx.session.login].authenticators
      );
    } else {
      response.body = {
        status: "failed",
        message: "Can not determine type of response!"
      };
      response.status = 400;
    }

    if (result.verified) {
      ctx.session.loggedIn = true;
      response.body = {
        status: "ok",
        user: {username: ctx.session.login}
      };
    } else {
      response.body = {
        status: "failed",
        message: "Can not authenticate signature!"
      };
      response.status = 400;
    }
  });
};
