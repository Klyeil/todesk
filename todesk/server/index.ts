import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import setupRoutes from './routes/setupRoutes';
import userRoutes from './routes/UserRoutes';


const app = express();
const port = process.env.PORT || 5003;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todesk';

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(mongoUri, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API 라우트
app.use('/api/setups', setupRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'API 엔드포인트를 찾을 수 없습니다.' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});