const validator = require('validator');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');


const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  console.log(req.params.cardId, req.user._id);
  if (validator.isMongoId(req.params.cardId)) {
    Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
      .then((user) => res.send({ data: user }))
      .catch(next);
  } else next(new NotFoundError('Нет карточки с таким id'));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => { console.log(card); res.send({ data: card }); })
    .catch(next);
};

const likeCard = (req, res, next) => {
  if (req.params.cardId && validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).then((card) => res.send({ data: card }))
      .catch(next);
  } else next(new NotFoundError('Нет карточки с таким id'));
};

const dislikeCard = (req, res, next) => {
  if (req.params.cardId && validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).then((card) => res.send({ data: card }))
      .catch(next);
  } else next(new NotFoundError('Нет карточки с таким id'));
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
