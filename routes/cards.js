const router = require('express').Router();
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router
  .use(requestLogger)
  .get('/', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
  }), getCards)
  .post('/', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().alphanum().min(2)
        .max(30),
      link: Joi.string().required().uri(),
    }),
  }), auth, createCard)
  .delete('/:cardId', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }), auth, deleteCard)
  .put('/:cardId/likes', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }), likeCard)
  .delete('/:cardId/likes', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }), dislikeCard)
  .use(errorLogger)
  .use(errors());

module.exports = router;
