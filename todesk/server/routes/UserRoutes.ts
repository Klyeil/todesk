import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import User, { User as UserInterface } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

// JWT 비밀 키 (환경 변수 로드)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
}

// 회원가입 엔드포인트
router.post('/signup', async (req: Request<{}, {}, UserInterface>, res: Response) => {
  const {
    email,
    password,
    name,
    nickname,
    birthdate,
    phone,
    address,
  } = req.body;

  if (!email || !password || !name || !nickname || !birthdate || !phone || !address) {
    return res.status(400).json({ error: '모든 필드가 필요합니다.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '유효한 이메일 형식이 아�니다.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      nickname,
      birthdate,
      phone,
      address,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ message: '회원가입 성공', token, user: { email: savedUser.email, nickname: savedUser.nickname } });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if ((error as any).code === 11000) {
      return res.status(400).json({ error: '이메일 또는 닉네임이 이미 사용 중입니다.' });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 로그인 엔드포인트
router.post('/login', async (req: Request<{}, {}, { email: string; password: string }>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호가 필요합니다.' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '잘못된 비밀번호입니다.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: '로그인 성공', token, user: { email: user.email, nickname: user.nickname } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 정보 확인 엔드포인트 (토큰 검증)
router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
});

export default router;