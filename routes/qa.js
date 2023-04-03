const express = require('express');
const { User, Post, Comment } = require('../models');
const { isLoggedIn } = require('./middleware');
const { Op } = require('sequelize');

const router = express.Router();

// qa main 페이지
router.get('/', async(req, res, next) => {
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
router.get('/question', async(req, res, next) => {
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
router.get('/write', isLoggedIn, async(req, res, next) => {
    try {
        res.render('qa-write', { title: 'Q&A - 질문하기 | Hotel YJ Fukuoka', });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 글작성 - db 테이블에 값 넣기
router.post('/write', isLoggedIn, async(req, res, next) => {
    try {
        await Post.create({
            ptitle: req.body.title,
            pcontent: req.body.question,
            phits: 0,
            writerid: req.user.uid,
            writer: req.user.uname,
            bindex: 2, // board 테이블에 컬럼 내용 필수로 넣어야 함
        });
        res.redirect('/qa');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/question/:nom', async(req, res, next) => {
    try {
        let pageNum = req.params.nom;
        let offset = 0;
        if (pageNum > 1) {
            offset = (pageNum - 1) * 10;
        }
        const questions = await Post.findAll({
            where: bindex = 2,
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
router.get('/search/:word', async(req, res, next) => {
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
                }]
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

router.get('/search/:word/:nom', async(req, res, next) => {
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
                }]
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
router.post('/:id/comment', isLoggedIn, async(req, res, next) => {
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
        res.redirect(`/qa/${id}/question`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 답변 수정
router.patch('/:id/comment', isLoggedIn, async(req, res, next) => {
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
router.delete('/:id/comment', isLoggedIn, async(req, res, next) => {
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
router.get('/:id/update', isLoggedIn, async(req, res, next) => {
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
router.patch('/:id', isLoggedIn, async(req, res, next) => {
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
router.delete('/:id', isLoggedIn, async(req, res, next) => {
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
router.get('/:id', async(req, res, next) => {
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
router.get('/:id/question', async(req, res, next) => {
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



module.exports = router;