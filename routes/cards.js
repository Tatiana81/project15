const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router
  .use('*', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string(),
    }).unknown(true),
  }))
  .get('/', getCards)
  .post('/', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2)
        .max(30),
      link: Joi.string().required().uri(),
    }),
  }), auth, createCard)
  .delete('/:cardId', celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }), auth, deleteCard)
  .put('/:cardId/likes', celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }), likeCard)
  .delete('/:cardId/likes', celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }), dislikeCard);

module.exports = router;
