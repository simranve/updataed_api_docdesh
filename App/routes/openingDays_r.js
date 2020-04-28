const express = require('express');
const router = express.Router();

var {authenticate} = require('./../middleware/authenticate');


const openingDays = require('../controllers/openingDays');
 
router.post('/adding_providers',authenticate, openingDays.adding_providers);

router.get('/openingsList',authenticate, openingDays.openingsList);


module.exports = router;