const jwt = require('jsonwebtoken');

/* Load Helpers */
const sendError = require('./../helper/errorHandler').sendError;
const User = require('./../models/userModel');
module.exports = {
  getToken: async (user) => {
    try {
      return await jwt.
      sign({
        user
      }, process.env.SECRET_KEY);
    } catch (e) {
      throw new Error(e.message);
    }
  },

  verifyToken: async (req, res, next) => {
    try {
      if (req.originalUrl !== "/user" && req.originalUrl !== '/settings/assets-create') {
        const user = await jwt.verify(req.headers["x-auth"], process.env.SECRET_KEY).user;
        let users = new User;
        if (!await users.fetchOne({
            cloudId: user.cloudId
          })) {
          throw new Error('There are no user available with this cloudId');
        }
        req.user = user;
      }
      next();
    } catch (e) {
      sendError(
        res,
        401,
        "The user has signed out",
        `It's look like the user is providing wrong token or no-token :: Set x-auth in header with a valid token, possible Error :: ${e.message} `,
        `${req.originalUrl} :: check here`,
        `${req.originalUrl}`
      );
    }
  }
}