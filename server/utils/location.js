const moment = require('moment');

var generateLocationLink = (from, latitude ,longitude) => {
    return {
      from,
      url :`http://maps.google.com/maps?q=${latitude},${longitude}`,
      createdAt: moment().valueOf()
    };
  };
  
  module.exports = {generateLocationLink}
