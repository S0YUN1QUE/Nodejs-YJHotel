const express = require('express');
const multer	=	require('multer');
const	path	=	require('path');
const	fs	=	require('fs');
const { User, Post, Comment } = require('../models');
const { isLoggedIn } = require('./middleware');
// const { Op } = require('sequelize');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {//주소
    res.render('intro', { title: 'intro'}); 
  });
router.get('/review', (req, res) => {//주소
  res.render('review', { title: 'review'}); 
});


// 리뷰게시판 글쓰기 라우터
router.get('/review_write',isLoggedIn ,(req, res) => {//주소
  res.render('review_write', { title: 'review_write'}); 
});

// 글작성 - db 테이블에 값 넣기
router.post('/review_write',isLoggedIn ,async(req, res, next) => {
    try {
        await Post.create({
            ptitle: req.body.title,
            pcontent: req.body.review,
            phits: 0,
            writerid: req.user.uid,
            writer: req.user.uname,
            img:`${root}`,
            bindex: 1, // board 테이블에 컬럼 내용 필수로 넣어야 함
        });
        res.redirect('/overseas/review');
    } catch (err) {
        console.error(err);
        next(err);
    }
  });

// Json객체 넘겨주기
router.get('/reviews', async(req, res, next) => {
  try {
      const review = await Post.findAll({
          where: bindex = 1,
          order: [
              ['createdAt', 'DESC']
          ],
      });
      res.json(review);
  } catch (err) {
      console.error(err);
      next(err);
  }
});

// img 파일 등록
try	{
    fs.readdirSync('uploads');
}	catch	(error)	{
    console.error('uploads 폴더가	없어 uploads 폴더를	생성합니다.');
    fs.mkdirSync('uploads');
}
let root;
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            root = path.basename(file.originalname, ext) + new Date().valueOf() + ext;  //Date.now()
            cb(null, root);
        },
    }),
    limits: {fileSize: 10 * 1024 * 1024},
});

router.post('/img',	/*isLoggedIn,*/	upload.single('img'), (req,	res) =>	{
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
});

// 페이지
router.get('/reviews/:num', async(req, res, next) => {
    try {
        let pageNum = req.params.num;
        let offset = 0;
        if (pageNum > 1) {
            offset = (pageNum - 1) * 10;
        }
        const review = await Post.findAll({
            where: bindex = 1,
            order: [
                ['createdAt', 'DESC']
            ],
            offset: offset,
            limit: 10,
        });
        res.json(review);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 수정 페이지 이동
router.get('/:id/review_update', isLoggedIn, async(req, res, next) => {
    try {
        const review = await Post.findOne({
            where: { pindex: req.params.id },
        });
        JSON.stringify(review);
        res.render('review_update', { title: 'review| update', review });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 수정
router.patch('/:id', isLoggedIn, async(req, res, next) => {
  try {
      const review_write = await Post.update({
          ptitle: req.body.ptitle,
          pcontent: req.body.pcontent,
          img: root,
      }, {
          where: { pindex: req.params.id },
      });
      res.json(review_write);
  } catch (err) {
      console.error(err);
      next(err);
  }
});

// 리뷰 삭제
router.delete('/:id', isLoggedIn, async(req, res, next) => {
  try {
      const review_write = await Post.destroy({
          where: { pindex: req.params.id },
      });
      res.json(review_write);
  } catch (err) {
      console.error(err);
      next(err);
  }
});

// 작성글 보기, 조회수
router.get('/:id/review', async(req, res, next) => {
  try {
      const review = await Post.findOne({
          where: { pindex: req.params.id },
      });
      const title = review.ptitle;
      let hits = review.phits
      hits++;
      review.update({
          phits: hits,
      })
      const comment = await Comment.findOne({
          where: { pindex: req.params.id }
      })
      JSON.stringify(review);
      JSON.stringify(comment);
      res.render('review_view', {
          title: `review| ${title}`,
          review,
          comment
      });
  } catch (err) {
      console.error(err);
      next(err);
  }
});

module.exports = router;