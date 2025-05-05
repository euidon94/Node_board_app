const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file: [{ type: String }], // 파일 업로드 시 파일명/경로 저장
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
