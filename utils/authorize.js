require('dotenv').config();
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.jwtKey;

const _response = require('./response');
const _constants = require('./constants');

const authorizeUser = (req, res, next) => {
  try {
    console.log(req.headers.authorization, 'req.headers');
    const token = req.headers.authorization;
    if (!token)
      return res.send(
        _response.getFailResponse(_constants.messages.unAuthorize, null, 401)
      );
    else {
      console.log(
        tokenSecret,
        'tokenSecrettokenSecrettokenSecrettokenSecrettokenSecret'
      );
      jwt.verify(token.split(' ')[1], tokenSecret, (err, value) => {
        if (err) {
          return res.send(
            _response.getFailResponse(
              _constants.messages.unAuthorize,
              null,
              401
            )
          );
        } else {
          req.authToken = value.data;
          req.userId = value.userId

          next();
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.send(
      _response.getFailResponse(_constants.messages.unAuthorize, null, 401)
    );
  }
};

module.exports = { authorizeUser };
