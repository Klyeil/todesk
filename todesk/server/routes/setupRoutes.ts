import express from 'express';
import Setup from '../models/Setup';

const router = express.Router();

// GET: 모든 셋업 조회
router.get('/', async (req, res) => {
  try {
    const setups = await Setup.find();
    res.json(setups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching setups', error: err });
  }
});

// POST: 새 셋업 추가
router.post('/', async (req, res) => {
  try {
    const setup = new Setup(req.body);
    await setup.save();
    res.status(201).json(setup);
  } catch (err) {
    res.status(400).json({ message: 'Error creating setup', error: err });
  }
});

export default router;