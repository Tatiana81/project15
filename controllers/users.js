const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-error');
const AuthorError = require('../errors/AuthorizationError');
const ValidationError = require('../errors/validation-error');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) throw new AuthorError('Неправильные почта или пароль');
      return Promise.all([
        bcrypt.compare(password, user.password),
        user,
      ]);
    })
    .then((array) => {
      if (!array[0]) throw new AuthorError('Неправильные почта или пароль');
      const token = jwt.sign({ _id: array[1]._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      });
      return res.send(token);
    })
    .catch(next);
};

const findUser = (req, res, next) => {
  if (validator.isMongoId(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) res.status(200).send({ data: user });
        else {
          throw new NotFoundError('Нет пользователя с таким id');
        }
      })
      .catch(next);
  } else {
    next(new NotFoundError('Нет пользователя с таким id'));
  }
};

const findAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length < 8) throw new ValidationError('Длина пароля меньше 8 символов');
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
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about, avatar: req.body.avatar,
  }, { new: true })
    .then((user) => (res.send({ data: user })))
    .catch((error) => {
      if (error.name === 'ValidationError') next(new ValidationError(error));
      else next(new ServerError());
    });
};

const updateAvatar = (req, res, next) => {
  User.findOneAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true })
    .then((user) => (res.send({ data: user })))
    .catch((error) => {
      if (error.name === 'ValidationError') next(new ValidationError(error));
      else next(new ServerError());
    });
};

module.exports = {
  findUser, findAllUsers, createUser, updateUser, updateAvatar, login,
};
