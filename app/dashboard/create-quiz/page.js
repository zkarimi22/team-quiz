'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './create-quiz.module.css';

export default function CreateQuiz() {
  const router = useRouter();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    theme: 'default',
    time_limit: 30,
    questions: [{ order_num: 1, question: '', option1: '', option2: '', option3: '', correct_option_answer: '' }]
  });

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, {
        order_num: quiz.questions.length + 1,
        question: '',
        option1: '',
        option2: '',
        option3: '',
        correct_option_answer: ''
      }]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, order_num: i + 1 }));
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) throw new Error('Failed to create quiz');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Quiz</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.basicInfo}>
          <input
            type="text"
            placeholder="Quiz Title"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Quiz Description"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Time Limit (minutes)"
            value={quiz.time_limit}
            onChange={(e) => setQuiz({ ...quiz, time_limit: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className={styles.questions}>
          {quiz.questions.map((question, index) => (
            <div key={index} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <h3>Question {index + 1}</h3>
                {quiz.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(index)}>Remove</button>
                )}
              </div>
              <input
                type="text"
                placeholder="Question"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Option 1"
                value={question.option1}
                onChange={(e) => handleQuestionChange(index, 'option1', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Option 2"
                value={question.option2}
                onChange={(e) => handleQuestionChange(index, 'option2', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Option 3"
                value={question.option3}
                onChange={(e) => handleQuestionChange(index, 'option3', e.target.value)}
                required
              />
              <select
                value={question.correct_option_answer}
                onChange={(e) => handleQuestionChange(index, 'correct_option_answer', e.target.value)}
                required
              >
                <option value="">Select Correct Answer</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={addQuestion}>Add Question</button>
          <button type="submit">Create Quiz</button>
        </div>
      </form>
    </div>
  );
} 