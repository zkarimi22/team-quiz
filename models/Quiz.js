import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  order_num: Number,
  question: String,
  option1: String,
  option2: String,
  option3: String,
  correct_option_answer: String,
  question_context: {
    type: String,
    default: ''
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  active: {
    type: Boolean,
    default: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  theme: String,
  time_limit: Number,
  questions: [QuestionSchema],
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema); 