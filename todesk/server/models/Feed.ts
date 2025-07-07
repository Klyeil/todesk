import mongoose, { Document, Schema } from 'mongoose';

export interface Feed extends Document {
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  views: number;
  image: string;
}

const feedSchema = new Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  image: { type: String, required: true },
});

export default mongoose.model<Feed>('Feed', feedSchema);