import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import User from '../user/user.model';
const bcrypt = require('bcryptjs');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return res.send(httpStatus.UNAUTHORIZED);
    }
    if (!user) {
      return res.send(httpStatus.UNAUTHORIZED);
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.send(httpStatus.UNAUTHORIZED);
    }
    const token = jwt.sign({
      _id: user._id,
      username: user.username,
      roles: user.roles
    }, process.env.SECRET_KEY);
    return res.json({
      token,
      username: user.username
    });
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default {
  login,
  getRandomNumber
};
