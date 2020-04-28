const express = require('express');
const router = express.Router();

var {authenticate} = require('../middleware/authenticate');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        if(file.mimetype === 'application/pdf'){
            cb(null, Date.now() + '-' + file.originalname)
        }
        
    }
});
var upload = multer({storage: storage});

const patientDocument = require('../controllers/patientDocument');
 
router.post('/add_patientDocument',authenticate,upload.single('patientDoc'), patientDocument.add_constent);

// router.get('/timingsList',authenticate, patientDocument.timingsList);

// router.post('/providers_timing',authenticate, patientDocument.providers_timing);


module.exports = router;