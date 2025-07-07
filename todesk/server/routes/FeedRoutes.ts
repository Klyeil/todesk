import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Feed from '../models/Feed';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const router: Router = express.Router();

// Multer 설정 (이미지 업로드)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// JWT 비밀 키
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
}

// 피드 목록 조회
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 9;
  try {
    const feeds = await Feed.find()
      .populate('userId', 'nickname')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({ feeds });
  } catch (error) {
    res.status(500).json({ error: '피드 가져오기 실패' });
  }
});

// 개별 피드 조회
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
    }
    jwt.verify(token, JWT_SECRET); // 토큰 검증 (필요 시 decoded 사용 가능)
    const feed = await Feed.findById(req.params.id).populate('userId', 'nickname');
    if (!feed) {
      return res.status(404).json({ error: '피드를 찾을 수 없습니다.' });
    }
    feed.views += 1; // 조회수 증가
    await feed.save();
    res.status(200).json({ feed });
  } catch (error) {
    console.error('Feed fetch error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    res.status(500).json({ error: '피드 조회 실패' });
  }
});

// 피드 업로드
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const { title, content } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: '이미지가 필요합니다.' });
    }

    const image = req.file.path.replace(/\\/g, '/');

    const newFeed = new Feed({
      image,
      title: title || undefined,
      content: content || undefined,
      userId: user._id,
    });

    const savedFeed = await newFeed.save();
    res.status(201).json({ message: '피드 업로드 성공', feed: savedFeed });
  } catch (error) {
    console.error('Feed upload error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    res.status(500).json({ error: '피드 업로드 실패' });
  }
});

export default router;