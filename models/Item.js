import { Schema, ObjectId, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import moment from 'moment';

const schema = new Schema({
  name: String,
  area: String,
  profile: String,
  stats: [String],
  quality: String,
  action: String,
  isRecipe: Boolean,
  level: Number,
  timestamp: Date,
  channel: ObjectId,
}, {
  timestamps: true,
});

schema.pre('save', function (next) {
  this.timestamp = moment.utc(this.timestamp);
  next();
});

schema.plugin(mongoosePaginate);

const Item = model('item', schema);

export default Item;
