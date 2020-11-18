import { Router } from 'express';
import moment from 'moment';
import Item from '../models/Item';
const router = Router();

router.get('/', async function (req, res) {
  if (!req.session.channelId) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  let { date, page, limit } = req.query;
  // format inputs
  date = moment(date, 'YYYY-MM-DD');
  if (!date) {
    date = moment();
  }
  page = parseInt(page);
  if (!page) {
    page = 1;
  }
  limit = parseInt(limit);
  if (!limit || limit > 50) {
    limit = 20;
  }
  const items = await Item.find(
    {
      channel: req.session.channelId,
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
  if (!req.session.channelId) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  const item = new Item(req.body);
  item.channel = req.session.channelId;
  try {
    await item.save();
    res.send();
  } catch (err) {
    res.status(500).send({
      type: 'serverError',
      message: 'Internal server error',
    });
  }
});

router.post('/batch', async function (req, res) {
  if (!req.session.channelId) {
    return res.status(403).send({
      type: 'noChannel',
      message: 'No channel specified',
    });
  }
  try {
    const items = req.body.map(item => {
      item.channel = req.session.channelId;
      return {
        insertOne: {
          document: item,
        },
      };
    });
    await Item.bulkWrite(items);
    res.send();
  } catch (err) {
    res.status(500).send({
      type: 'serverError',
      message: 'Internal server error',
    });
  }
});

export default router;
