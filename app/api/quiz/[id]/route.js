import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/utils/mongodb';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';
import QuizLink from '@/models/QuizLink';

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

export async function DELETE(request, { params }) {
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
    
    // Find and delete the quiz, ensuring it belongs to the user
    const quiz = await Quiz.findOneAndDelete({ 
      _id: params.id,
      created_by: decoded.userId 
    });

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Also delete any associated quiz links
    await QuizLink.deleteMany({ quiz_id: params.id });

    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}