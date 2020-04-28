const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (value) => validator.isAlpha(value),
      message: 'Некорректное имя',
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (value) => validator.isAlpha(value),
      message: 'Некорректное описание',
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Невалидная ссылка на аватар',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
