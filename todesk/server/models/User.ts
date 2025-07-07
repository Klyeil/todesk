import mongoose, { Schema, Document } from 'mongoose';

// 사용자 인터페이스
export interface User extends Document {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthdate: string;
  phone: string;
  address: string;
}

// Mongoose 스키마
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  birthdate: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

export default mongoose.model<User>('User', UserSchema);