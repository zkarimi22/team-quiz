'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import styles from './result.module.css';

export default function QuizResult() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [quizResult, setQuizResult] = useState(null);
  const score = searchParams.get('score');

  useEffect(() => {
    fetchQuizResult();
  }, []);

  const fetchQuizResult = async () => {
    try {
      const response = await fetch(`/api/quiz/result/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch result');
      const data = await response.json();
      setQuizResult(data);
    } catch (error) {
      console.error('Error fetching result:', error);
    }
  };

  if (!quizResult) return <div className={styles.loading}>Loading result...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.resultCard}>
        <h1>Quiz Complete!</h1>
        
        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNumber}>{score}%</span>
            <span className={styles.scoreLabel}>Score</span>
          </div>
        </div>

        <div className={styles.details}>
          <h2>{quizResult.quiz.title}</h2>
          <p className={styles.completionTime}>
            Completed on: {new Date(quizResult.completion_time).toLocaleDateString()}
          </p>
          
          <div className={styles.summary}>
            <div className={styles.stat}>
              <span>Total Questions</span>
              <span>{quizResult.quiz.questions.length}</span>
            </div>
            <div className={styles.stat}>
              <span>Correct Answers</span>
              <span>{Math.round(score * quizResult.quiz.questions.length / 100)}</span>
            </div>
            <div className={styles.stat}>
              <span>Time Taken</span>
              <span>{Math.round((new Date(quizResult.completion_time) - new Date(quizResult.start_time)) / 60000)} minutes</span>
            </div>
          </div>
        </div>

        <div className={styles.message}>
          {score >= 70 ? (
            <p className={styles.success}>Congratulations! You passed the review.</p>
          ) : (
            <p className={styles.failure}>Keep practicing. It looks like you need some more reviewing on the controls.</p>
          )}
        </div>
      </div>
    </div>
  );
} 