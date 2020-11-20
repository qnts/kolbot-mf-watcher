import { Router } from 'express';
import moment from 'moment';
import Item from '../models/Item';
import Channel from '../models/Channel';
const router = Router();

router.get('/', async function (req, res) {
  if (!req.session.channel) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  let { date, page, limit } = req.query;
  // format inputs
  date = moment(date, 'YYYY-MM-DD');
  if (!date.isValid()) {
    date = moment();
  }
  page = parseInt(page);
  if (!page) {
    page = 1;
  }
  limit = parseInt(limit);
  if (!limit || limit > 50) {
    limit = 50;
  }
  const items = await Item.find(
    {
      channel: req.session.channel._id,
      timestamp: {
        $gte: date.startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      },
    })
    .sort('-timestamp')
    .limit(limit)
    .skip((page - 1) * limit)
    .lean()
    .exec();
  res.send(items);
});

router.post('/', async function (req, res) {
  const { channel, item } = req.body;
  const selectedChannel = await Channel
    .findOne({ name: channel.name, password: channel.password })
    .select('_id')
    .lean()
    .exec();
  if (!selectedChannel) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  const newItem = new Item(item);
  newItem.channel = selectedChannel._id;
  try {
    await newItem.save();
    res.send();
  } catch (err) {
    res.status(500).send({
      type: 'serverError',
      message: 'Internal server error',
    });
  }
});

router.post('/batch', async function (req, res) {
  const { channel, items } = req.body;
  const selectedChannel = await Channel
    .findOne({ name: channel.name, password: channel.password })
    .select('_id')
    .lean()
    .exec();
  if (!selectedChannel) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  try {
    const newItems = items.map(item => {
      item.channel = selectedChannel._id;
      return {
        insertOne: {
          document: item,
        },
      };
    });
    await Item.bulkWrite(newItems);
    res.send();
  } catch (err) {
    res.status(500).send({
      type: 'serverError',
      message: 'Internal server error',
    });
  }
});

export default router;
