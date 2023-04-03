const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/users');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'uid', // layout.html input 태그 name 속성
        passwordField: 'upwd',
    }, async(uid, upwd, done) => { // verify function
        try {
            // email 없으면
            if (!uid) { // 유효성 검사: 백엔드측
                console.log("id 입력해야 합니다.");
                done(null, false, { message: 'id 입력안함' });
            }
            // password  없으면
            if (!upwd) {
                console.log("password 입력해야 합니다.");
                done(null, false, { message: 'password 입력안함' });
            }

            const exUser = await User.findOne({ where: { uid } });
            if (exUser) {
                const result = await bcrypt.compare(upwd, exUser.upwd);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}