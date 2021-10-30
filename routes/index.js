var express = require('express');
var router = express.Router();
const { createNewBlog } = require('../utils/script');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/record', async (req, res, next) => {
  let body = req.body;
  createNewBlog(body).then(() => {
    return res.status(200).json({
      code: 1,
      success: true,
    })
  }).catch(err => {
    return res.status(200).json({
      code: 0,
      success: false,
      errMessage: err.message || err
    })
  });
});

module.exports = router;
