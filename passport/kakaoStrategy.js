const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/users');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async(accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {
                done(null, exUser); // 2번째 이후 카톡 로그인 요청
            } else { // 맨처음 카카오톡 로그인 요청시 실행
                const newUser = await User.create({
                    uid: profile.id,
                    upwd: 1234,
                    uname: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
