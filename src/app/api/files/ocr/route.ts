import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import File from '@/models/File';

export async function PUT(request: NextRequest) {
  try {
    const { fileId, ocrText } = await request.json();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!fileId || !ocrText || !userId) {
      return NextResponse.json(
        { error: 'File ID, OCR text, and User ID are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const file = await File.findOneAndUpdate(
      { _id: fileId, userId },
      { $set: { ocrText } },
      { new: true }
    );

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating OCR text:', error);
    return NextResponse.json(
      { error: 'Failed to update OCR text' },
      { status: 500 }
    );
  }
} 