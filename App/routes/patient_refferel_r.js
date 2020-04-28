const express = require('express');
const router = express.Router();

var {authenticate} = require('./../middleware/authenticate');

const multer = require('multer');


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



var {authenticate} = require('../middleware/authenticate');

const patient = require('../controllers/patientRefferel');
 
router.post('/patient_refferel',authenticate, patient.refferelRegistration);

router.post('/patient_image',authenticate, upload.single('patient_image'), patient.patientImageUpload);

router.patch('/patient_update/:id',authenticate, patient.patientUpdate);

router.post('/patient_dose',authenticate, patient.patientDose);



module.exports = router;