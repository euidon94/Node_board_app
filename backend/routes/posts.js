const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth'); // JWT 인증 미들웨어
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // uploads 폴더 필요
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 게시글 목록 조회 (작성자 정보 포함)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: '게시글 조회 실패' });
  }
});

// 게시글 상세 조회 (작성자 정보 포함)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    if (!post) return res.status(404).json({ error: '게시글 없음' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: '게시글 상세 조회 실패' });
  }
});

// 게시글 작성 (파일 업로드 지원)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file ? req.file.filename : null;
    const post = new Post({
      title,
      content,
      author: req.user.userId,
      file
    });
    await post.save();
    await post.populate('author', 'username');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: '게시글 작성 실패' });
  }
});

// 파일 다운로드 라우트
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  res.download(filePath, err => {
    if (err) {
      res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }
  });
});

// 게시글 수정 (파일 수정 지원, 본인만 가능하게 하려면 추가 로직 필요)
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: '게시글 없음' });
    // if (post.author.toString() !== req.user.userId) return res.status(403).json({ error: '수정 권한 없음' });

    post.title = title;
    post.content = content;
    if (req.file) post.file = req.file.filename;
    await post.save();
    await post.populate('author', 'username');
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: '게시글 수정 실패' });
  }
});

// 게시글 삭제 (본인만 가능하게 하려면 추가 로직 필요)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: '게시글 없음' });
    // if (post.author.toString() !== req.user.userId) return res.status(403).json({ error: '삭제 권한 없음' });

    await post.deleteOne();
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(400).json({ error: '게시글 삭제 실패' });
  }
});

module.exports = router;
