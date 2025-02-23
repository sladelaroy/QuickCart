import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {type: String, required: true, ref: 'user'},
  name: {type: String, required: true, ref: 'user'},
  description: {type: String, required: true, ref: 'user'},
  category: {type: String, required: true, ref: 'user'},
  offerPrice: {type: Number, required: true, ref: 'user'},
  price: {type: Number, required: true, ref: 'user'},
  image: {type: Array, required: true, ref: 'user'},
  date: {type: Number, required: true, ref: 'user'},
})

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product

