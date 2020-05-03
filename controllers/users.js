const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправильные почта или пароль'));
      return Promise.all([
        bcrypt.compare(password, user.password),
        user,
      ]);
    })
    .then((array) => {
      if (!array[0]) return Promise.reject(new Error('Неправильные почта или пароль'));
      const token = jwt.sign({ _id: array[1]._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      });
      return res.send(token);
    })
    .catch((err) => res
      .status(401)
      .send({ message: `Необходима авторизация: ${err}` }));
};

const findUser = (req, res) => {
  if (validator.isMongoId(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) res.status(200).send({ data: user });
        else {
          res.status(404).send({
            message: 'Нет пользователя с таким id',
          });
        }
      })
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
  } else {
    res.status(404).send({
      message: 'Нет пользователя с таким id',
    });
  }
};

const findAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('createUser', name, about, avatar, email, password);
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') res.status(400).send({ message: `${error}` });
      else res.status(500).send({ message: `Произошла ошибка ${error}` });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about, avatar: req.body.avatar,
  })
    .then((user) => (res.send({ data: user })))
    .catch((error) => {
      if (error.name === 'ValidationError') res.status(400).send({ message: `${error}` });
      else res.status(500).send({ message: `Произошла ошибка ${error}` });
    });
};

const updateAvatar = (req, res) => {
  User.findOneAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true })
    .then((user) => (res.send({ data: user })))
    .catch((error) => {
      if (error.name === 'ValidationError') res.status(400).send({ message: `${error}` });
      else res.status(500).send({ message: `Произошла ошибка ${error}` });
    });
};

module.exports = {
  findUser, findAllUsers, createUser, updateUser, updateAvatar, login,
};
