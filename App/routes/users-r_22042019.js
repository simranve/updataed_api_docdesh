const express = require('express');
const router = express.Router();
const multer = require('multer');
// var FormData = require('form-data');
// var insurance = multer({ dest: 'public/uploads/' })
var {authenticate} = require('./../middleware/authenticate');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
      cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
            console.log(file);
            console.log(file);
        console.log(file.mimetype);
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
// router.post('/upload-documents', authenticate, (req, res) =>{
    
//     console.log(upload.single('documents'));
//     console.log('body= '+JSON.stringify(req.body));
//     console.log(upload);
// });

router.post('/signin', user.signIn);
router.delete('/logout', authenticate, user.logOut);
router.post('/verify_signup', user.verifyOtp);
router.post('/resend_otp', user.resentOtp);

router.post('/forgot_password', user.forgotPassword);
router.post('/verify_otp', user.verifyOtpFP);
router.post('/update_password', user.updateForgotPassword);


router.post('/update_profile', authenticate, user.updateProfile);

router.post('/update_profile_pic', authenticate, upload.single('profilePic'), user.updateProfilePic);
// (req,res)=>{
    // console.log('req.files '+req.files);
    // console.log('uploaded: '+upload.single('profilePic'));
    //authenticate, upload.single('profilePic'), user.updateProfilePic
// });

router.get('/credantials', authenticate, user.credentialSearch);


router.post('/update_profile', authenticate, user.updateProfile);

router.delete('/delete_document', authenticate, user.deleteDocument);


router.post('/update_device_token', authenticate, user.updateDeviceToken);

/*router.post('/update_profile', authenticate, cpUpload, (req, res) => {
    console.log(req.body);
    console.log(req.files);
    user.updateProfile;
});*/

/*router.post('/signin', (req, res)=> {
    res.send('Inside Signin');
    console.log('Inside Signin');
});*/

router.get('', (req, res)=> {
    res.send('You are at right place, Welcome to Hippa App');
    // console.log('User Home');
});

module.exports = router;