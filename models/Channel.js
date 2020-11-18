import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: {
    type: String,
    unique: true,
    index: true,
  },
  password: String,
}, {
  timestamps: true,
});

const Channel = model('channel', schema);

export default Channel;
