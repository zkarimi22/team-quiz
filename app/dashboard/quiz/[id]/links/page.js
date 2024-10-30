'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './links.module.css';

export default function QuizLinks() {
  const params = useParams();
  const [quiz, setQuiz] = useState(null);
  const [links, setLinks] = useState([]);
  const [recipientName, setRecipientName] = useState('');

  useEffect(() => {
    fetchQuizAndLinks();
  }, []);

  const fetchQuizAndLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      const [quizResponse, linksResponse] = await Promise.all([
        fetch(`/api/quiz/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/quiz/${params.id}/links`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const quizData = await quizResponse.json();
      const linksData = await linksResponse.json();

      setQuiz(quizData);
      setLinks(linksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createLink = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quiz/${params.id}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ link_recipient_name: recipientName }),
      });

      const newLink = await response.json();
      setLinks([...links, newLink]);
      setRecipientName('');
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Failed to create quiz link');
    }
  };

  const copyLink = (linkId) => {
    const link = `${window.location.origin}/quiz/${linkId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{quiz.title} - Quiz Links</h1>
      
      <form onSubmit={createLink} className={styles.createLink}>
        <input
          type="text"
          placeholder="Recipient Name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />
        <button type="submit">Generate Link</button>
      </form>

      <div className={styles.linksList}>
        <h2>Generated Links</h2>
        {links.length === 0 ? (
          <p>No links generated yet</p>
        ) : (
          links.map((link) => (
            <div key={link._id} className={styles.linkCard}>
              <div className={styles.linkInfo}>
                <h3>{link.link_recipient_name}</h3>
                <p>Status: {link.completed ? 'Completed' : 'Pending'}</p>
                {link.completed && (
                  <p>Score: {link.results?.score || 'N/A'}</p>
                )}
              </div>
              <button onClick={() => copyLink(link._id)}>
                Copy Link
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 