var express = require('express');
var router = express.Router();
let appointmentModel = require('../schemas/appointments');
let userModel = require('../schemas/users');

let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', async function(req, res, next) {
  if (req.session.authenticated) {
    res.render('appointments/add', {
      calendarDays: []  
    });
  } else {
      // User is not authenticated, redirect to login page
      res.redirect('/auth/login');
  }
  });

module.exports = router;
