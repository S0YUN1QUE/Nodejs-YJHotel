const express = require('express');
const { redirect } = require('express/lib/response');
const res = require('express/lib/response');
const moment = require('moment');
const { User, Reserv } = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const myreserv = Reserv.findAll({
          where: { booker: req.user.uid },
        });
        const renums = (await myreserv).length + 1;
        const reserv = Reserv.create({
          rname: req.body.rname,
          reppl: req.body.reppl,
          reci: req.body.reci,
          reco: req.body.reco,
          rename: req.body.rename,
          recontact: req.body.recontact,
          rebf: req.body.rebf,
          booker: req.user.uid,
          renums,
        });
        console.log(reserv);
        return res.redirect('/reservation/myreserv');
      } catch (err) {
        console.error(err);
        next(err);
      }
  });

router.get('/reservs', isLoggedIn, async(req, res, next) => {
  try {
    const reservs = await Reserv.findAll({
      include: {
        model: User,
        where: { uid: req.user.uid },
      },
    });
    console.log(reservs);
    res.json(reservs);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:id/reservs', isLoggedIn, async(req, res, next) => {
  try {
    const result = await Reserv.update({
      rname: req.body.rname,
      reppl: req.body.reppl,
      reci: req.body.reci,
      reco: req.body.reco,
      rename: req.body.rename,
      recontact: req.body.recontact,
      rebf: req.body.rebf,
    }, {
      where: { reindex: req.body.reindex },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:id/reservs', isLoggedIn, async (req, res, next) => {
  try {
    const result = await Reserv.destroy({ where: { reindex: req.body.reindex } });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;