var express = require('express');
var router = express.Router();

let appointmentModel = require('../../schemas/appointments');
let userModel = require('../../schemas/users');

let { CreateSuccessRes, CreateErrorRes } = require('../../utils/responseHandler');

module.exports = router;