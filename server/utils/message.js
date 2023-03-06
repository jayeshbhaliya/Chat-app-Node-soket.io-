const moment = require('moment');

var generateMesage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMesage}
