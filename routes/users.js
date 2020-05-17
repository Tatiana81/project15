const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findUser, findAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), findUser);
router.get('/', findAllUsers);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
  }),
  headers: Joi.object.keys({
    'Content-type': Joi.string().pattern('/^application/json/'),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
  headers: Joi.object.keys({
    'Content-type': Joi.string().pattern('/^application/json/'),
  }),
}), updateAvatar);

module.exports = router;
