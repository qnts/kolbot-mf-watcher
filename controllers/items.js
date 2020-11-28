import { Router } from 'express';
import moment from 'moment';
import Item from '../models/Item';
import Channel from '../models/Channel';
const router = Router();

export const getItems = (channelId, { date, page, limit, qualities }) => {
  // format inputs
  date = moment.utc(new Date(parseInt(date)));
  if (!date.isValid()) {
    date = moment.utc().startOf('d');
  }
  page = parseInt(page);
  if (!page) {
    page = 1;
  }
  limit = parseInt(limit);
  if (!limit || limit > 50) {
    limit = 50;
  }
  if (!qualities || !qualities.length) {
    qualities = null;
  }
  const timestamp = {
    $gte: date,
    $lte: moment(date).add(23, 'h').add(59, 'minutes'),
  };
  console.log(timestamp);
  const query = {
    channel: channelId,
    timestamp,
  };
  if (qualities) {
    query.quality = {
      $in: qualities.split(','),
    };
  }
  return Item.paginate(query, {
    sort: '-timestamp',
    page,
    limit,
    lean: { virtuals: true },
  });
};

router.get('/', async function (req, res) {
  if (!req.session.channel) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  const items = await getItems(req.session.channel._id, req.query);
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
  const credential = { name: channel.name, password: channel.password };
  const selectedChannel = await Channel
    .findOne(credential)
    .select('_id')
    .lean()
    .exec();
  if (!selectedChannel) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  Promise.all(items.map(item => {
    item.channel = selectedChannel._id;
    return Item.create(item).then(newItem => newItem).catch(() => null);
  })).then(newItems => {
    const result = newItems.filter(item => item ? true : false);
    console.log(111, typeof selectedChannel._id);
    req.io.to(String(selectedChannel._id)).emit('new items', result);
    res.send();
  }).catch(console.log);
});

export default router;
