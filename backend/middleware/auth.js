// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

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

module.exports = auth;
