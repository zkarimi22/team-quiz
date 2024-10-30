import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import Quiz from '@/models/Quiz';
import QuizLink from '@/models/QuizLink';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const quizLink = await QuizLink.findById(params.id).populate('quiz_id');

    if (!quizLink) {
      return NextResponse.json(
        { message: 'Quiz link not found' },
        { status: 404 }
      );
    }

    if (quizLink.completed) {
      return NextResponse.json(
        { message: 'Quiz already completed' },
        { status: 400 }
      );
    }

    // Return quiz data without correct answers
    const quiz = quizLink.quiz_id;
    const sanitizedQuestions = quiz.questions.map(q => ({
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      order_num: q.order_num
    }));

    return NextResponse.json({
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.time_limit,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 