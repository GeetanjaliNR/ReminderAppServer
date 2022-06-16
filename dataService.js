//importing user model from db
const db = require('./ds');
const uuid = require('uuid');

//importing jwt
const jwt = require('jsonwebtoken');

//regiser call to mongodb
const register = (username, userid, pswd) => {
  return db.User.findOne({ userid }).then((user) => {
    if (user) {
      return {
        statusCode: 401,
        status: false,
        message: 'User already exists..Please login',
      };
    } else {
      const newUser = new db.User({
        username,
        userid,
        password: pswd,
        reminderevent: [],
      });
      newUser.save();

      return {
        statusCode: 200,
        status: true,
        message: 'Successfully registered..PLease login',
      };
    }
  });
};

//login
const login = (userid, pswd) => {
  return db.User.findOne({ userid, password: pswd }).then((user) => {
    if (user) {
      currentUser = user.username;
      currentUserid = userid;
      const token = jwt.sign(
        {
          currentUserid: userid,
        },
        'secretcode123456789'
      );
      return {
        statusCode: 200,
        status: true,
        message: 'login successfull',
        token,
        currentUser,
        currentUserid,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'login failed. Invalid credentials!!',
      };
    }
  });
};

//saveNewEvent
const saveNewEvent = (userid, eventName, eventOccurTime, eventDesc) => {
  return db.User.findOne({ userid }).then((user) => {
    if (user) {
      user.reminderevent.push({
        id: uuid.v1(),
        eventName: eventName,
        reminderTime: eventOccurTime,
        description: eventDesc,
      });
      user.save();

      return {
        statusCode: 200,
        status: true,
        message: 'Event succesfully created!!',
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect account credentials!',
      };
    }
  });
};

// saveUpdatedEvent
const saveUpdatedEvent = (req, id, eventName, eventOccurTime, eventDesc) => {
  // let response = {};
  return db.User.findOne({ userid: req.tokenUserId }).then((user) => {
    let result = [];
    if (user) {
      result = user.reminderevent.map((reminderObj) => {
        if (reminderObj.id == id) {
          reminderObj.eventName = eventName;
          reminderObj.reminderTime = eventOccurTime;
          reminderObj.description = eventDesc;
          // console.log(reminderObj);
        }
        return reminderObj;
      });
    }
    console.log(user._id);
    try {
      return db.User.updateOne(
        { _id: user._id },
        { $set: { reminderevent: result } }
      ).then((succ, err) => {
        if (err) {
          return {
            statusCode: 401,
            status: False,
            message: 'Operation failed!!',
          };
        } else {
          return {
            statusCode: 200,
            status: true,
            message: 'Event Updated!!',
          };
        }

        // console.log(response);
        // return response;
      });
    } catch (err) {
      console.log(err);
    }
  });
};

//view event
const viewEvent = (userid) => {
  return db.User.findOne({ userid }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        message: user.reminderevent,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'user not identified.. please login once gain!',
      };
    }
  });
};

// deleteEvent
const deleteEvent = (req, toDeleteEventId) => {
  return db.User.findOne({ userid: req.tokenUserId }).then((user) => {
    if (user) {
      //console.log(user.reminderevent.toDeleteEventId);

      const result = user.reminderevent.filter(
        (reminderObj) => reminderObj.id !== toDeleteEventId
      );

      user.reminderevent = result;
      user.save();
      console.log(user);

      return {
        statusCode: 200,
        status: true,
        message: 'Event deleted!!',
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'operation failed!!',
      };
    }
  });
};

// getEvent
const getEventDetails = (req, eventId) => {
  return db.User.findOne({ userid: req.tokenUserId }).then((user) => {
    if (user) {
      const result = user.reminderevent.filter(
        (reminderObj) => reminderObj.id == eventId
      );
      return {
        statusCode: 200,
        status: true,
        message: result,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'operation failed!!',
      };
    }
  });
};

// exporting to other files
module.exports = {
  register,
  login,
  saveNewEvent,
  viewEvent,
  deleteEvent,
  getEventDetails,
  saveUpdatedEvent,
};
