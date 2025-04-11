import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import connectDB from '@/lib/mongodb';
import File from '@/models/File';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload file to Firebase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const storageRef = ref(storage, `files/${userId}/${file.name}`);
    await uploadBytes(storageRef, buffer);
    const url = await getDownloadURL(storageRef);

    // Connect to MongoDB
    await connectDB();

    // Save file metadata to MongoDB
    const fileDoc = await File.create({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      userId,
      url,
      metadata: {
        originalName: file.name,
        encoding: 'utf-8',
      },
    });

    return NextResponse.json(fileDoc);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const files = await File.find({ userId }).sort({ uploadDate: -1 });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const userId = searchParams.get('userId');

    if (!fileId || !userId) {
      return NextResponse.json(
        { error: 'File ID and User ID are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const file = await File.findOneAndDelete({ _id: fileId, userId });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete from Firebase Storage
    const storageRef = ref(storage, `files/${userId}/${file.filename}`);
    await deleteObject(storageRef);

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 