const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../../models/User');
const tokenUtils = require('../../utils/tokenUtils');

const login = (req, res) => {
  if (!req.body || _.isEmpty(req.body)) {
    return res.status(400).send({
      error: 'body cannot be empty'
    });
  }

  const {email, password} = req.body;

  User.findOne({email}).exec()
    .then((user) => {
      if (!user) {
        return Promise.reject({error: 'User does not exist!'});
      }

      return Promise.resolve(user);
    })
    .then((user) => {
      if(bcrypt.compareSync(password, user.password)) {
        return Promise.resolve(user);
      }
      return Promise.reject({
        error: 'password not match'
      });
    })
    .then((user) => {

      const token = tokenUtils.signToken(user);

      return Promise.resolve({token});
    })
    .then((response) => {
      res.status(200).send(response).end();
    })
    .catch((error) => {
      res.status(400).send(error).end();
    });
};

module.exports = login;