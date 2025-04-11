import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  userId: string;
  url: string;
  ocrText?: string;
  metadata?: {
    originalName: string;
    encoding: string;
  };
}

const fileSchema = new Schema<IFile>(
  {
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    ocrText: {
      type: String,
      required: false,
    },
    metadata: {
      originalName: String,
      encoding: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.File || mongoose.model<IFile>('File', fileSchema); 