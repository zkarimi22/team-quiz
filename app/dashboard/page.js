'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      fetchQuizzes();
    }
  }, [user, loading]);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Quiz Dashboard</h1>
        <div className={styles.userInfo}>
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.actions}>
          <button onClick={() => router.push('/dashboard/create-quiz')}>
            Create New Quiz
          </button>
        </section>

        <section className={styles.quizList}>
          <h2>Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <p>No quizzes created yet</p>
          ) : (
            <div className={styles.grid}>
              {quizzes.map((quiz) => (
                <div key={quiz._id} className={styles.quizCard}>
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <div className={styles.quizActions}>
                    <button onClick={() => router.push(`/dashboard/quiz/${quiz._id}`)}>
                      Manage
                    </button>
                    <button onClick={() => router.push(`/dashboard/quiz/${quiz._id}/links`)}>
                      Quiz Links
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 