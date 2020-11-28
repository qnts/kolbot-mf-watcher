import { Schema, ObjectId, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import moment from 'moment';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { runes } from '../services/GameData';

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
  toJSON: { virtuals: true },
});

schema.virtual('isRune').get(function() {
  return runes.includes(this.name);
});
schema.virtual('isRuneword').get(function() {
  return this.stats.some(stat => /^'[a-z]+'$/.test(stat.toLowerCase()));
});

schema.pre('save', function (next) {
  this.timestamp = moment.utc(this.timestamp);
  if (this.stats.some(stat => /^'[a-z]+'$/.test(stat.toLowerCase()))) {
    this.quality = 'runeword';
  }
  next();
});

schema.plugin(mongooseLeanVirtuals);
schema.plugin(mongoosePaginate);

const Item = model('item', schema);

export default Item;
