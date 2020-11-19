import { Router } from 'express';
import Channel from '../models/Channel';
const router = Router();

router.post('/register', async (req, res) => {
  const { name, password } = req.body;
  let channel = await Channel.findOne({ name }).exec();
  if (channel) {
    return res.status(400).send({
      type: 'entityExist',
      message: 'Channel name already exists',
    });
  }
  // create
  try {
    channel = new Channel({ name, password });
    await channel.save();
    req.session.channel = channel.toObject();
    res.send(req.session.channel);
  } catch (err) {
    res.status(500).send({
      message: 'Cannot create channel',
    });
  }
});

router.post('/join', async function (req, res) {
  const { name, password } = req.body;
  const channel = await Channel.findOne({ name, password }).lean().exec();
  if (!channel) {
    return res.status(404).send({
      type: 'invalidCredential',
      message: 'Invalid channel',
    });
  }
  req.session.channel = channel;
  res.send(channel);
});

router.post('/quit', async function (req, res) {
  req.session.channel = null;
  res.send();
});

router.put('/change-password', async function (req, res) {
  const { name, oldPassword, newPassword } = req.body;
  const channel = await Channel.findOne({ name, password: oldPassword }).exec();
  if (!channel) {
    return res.status(404).send({
      type: 'invalidCredential',
      message: 'Invalid channel',
    });
  }
  await channel.updateOne({ password: newPassword });
  res.send();
});

export default router;
