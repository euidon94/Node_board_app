const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth'); // JWT 인증 미들웨어

// 댓글 목록 (authorId, postAuthorId 포함)
router.get('/:postId', async (req, res) => {
  // 댓글과 함께 댓글 작성자ID, 게시글 작성자ID도 포함
  const comments = await Comment.find({ postId: req.params.postId })
    .populate('authorId', 'username')
    .populate({ path: 'postId', select: 'author', populate: { path: 'author', select: '_id username' } })
    .sort({ createdAt: 1 });

  // 각 댓글에 댓글 작성자ID, 게시글 작성자ID 포함
  const result = comments.map(c => ({
    ...c.toObject(),
    authorId: c.authorId?._id?.toString() || '',
    postAuthorId: c.postId?.author?._id?.toString() || '',
  }));

  res.json(result);
});

// 댓글 작성 (로그인 필요)
router.post('/:postId', auth, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;
  const username = req.user.username;
  const postId = req.params.postId;
  if (!content) return res.status(400).json({ error: '댓글 내용을 입력하세요.' });
  try {
    const comment = new Comment({
      postId,
      content,
      author: username,
      authorId: userId,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: '댓글 작성 실패', detail: err.message });
  }
});

// 댓글 수정 (로그인 필요, 댓글 작성자만 가능)
router.put('/:commentId', auth, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) return res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
  if (comment.authorId.toString() !== userId) {
    return res.status(403).json({ error: '수정 권한이 없습니다.' });
  }

  comment.content = content;
  await comment.save();
  res.json(comment);
});

// 댓글 삭제 (로그인 필요, 댓글 작성자 또는 게시글 작성자만 가능)
router.delete('/:commentId', auth, async (req, res) => {
  const userId = req.user.userId;
  const comment = await Comment.findById(req.params.commentId).populate({
    path: 'postId',
    select: 'author',
  });

  if (!comment) return res.status(404).json({ error: '댓글이 존재하지 않습니다.' });

  const isCommentAuthor = comment.authorId?.toString() === userId;
  const isPostAuthor = comment.postId?.author?.toString() === userId;

  if (!isCommentAuthor && !isPostAuthor) {
    return res.status(403).json({ error: '삭제 권한이 없습니다.' });
  }

  await comment.deleteOne();
  res.json({ message: '댓글이 삭제되었습니다.' });
});

module.exports = router;
