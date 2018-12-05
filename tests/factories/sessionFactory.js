const KeyGrip = require("keygrip");
var { cookieKey } = require("../../config/keys");
const keyGrip = new KeyGrip([cookieKey]);

module.exports = user => {
  var sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  var session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  var sig = keyGrip.sign("session=" + session);

  return { session, sig };
};
