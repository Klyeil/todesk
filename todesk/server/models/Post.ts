import mongoose, { Document, Schema } from 'mongoose';

export interface Post extends Document {
    title: string;
    content: string;
    createdAt: Date;
    userId: string;
    views: number; // 조회수
    category: string; // 카테고리 추가
  }
  
  const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    category: { type: String, default: '자유' }, // 기본값 "자유"
  });

export default mongoose.model<Post>('Post', postSchema);