const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const User = require('../models/users')
const bcrypt = require('bcrypt');
const passport = require('passport');


// GET /auth/login
router.get('/login', isNotLoggedIn, (req, res, next) => {
    res.render('login', { title: '로그인 | Hotel YJ Fukuoka' });
});

// GET /auth/join
router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', { title: '회원가입 | Hotel YJ Fukuoka' });
});

// POST /auth/join
router.post('/join', isNotLoggedIn, async(req, res, next) => {
    const { uid, uname, upwd } = req.body; // 사용자 입력 처리
    try {
        const exUser = await User.findOne({ where: { uid } });
        if (exUser) {
            return res.redirect('/auth/join?error=exist');
        }
        const hash = await bcrypt.hash(upwd, 12);
        await User.create({
            uid,
            upwd: hash,
            uname,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// POST /auth/login
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/auth/login/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

// GET /auth/logout
router.get('/logout', isLoggedIn, (req, res) => {
    // req.logout(); // passport 모듈이 작성해줌
    // req.session.destroy();
    // res.redirect('/');

    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/');
    })
});

// GET /auth/kakao 라우터
router.get('/kakao', (req, res, next) => {
    passport.authenticate('kakao')(req, res, next);
});
// GET /auth/kakao/callback 라우터: passport-kakao 모듈에서 요청
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res, next) => {
    res.redirect('/'); // 로그인 성공하면 로그인한 상태로 메인페이지로 이동
});

module.exports = router;