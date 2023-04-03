const express = require('express');
const moment = require('moment');

const router = express.Router();
let today = moment(new Date());
let nextday = moment(new Date()).add(1, "days");

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.reci = req.body.reci ? req.body.reci : today.format("YYYY-MM-DD 15:00:00");
  res.locals.reco = req.body.reco ? req.body.reco : nextday.format("YYYY-MM-DD 11:00:00");
  res.locals.nights = req.body.nights ? req.body.nights: 1;
  res.locals.reppl = req.body.reppl ? req.body.reppl : 2;
  res.locals.rname = req.body.rname ? req.body.rname : 'Deluxe';
  res.locals.rename = req.body.rename ? req.body.rename : '이름없음';
  res.locals.recontact = req.body.recontact ? req.body.recontact : '없음';
  next();
});

router.get('/book', (req, res) => {
  res.render('re-book', {
    title: '예약하기 | Hotel YJ Fukuoka',
    });
});

router.post('/book', async (req, res, next) => {
  try {
    const reindex = req.body.reindex;
    console.log(reindex);
    res.render('re-book', {
      title: '예약하기 | Hotel YJ Fukuoka',
      reindex,
   });
  } catch (err) {
    console.error(err);
  }
});

router.post('/bookinfo', (req, res) => {
  const rname = req.body.rname;
  const reppl = req.body.reppl;
  const reci = req.body.reci;
  const reco = req.body.reco;
  const nights = req.body.nights;
  const reindex = req.body.reindex;
  console.log(rname, reppl, reci, reco, nights, reindex);
  return res.render('re-bookinfo', {
    title: '나의 예약 - 예약 정보 입력 | Hotel YJ Fukuoka',
    reindex,
  });
});

router.get('/myreserv', (req, res) => {
    res.render('re-myreserv', {
      title: '나의 예약 - 조회 | Hotel YJ Fukuoka',
    });
});

router.get('/', (req, res, next) => {
  res.render('reservation', { title: '예약 | Hotel YJ Fukuoka' });
});

module.exports = router;