const express = require('express');

const router = express.Router();

// GET / 라우터
router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', (req, res) => {
  res.render('main-index', { title: 'Hotel YJ Fukuoka' });
});

router.get('/rooms', (req, res) => {
  res.render('rooms', { title: '객실 | Hotel YJ Fukuoka' });
});

router.get('/dinings', (req, res) => {
  res.render('dinings', { title: 'DINING | Hotel YJ Fukuoka'});
});

router.get('/facilities', (req, res) => {
  res.render('facilities', { title: '시설 및 서비스 | Hotel YJ Fukuoka'});
});

module.exports = router;