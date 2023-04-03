// module.exports = {};
// exports.함수

const isLoggedIn = (req, res, next) => {
    // req.isAuthenticated(): passport 모듈이 만들어주는 메소드
    // 로그인 여부를 확인 시켜줌
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.')
        res.redirect(`/?error=${message}`);
    }
};

module.exports = { isLoggedIn, isNotLoggedIn };