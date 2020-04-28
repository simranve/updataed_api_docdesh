
const express = require('express');
const router = express.Router();
const multer = require('multer');
var {authenticate} = require('./../middleware/authenticate'); 
const provider = require('../controllers/contactProvider');


//router.post('conatctprovider', provider.contactProvider )
router.post('/contactprovider',authenticate, provider.contactProvider);
router.post('/contactStaff',authenticate, provider.contactStaff);


router.post('/send_message', authenticate, provider.sendMessage);

router.post('/invite_calling',authenticate, provider.inviteCalling);

router.post('/invite_calling_test',authenticate, provider.apnsNotificationVoip);

router.post('/reject_calling',authenticate, provider.rejectCalling);

router.get('/message_badge', authenticate, provider.messageBadge);

router.post('/clear_badge', authenticate, provider.clearBadge);

module.exports = router;