const express = require('express');
const router = express.Router();

var {authenticate} = require('../middleware/authenticate');
const multer = require('multer');
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

const storeTimings = require('../controllers/storeTimings');
 
router.post('/add_storeTiming',authenticate,upload.single('patientSignature'), storeTimings.add_storeTiming);

router.post('/providers_timing',authenticate, storeTimings.providers_timing);

// router.get('/timingsList',authenticate, patientConstent.timingsList);

// router.post('/providers_timing',authenticate, patientConstent.providers_timing);


module.exports = router;