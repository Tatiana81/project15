const router = require('express').Router();
const {
  findUser, findAllUsers, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/:userId', findUser);
router.get('/', findAllUsers);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
