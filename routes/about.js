const express = require('express');
const moment = require('moment');
const { User, Post, Comment, GMember } = require('../models');
const { isLoggedIn } = require('./middleware');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/aboutus', async (req, res, next) => {
    try {
        const gmembers = await GMember.findAll({});
        console.log('사용자 조회', gmembers);
        // res.json({gmembers});
        res.render('us-aboutUs', {
            title: 'ABOUT US | Hotel YJ Fukuoka',
            gmembers,
        });
    } 
      catch (err) {
        console.error(err);
        next(err);
      }
});
  
router.post('/aboutus', async (req, res, next) => {
    try {
        const birth = moment(req.body.gbirth);
        const gbirth = birth.format("YYYY-MM-DD");
        const gmembers = await GMember.create({
            img: `${root}`, //파일경로 파일이름=변수
            gsnum: req.body.gsnum,
            gname: req.body.gname,
            gbirth,
            gcontact: req.body.gcontact,
            gemail: req.body.gemail,
            gmbti: req.body.gmbti,
            glike: req.body.glike,
            gpart: req.body.gpart,
        });
        console.log(gbirth);
        // res.status(201).json(gmembers);
        return res.render('us-aboutUs', {
            title: 'ABOUT US | Hotel YJ Fukuoka',
        })
    }
    catch (err) {
    console.error(err);
    next(err);
    }
});

