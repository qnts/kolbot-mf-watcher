import { Schema, ObjectId, model } from 'mongoose';

const schema = new Schema({
  name: String,
  area: String,
  profile: String,
  stats: [String],
  quality: String,
  action: String,
  isRecipe: Boolean,
  level: Number,
  channel: ObjectId,
}, {
  timestamps: true,
});

const Item = model('item', schema);

export default Item;
