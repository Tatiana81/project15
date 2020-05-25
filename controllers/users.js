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
      const matched = bcrypt.compare(password, user.password);
      return (matched, user);
    })
    .then((matched, user) => {
      if (matched) {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 604800000, httpOnly: true });
        return res.send(token);
      }
      throw new AuthorError('Неправильные почта или пароль');
    })
    .catch(next);
};

const findUser = (req, res, next) => {
  User.findById(req.params.userId)
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
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  }, { new: true })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  User.findOneAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

module.exports = {
  findUser, findAllUsers, createUser, updateUser, updateAvatar, login,
};
