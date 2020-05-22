const validator = require('validator');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');


const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('В базе данных нет ни одной карточки'))
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  if (validator.isMongoId(req.params.cardId)) {
    Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
      .orFail(new NotFoundError('Нет карточки с таким id'))
      .then((user) => res.send({ data: user }))
      .catch(next);
  }
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
