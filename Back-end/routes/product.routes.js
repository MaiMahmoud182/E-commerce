const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const upload = require('../middlewares/uploadImage');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Admin-only CRUD
router.post('/', protect, isAdmin, upload.single('image'), createProduct);
router.put('/:id', protect, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

// Public access
router.get('/', getAllProducts);
router.get('/:id', getProduct);

module.exports = router;
