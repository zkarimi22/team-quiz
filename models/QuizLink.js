import mongoose from 'mongoose';

const QuizLinkSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  link_recipient_name: String,
  completed: {
    type: Boolean,
    default: false,
  },
  completion_time: Date,
  results: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.models.QuizLink || mongoose.model('QuizLink', QuizLinkSchema); 