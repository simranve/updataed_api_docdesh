
const express = require('express');
const router = express.Router();
const {authenticate } = require('../middleware/authenticate')
const admin = require('../controllers/admin');
const path = require('path');
const multer = require('multer');
// const pdfTemplate = require('./../Document')

// const pdf = require('html-pdf')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        {
          console.log(file.mimetype);
          
          cb(null, Date.now() + '-' + file.originalname )
        } else if(file.mimetype === 'application/pdf'){
            cb(null, Date.now() + '-' + file.originalname)
        }
    }
});
var upload = multer({storage: storage});

router.post('/signin', admin.adminSignIn)

router.get('/user_profile/:id', admin.userProfile);

router.get('/get_pateint',admin.getRefferelPatient);

router.get('/patient_dose',admin.getPatientDose);

router.post('/patient_dose_save',admin.patientDose);

router.patch('/patient_dose/:id', admin.patientDoseUpdate)

router.delete('/patient_dose/:id', admin.patientDoseDelete)

router.delete('/patient_refferel/:id', admin.patientDelete)



router.get('/contact_providers',admin.contactProviders);
router.get('/users',admin.users_list);
router.get('/get_timings',admin.get_timings);

router.get('/get_other_provders',admin.get_other_provders);


router.post('/survey_registration',admin.surveyRegistration);

router.get('/get_servey',admin.getServey);
router.get('/get_servey_staff',admin.getServey_staff);
router.get('/get_servey_provider',admin.getServey_provider);

router.get('/get_meditations',admin.getMeditations);

router.post('/notification_save', upload.single('notify_image'), admin.notificationSave)

var cpUpload = upload.fields([{ name: 'profilePic', maxCount: 1 }])
router.post('/contact_add', upload.single('profilePic'), admin.contactAdd)

/*router.post('/contact_add', cpUpload, 
function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})*/
router.get('/get_all_videos',admin.getVideos);

router.get('/get_all_videos_for_general',admin.getVideos_for_general);

router.get('/get_all_videos_psych_medical',admin.get_all_videos_psych_medical);

router.get('/get_all_videos_psych_disorder',admin.get_all_videos_psych_disorder);


router.post('/video_add', admin.videoSave);

router.delete('/delete_video/:id', admin.delteVideo);

router.patch('/video_update/:id', admin.videoUpdate)



router.put('/survey_update/:id', admin.surveyUpdate);

router.delete('/survey_delete/:id', admin.deleteServey);

router.delete('/contact_delete/:id', admin.contactDelete);
  
router.put('/contact_update/:id',upload.single('profilePic'), admin.contactUpdate);
router.put('/contact_update_user/:id',upload.single('profilePic'), admin.contactUpdate_user);

router.get('/notification_list', admin.getNotification);

router.post('/send_all', admin.sendMessageToAll);

router.post('/changeUserSatus', admin.changeUserSatus);
router.post('/changeUserSatusToProvider', admin.changeUserSatusToProvider);


router.post('/send_to', admin.sendMessageTo);
router.post('/add_storeTiming', admin.add_storeTiming);



router.post('/pages', admin.addPages);

router.get('/get_pages', admin.getPages);

router.post('/email_check', admin.duplicateEmail);
router.get('/get_patientConstent', admin.get_patientConstent);
router.delete('/deleteTiming/:id', admin.deleteTiming);

router.put('/update_timing/:id', admin.update_timing)
router.get('/getPatientDocument', admin.getPatientDocument);

   ///post route for pdf Generator
// router.post('/create_pdf', admin.create_pdf);
// router.get('/create_pdf', admin.create_pdf);


   ///get route for pdf generator
router.get('/fetch_pdf',admin.fetch_pdf);

router.get('/fetch_answer_submition',admin.fetch_answer_submition);

module.exports = router;