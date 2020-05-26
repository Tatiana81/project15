const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthorError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(new AuthorError('Неправильные почта или пароль'))
    .select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      console.log(matched);
      if (matched !== undefined) throw new AuthorError('Неправильные почта или пароль');
      else {
        const token = jwt.sign({ email }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 604800000, httpOnly: true });
        return res.send(token);
      }
    })
    .catch(next);
};

const findUser = (req, res, next) => {
  User.findOne(req.params.userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const findAllUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('В базе данных нет пользователей'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  User.findOneAndUpdate(req.user.email, {
    name: req.body.name, about: req.body.about,
  }, { new: true })
    .orFail(new NotFoundError('Нет пользователя с таким email'))
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  User.findOneAndUpdate(req.user.email, {
    avatar: req.body.avatar,
  }, { new: true })
    .orFail(new NotFoundError('Нет пользователя с таким email'))
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

module.exports = {
  findUser, findAllUsers, createUser, updateUser, updateAvatar, login,
};
