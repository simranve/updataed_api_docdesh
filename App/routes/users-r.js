const express = require('express');
const router = express.Router();
const multer = require('multer');
// var FormData = require('form-data');
// var insurance = multer({ dest: 'public/uploads/' })
var {authenticate} = require('./../middleware/authenticate');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        {
          cb(null, Date.now() + '-' + file.originalname )
        } else if(file.mimetype === 'application/pdf'){
            cb(null, Date.now() + '-' + file.originalname)
        }
    }
});
var upload = multer({storage: storage});

const user= require('./../controllers/user');
const errHandler = require('../helper/errorHandler')
/* GET users listing. */

// router.post('/user-register', upload.array('insurance'),user.userRegistration);

router.post('/user_register', multer().none(), user.userRegistration);
router.post('/upload_documents', authenticate, upload.single('documents'), user.uploadDocuments);


router.post('/signin', user.signIn);

router.delete('/logout', authenticate, user.logOut);

router.post('/verify_signup', user.verifyOtp);

router.post('/resend_otp', user.resentOtp);

router.post('/forgot_password', user.forgotPassword);

router.post('/verify_otp', user.verifyOtpFP);

router.post('/update_password', user.updateForgotPassword);

router.get('/user_profile', authenticate, user.userProfile);

router.post('/update_profile', authenticate, user.updateProfile);

router.post('/get_user_info', authenticate, user.get_user_info);

router.post('/update_profile_pic', authenticate, upload.single('profilePic'), user.updateProfilePic);

router.get('/credantials', user.credentialSearch);

router.post('/conatactprovider_save',upload.single('profilePic'), user.conatactProviderSave);

router.delete('/delete_document', authenticate, user.deleteDocument);

router.post('/update_device_token', authenticate, user.updateDeviceToken);

router.post('/notifications', authenticate, user.getNotifcationList);

router.get('/about', user.getPagesAbout);

router.get('/terms-condition', user.getPagesTerms);
router.get('/contact_mainOffice', user.getMainOffice);

router.get('/servey', user.userServey);
router.get('/staffServey', user.staffServey);
router.get('/providerServey', user.providerServey);


router.get('/meditationServey', user.meditationServey);
router.get('/video-instructions', user.getPagesVideoinstruction);
router.get('/app_updated_version', user.updatedVersion);
router.get('/app_updated_version_android', user.updatedVersion_android);
router.get('/providers_listing', user.providers_listing);

router.get('', (req, res)=> {
    res.send('You are at right place, Welcome to Hippa App');
});

router.get('/get_psych_medical_videos', user.get_psych_medical_videos);
router.get('/get_psych_disorder_videos', user.get_psych_disorder_videos);


module.exports = router;