import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

// JWT 비밀 키
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
}

// 게시물 목록 조회 (페이지네이션 지원)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10; // 한 페이지에 10개 게시물
  try {
    const posts = await Post.find()
      .populate('userId', 'nickname')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: '게시물 가져오기 실패' });
  }
});

// 개별 게시물 조회 (조회수 증가 포함)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'nickname');
    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }
    // 조회수 증가
    post.views += 1;
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: '게시물 조회 실패' });
  }
});

// 게시물 생성
router.post('/', async (req: Request, res: Response) => {
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

    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: '제목과 내용이 필요합니다.' });
    }

    const newPost = new Post({
      title,
      content,
      category: category || '자유', // 기본값 "자유게시판"
      userId: user._id,
      views: 0,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: '게시물 생성 성공', post: savedPost });
  } catch (error) {
    console.error('Post creation error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    res.status(500).json({ error: '게시물 생성 실패' });
  }
});

export default router;