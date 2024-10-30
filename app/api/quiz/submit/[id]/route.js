import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import Quiz from '@/models/Quiz';
import QuizLink from '@/models/QuizLink';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { answers } = await request.json();
    
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

    // Calculate score
    const quiz = quizLink.quiz_id;
    let correctAnswers = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct_option_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Update quiz link with results
    quizLink.completed = true;
    quizLink.completion_time = new Date();
    quizLink.results = {
      score,
      answers,
      total_questions: quiz.questions.length,
      correct_answers: correctAnswers
    };

    await quizLink.save();

    return NextResponse.json({ score });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 