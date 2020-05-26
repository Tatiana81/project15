const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const PermissionError = require('../errors/permission-error');


const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('В базе данных нет ни одной карточки'))
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) throw new PermissionError('У Вас нет прав на удаление чужой карточки');
      return Card.deleteCard(card)
        .then(() => res.send({ data: card }));
    })
    .catch(next);
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
