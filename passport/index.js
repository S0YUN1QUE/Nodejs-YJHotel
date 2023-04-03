const passport = require('passport');
const User = require('../models/users')
const local = require('./localStrategy'); // 함수
const kakao = require('./kakaoStrategy'); // 함수

module.exports = () => {
    passport.serializeUser( // 로그인시 실행, req.login()에서 호출
        (user, done) => {
            done(null, user.uid); // req.session에 user.id 저장 
        }
    );
    passport.deserializeUser(
        (uid, done) => {
            User.findOne({ where: { uid } })
                .then(user => done(null, user)) // req.user에 user 객체값 대입
                .catch(err => done(err));
        }
    );

    local();
    kakao();
};