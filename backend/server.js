require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/Post');
const User = require('./models/User');
const Comment = require('./models/Comment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();


// 1. MongoDB 연결
const mongoURI = 'mongodb+srv://admin:admin@cluster0.fxyme2e.mongodb.net/board?retryWrites=true&w=majority&appName=Cluster0';
// board 데이터베이스 명시
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection Error:', err));

// 2. 미들웨어
app.use(express.json());
app.use(cors());

// 3. 기본 라우트
app.get('/', (req, res) => {
  res.send('Board App Backend Running!');
});

// (선택) 테스트용 데이터 삽입 라우트
app.get('/insert-test', async (req, res) => {
  try {
    const testPost = new Post({ 
      title: "테스트 제목", 
      content: "테스트 내용"
    });
    await testPost.save();
    res.send('테스트 데이터 추가 완료');
  } catch (err) {
    res.status(500).send('테스트 데이터 추가 실패');
  }
});

// 4. 게시글 CRUD 라우트
const fs = require('fs');
const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
  console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync(uploadDir);
}

const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);
app.use('/uploads', express.static('uploads'));

//댓글
const commentRouter = require('./routes/comments');
app.use('/api/comments', commentRouter);

// 회원가입
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    res.json({ message: '회원가입 성공' });
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패' });
  }
});

// 로그인
app.post('/api/auth/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: '아이디 또는 비밀번호 오류' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: '아이디 또는 비밀번호 오류' });
    // JWT 토큰 발급
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: '로그인 실패' });
  }
});

//인증미들웨어

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '토큰 없음' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    next();
  } catch {
    res.status(401).json({ error: '토큰 오류' });
  }
}


// 5. 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