router.patch('/aboutus', async(req, res, next)=>{
    try {
        console.log("result : ", req.body);
        const result = await GMember.update(
            {gname: req.body.gname,
            gbirth: req.body.gbirth,
            gcontact: req.body.gcontact,
            gemail: req.body.gemail,
            gmbti: req.body.gmbti,
            glike: req.body.glike,
            gpart: req.body.gpart},
            {where: {gsnum: req.body.gsnum}}
        );
        console.log(req.params);
        // res.render('sequelize', result);
        res.json(result);
        // res.redirect('/users');
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.delete('/aboutus', async(req, res, next)=>{
    try {
        console.log('학번: ', req.body);
        const result = await GMember.destroy(
        {where: {gsnum: req.body.gsnum}}
        );
        // res.redirect('/users');
        res.json({status: true}).status(200);
        // res.render('sequelize', result);
        console.log('result:  ', result);
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

try {
    fs.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
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
    limits: {fileSize: 5 * 1024 * 1024},
});

router.post('/aboutus/img', upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `aboutus/img/${req.file.filename}` });
});

// qa main 페이지
router.get('/qna', async(req, res, next) => {
    try {
        res.render('qa', {
            title: 'Q&A | Hotel YJ Fukuoka',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 질문 찾기
router.get('/qna/question', async(req, res, next) => {
    try {
        const questions = await Post.findAll({
            where: bindex = 2,
            order: [
                ['createdAt', 'DESC']
            ],
        });
        res.json(questions);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 글작성 페이지로 이동
router.get('/qna/write', isLoggedIn, async(req, res, next) => {
    try {
        res.render('qa-write', { title: 'Q&A - 질문하기 | Hotel YJ Fukuoka', });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 글작성 - db 테이블에 값 넣기
router.post('/qna/write', isLoggedIn, async(req, res, next) => {
    try {
        await Post.create({
            ptitle: req.body.title,
            pcontent: req.body.question,
            phits: 0,
            writerid: req.user.uid,
            writer: req.user.uname,
            bindex: 2, // board 테이블에 컬럼 내용 필수로 넣어야 함
        });
        return res.redirect('/about/qna');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/qna/question/:nom', async(req, res, next) => {
    try {
        let pageNum = req.params.nom;
        let offset = 0;
        if (pageNum > 1) {
            offset = (pageNum - 1) * 10;
        }
        const questions = await Post.findAll({
            where:  { bindex: 2 },
            order: [
                ['createdAt', 'DESC']
            ],
            offset: offset,
            limit: 10,
        });
        res.json(questions);
    } catch (err) {
        console.error(err);
        next(err);
    }
});




// 제목, 내용에서 검색
router.get('/qna/search/:word', async(req, res, next) => {
    try {
        const word = req.params.word;
        const questions = await Post.findAll({
            where: {
                [Op.or]: [{
                    ptitle: {
                        [Op.like]: "%" + word + "%",
                    }
                }, {
                    pcontent: {
                        [Op.like]: "%" + word + "%",
                    }
                }],
                bindex: 2,
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
        res.json(questions);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/qna/search/:word/:nom', async(req, res, next) => {
    try {
        let pageNum = req.params.nom;
        let offset = 0;
        if (pageNum > 1) {
            offset = (pageNum - 1) * 10;
        }
        const word = req.params.word;
        const questions = await Post.findAll({
            where: {
                [Op.or]: [{
                    ptitle: {
                        [Op.like]: "%" + word + "%",
                    }
                }, {
                    pcontent: {
                        [Op.like]: "%" + word + "%",
                    }
                }],
                bindex: 2,
            },
            order: [
                ['createdAt', 'DESC']
            ],
            offset: offset,
            limit: 10,
        });
        res.json(questions);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// 답변 등록
router.post('/qna/:id/comment', isLoggedIn, async(req, res, next) => {
    try {
        const comment = await Comment.create({
            pindex: req.params.id,
            comment: req.body.comment,
            commenterid: req.user.uid,
            commenter: req.user.uname,
        });
        const question = await Post.findOne({
            where: { pindex: req.params.id },
        });
        question.update({
            panswer: 1,
        })
        const id = req.params.id;
        console.log(comment);
        res.redirect(`/about/qna/${id}/question`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 답변 수정
router.patch('/qna/:id/comment', isLoggedIn, async(req, res, next) => {
    try {
        const comment = await Comment.update({
            comment: req.body.comment,
        }, {
            where: { pindex: req.params.id },
        });
        res.json(comment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 답변 삭제
router.delete('/qna/:id/comment', isLoggedIn, async(req, res, next) => {
    try {
        const question = await Post.findOne({
            where: { pindex: req.params.id },
        });
        const comment = await Comment.destroy({
            where: { pindex: req.params.id },
        });
        question.update({
            panswer: 0,
        });
        res.json(comment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 질문 수정 페이지 이동
router.get('/qna/:id/update', isLoggedIn, async(req, res, next) => {
    try {
        const question = await Post.findOne({
            where: { pindex: req.params.id },
        });
        JSON.stringify(question);
        res.render('qa-update', { title: 'Q&A - 질문하기 | Hotel YJ Fukuoka', question });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 질문 수정
router.patch('/qna/:id', isLoggedIn, async(req, res, next) => {
    try {
        const question = await Post.update({
            ptitle: req.body.ptitle,
            pcontent: req.body.pcontent
        }, {
            where: { pindex: req.params.id },
        });
        res.json(question);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 질문 삭제
router.delete('/qna/:id', isLoggedIn, async(req, res, next) => {
    try {
        const question = await Post.destroy({
            where: { pindex: req.params.id },
        });
        res.json(question);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 질문 선택
router.get('/qna/:id', async(req, res, next) => {
    try {
        const question = await Post.findOne({
            where: { pindex: req.params.id },
        });
        res.json(question);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// 조회수, 및 이동
router.get('/qna/:id/question', async(req, res, next) => {
    try {
        const question = await Post.findOne({
            where: { pindex: req.params.id },
        });
        const title = question.ptitle;
        let hits = question.phits
        hits++;
        question.update({
            phits: hits,
        })
        const comment = await Comment.findOne({
            where: { pindex: req.params.id }
        })
        JSON.stringify(question);
        JSON.stringify(comment);
        res.render('qa-question', {
            title: `Q&A - ${title} | Hotel YJ Fukuoka`,
            question,
            comment
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// GET / 라우터
router.get('/study', (req, res) => {//주소
    res.render('intro', { title: 'STUDY ABROAD PROGRAMME - JAPAN | Hotel YJ Fukuoka'}); 
  });

router.get('/study/review', (req, res) => {//주소
  res.render('review', { title: 'STUDY ABROAD PROGRAMME - JAPAN | Hotel YJ Fukuoka'}); 
});


// 리뷰게시판 글쓰기 라우터
router.get('/study/review_write',isLoggedIn ,(req, res) => {//주소
  res.render('review_write', { title: 'STUDY ABROAD PROGRAMME - JAPAN | Hotel YJ Fukuoka'}); 
});

// 글작성 - db 테이블에 값 넣기
router.post('/study/review_write',isLoggedIn ,async(req, res, next) => {
    try {
        await Post.create({
            ptitle: req.body.ptitle,
            pcontent: req.body.pcontent,
            phits: 0,
            writerid: req.user.uid,
            writer: req.user.uname,
            img:`${root}`,
            bindex: 1, // board 테이블에 컬럼 내용 필수로 넣어야 함
        });
        return res.render('review', { title: 'STUDY ABROAD PROGRAMME - JAPAN | Hotel YJ Fukuoka'}); 
    } catch (err) {
        console.error(err);
        next(err);
    }
  });

// Json객체 넘겨주기
router.get('/study/reviews', async(req, res, next) => {
  try {
      const review = await Post.findAll({
          where: { bindex: 1 },
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
// try	{
//     fs.readdirSync('uploads');
// }	catch	(error)	{
//     console.error('uploads 폴더가	없어 uploads 폴더를	생성합니다.');
//     fs.mkdirSync('uploads');
// }
// let root;
// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, cb) {
//             cb(null, 'uploads/');
//         },
//         filename(req, file, cb) {
//             const ext = path.extname(file.originalname);
//             root = path.basename(file.originalname, ext) + new Date().valueOf() + ext;  //Date.now()
//             cb(null, root);
//         },
//     }),
//     limits: {fileSize: 10 * 1024 * 1024},
// });

router.post('/study/img',	/*isLoggedIn,*/	upload.single('img'), (req,	res) =>	{
    console.log(req.file);
    res.json({url: `/study/img/${req.file.filename}`});
});

// 페이지
router.get('/study/reviews/:num', async(req, res, next) => {
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
router.get('/study/:id/review_update', isLoggedIn, async(req, res, next) => {
    try {
        const review = await Post.findOne({
            where: { pindex: req.params.id },
        });
        JSON.stringify(review);
        res.render('review_update', { title: 'STUDY ABROAD PROGRAMME - JAPAN | Hotel YJ Fukuoka', review });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 수정
router.patch('/study/:id', isLoggedIn, async(req, res, next) => {
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
router.delete('/study/:id', isLoggedIn, async(req, res, next) => {
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
router.get('/study/:id/review', async(req, res, next) => {
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
          title: `STUDY ABROAD PROGRAMME - JAPAN | Hotel YJ Fukuoka`,
          review,
          comment
      });
  } catch (err) {
      console.error(err);
      next(err);
  }
});


router.get('/', (req, res) => {
    res.render('about', { title: 'ABOUT | Hotel YJ Fukuoka' });
  });

module.exports = router;