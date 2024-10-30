import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/utils/mongodb';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';

// GET all quizzes for the logged-in user
export async function GET(request) {
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
    const quizzes = await Quiz.find({ created_by: decoded.userId });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new quiz
export async function POST(request) {
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
    const quizData = await request.json();
    
    const quiz = await Quiz.create({
      ...quizData,
      created_by: decoded.userId
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 