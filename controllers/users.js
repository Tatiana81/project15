const validator = require('validator');
const User = require('../models/user');

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .then((user) => (res.send({ data: user })))
    .catch((error) => {
      if (error.name === 'ValidationError') res.status(400).send({ message: `${error}` });
      else res.status(500).send({ message: `Произошла ошибка ${error}` });
    });
};

module.exports = {
  findUser, findAllUsers, createUser, updateUser, updateAvatar,
};
