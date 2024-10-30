'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './quiz.module.css';

export default function TakeQuiz() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (quiz && timeLeft === null) {
      setTimeLeft(quiz.time_limit * 60);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/take/${params.id}`);
      if (!response.ok) {
        throw new Error('Quiz not found or already completed');
      }
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      router.push('/quiz-error');
    }
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quiz/submit/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error('Failed to submit quiz');
      
      const result = await response.json();
      router.push(`/quiz/${params.id}/result?score=${result.score}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <div className={styles.loading}>Loading quiz...</div>;

  const question = quiz.questions[currentQuestion];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{quiz.title}</h1>
        <div className={styles.timer}>
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className={styles.progress}>
        Question {currentQuestion + 1} of {quiz.questions.length}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.questionCard}>
        <h2>{question.question}</h2>
        <div className={styles.options}>
          {['option1', 'option2', 'option3'].map((option, index) => (
            <button
              key={option}
              className={`${styles.option} ${answers[currentQuestion] === option ? styles.selected : ''}`}
              onClick={() => handleAnswer(option)}
            >
              {index + 1}. {question[option]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.navigation}>
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            className={styles.navButton}
          >
            Previous
          </button>
        )}
        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className={styles.navButton}
            disabled={!answers[currentQuestion]}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
} 