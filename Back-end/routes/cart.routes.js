const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, cartController.getUserCart);
router.post('/add', protect, cartController.addToCart);
router.put('/update', protect, cartController.updateCartItem);
router.delete('/remove', protect, cartController.removeFromCart);

module.exports = router;
