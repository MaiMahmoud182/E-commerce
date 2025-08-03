const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', protect, adminOnly, userController.getAllUsers);
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;
