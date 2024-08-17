const _response = require('../utils/response');
const _constants = require('../utils/constants');
const Gender = require('../models/gender');
const Activity = require('../models/activity');

const getGenders = async (req, res, next) => {
  try {
    var genders = await Gender.findAll({
      attributes: ['id', 'type'],
    });

    return res.send(
      _response.getSuccessResponse(_constants.messages.success, genders)
    );
  } catch (e) {
    console.log(e);
    return res.send(
      _response.getFailResponse(
        e.messages || _constants.messages.exception,
        null,
        400
      )
    );
  }
};

const getActivities = async (req, res, next) => {
  try {
    var activities = await Activity.findAll({
      attributes: ['id', 'type'],
    });

    return res.send(
      _response.getSuccessResponse(_constants.messages.success, activities)
    );
  } catch (e) {
    console.log(e);
    return res.send(
      _response.getFailResponse(
        e.messages || _constants.messages.exception,
        null,
        400
      )
    );
  }
};

module.exports = { getGenders, getActivities };
