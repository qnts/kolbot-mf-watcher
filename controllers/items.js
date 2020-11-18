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
  let { date, page, limit } = req.params;
  // format inputs
  date = moment(date, 'YYYY-MM-DD');
  if (!date) {
    date = moment();
  }
  date = date.format('YYYY-MM-DD');
  page = parseInt(page);
  if (!page) {
    page = 1;
  }
  limit = parseInt(limit);
  if (!limit || limit > 50) {
    limit = 20;
  }
  const items = await Item.find({ channel: req.session.channelId })
    .sort('-createdAt')
    .limit(limit)
    .skip((page - 1) * limit)
    .lean()
    .exec();
  res.send(items);
});

router.get('/about', function (req, res) {
  res.send('About this wiki');
});

export default router;
