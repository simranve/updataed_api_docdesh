const express = require('express');
const router = express.Router();

var {authenticate} = require('./../middleware/authenticate');

const education = require('./../controllers/educationVideo');


router.post('/education_video_save',authenticate, education.videoSave)

router.get('/get_videos', authenticate, education.getVideos);
router.get('/get_educational_videos', authenticate, education.getVideos_educational);


router.post('/video_detail', authenticate, education.videoDetail)


module.exports = router;
