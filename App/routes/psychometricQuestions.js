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

const psychometricQuestions = require('../controllers/psychometricQuestions');
 
router.post('/add_psychometricQuestions',authenticate, psychometricQuestions.add_psychometricQuestions);

// router.get('/timingsList',authenticate, psychometricQuestions.timingsList);

router.post('/get_psychometricQuestions',authenticate, psychometricQuestions.get_psychometricQuestions);


module.exports = router;