
const Card = require('../models/card');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const PermissionError = require('../errors/permission-error');


const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('В базе данных нет ни одной карточки'))
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = async (req, res, next) => {
  const owner = await User.findOne({ email: req.user.email }).then((user) => user._id).catch(next);
  Card.findOne({ _id: req.params.cardId }, { new: true })
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (card !== undefined) {
        Card.findOneAndRemove({ _id: req.params.cardId, owner }, { new: true })
          .then((cardFounded) => {
            if (cardFounded) res.send({ data: cardFounded }); else throw new PermissionError('У Вас нет прав на удаление чужой карточки');
          })
          .catch(next);
      }
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
