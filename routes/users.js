const express = require('express');
const {GMember} = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const gmembers = await GMember.findAll({});
    console.log('사용자 조회', req.method, req.url, req.body, req.params, gmembers);
    // res.json({gmembers});
    res.render('us-aboutUs', {gmembers});
  } 
    catch (err) {
      console.error(err);
      next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
      const gmembers = await GMember.create({
        img: `${root}`, //파일경로 파일이름=변수
        gsnum: req.body.gsnum,
        gname: req.body.gname,
        gbirth: req.body.gbirth,
        gcontact: req.body.gcontact,
        gemail: req.body.gemail,
        gmbti: req.body.gmbti,
        glike: req.body.glike,
        gpart: req.body.gpart,
      });
      console.log('req.바디', req.body, req);
      // res.status(201).json(gmembers);
      // res.render('sequelize', gmembers);
      res.redirect('/users');
    } 
    catch (err) {
      console.error(err);
      next(err);
    }
  });

router.patch('/', async(req, res, next)=>{
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
})

router.delete('/', async(req, res, next)=>{
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

router.post('/img', upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});
  
module.exports = router;
// https://pastebin.com/xCRCDAGS