import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import QuizLink from '@/models/QuizLink';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const quizLink = await QuizLink.findById(params.id)
      .populate('quiz_id', 'title questions');

    if (!quizLink || !quizLink.completed) {
      return NextResponse.json(
        { message: 'Quiz result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quiz: quizLink.quiz_id,
      completion_time: quizLink.completion_time,
      start_time: quizLink.createdAt,
      results: quizLink.results
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 