const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  image: { type: String }, // store image URL or filename
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
