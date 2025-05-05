const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  author: { type: String, default: '익명' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ← 추가/수정
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
