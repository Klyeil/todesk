import mongoose, { Schema, Document } from 'mongoose';

interface ISetup extends Document {
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
}

const SetupSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISetup>('Setup', SetupSchema);