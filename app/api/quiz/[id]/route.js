import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/utils/mongodb';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const headersList = headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const quiz = await Quiz.findOne({ 
      _id: params.id,
      created_by: decoded.userId 
    });

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}