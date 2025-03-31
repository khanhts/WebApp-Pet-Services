var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', async function(req, res, next) {
    res.render('appointments/add', {
        calendarDays: []  // Can still generate or leave empty for the calendar
      });
  });

module.exports = router;
