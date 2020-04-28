const validator = require('validator');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const deleteCard = (req, res) => {
  if (validator.isMongoId(req.params.cardId)) {
    Card.findOneAndRemove(req.params.cardId)
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
  } else res.status(404).send({ message: 'Нет карточки с таким id' });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  if (validator.isMongoId(req.params.userId)) {
    Card.create({ name, link, owner: req.user._id })
      .then((card) => res.send({ data: card }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
  } else res.status(404).send({ message: 'Нет пользователя с таким id' });
};

const likeCard = (req, res) => {
  if (req.params.cardId && validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).then((card) => res.send({ data: card }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
  } else res.status(404).send({ message: 'Нет карточки с таким id' });
};

const dislikeCard = (req, res) => {
  if (req.params.cardId && validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).then((card) => res.send({ data: card }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
  } else res.status(404).send({ message: 'Нет карточки с таким id' });
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
