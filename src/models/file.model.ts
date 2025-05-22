import { Schema, model, Document } from "mongoose";

export interface IFile extends Document {
  filename: string;
  originalname: string;
  path?: string;
  size: number;
  mimetype: string;
  buffer?: Buffer;
  uploadDate?: Date;
}

const FileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  path: { type: String, required: false },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  buffer: { type: Buffer, required: false }, 
  uploadDate: { type: Date, default: Date.now },
});

export default model<IFile>("files", FileSchema);