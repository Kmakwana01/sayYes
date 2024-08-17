const express = require('express');
const router  = express.Router();



const { getGenders, getActivities } = require('../controller/common.controller');



router.get('/getGenders',getGenders);
router.get('/getActivities',getActivities);



module.exports = router;