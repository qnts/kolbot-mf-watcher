import { connect } from 'mongoose';
import { config } from '../services/env';

connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Mongo connected');
}).catch(err => {
  console.log('failed to connect', err);
});
