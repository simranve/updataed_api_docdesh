const express = require('express');
const router = express.Router();

var {authenticate} = require('../middleware/authenticate');


const openingTime = require('../controllers/openingTime');
 
router.post('/adding_timings',authenticate, openingTime.adding_timings);

router.get('/timingsList',authenticate, openingTime.timingsList);

router.post('/providers_timing',authenticate, openingTime.providers_timing);


module.exports = router;