const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }).unknown(true),
}), getCards);

router.post('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().alphanum().min(2)
      .max(30),
    link: Joi.string().required().uri(),
  }),
}), auth, createCard);

router.delete('/:cardId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, deleteCard);

router.put('/:cardId/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
