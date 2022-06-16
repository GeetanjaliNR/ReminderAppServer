//importing express
const express = require('express');
const dataService = require('./dataService');
const cors = require('cors');
const jwt = require('jsonwebtoken');
//creating app
const app = express();

//importing cors for client side connection
app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
//to parse json
app.use(express.json());

// using JWT middleware
const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    // const token = req.body.token;
    const data = jwt.verify(token, 'secretcode123456789');
    // console.log(data);
    req.tokenUserId = data.currentUserid;
    next();
  } catch {
    res.status(401).json({
      status: false,
      message: 'token invalid...Please log in once again!!',
    });
  }
};

//Resolving API call

//register
app.post('/register', (req, res) => {
  dataService
    .register(req.body.username, req.body.userid, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login
app.post('/login', (req, res) => {
  dataService.login(req.body.userid, req.body.password).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//saveNewEvent
app.post('/newEvent', jwtMiddleware, (req, res) => {
  dataService
    .saveNewEvent(
      req.body.currentUserid,
      req.body.eventName,
      req.body.eventOccurTime,
      req.body.eventDesc
    )
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//view event
app.post('/viewevent', jwtMiddleware, (req, res) => {
  dataService.viewEvent(req.body.userid).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// deleteEvent
app.delete('/deleteEvent/:toDeleteEventId', jwtMiddleware, (req, res) => {
  dataService.deleteEvent(req, req.params.toDeleteEventId).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// getEvent
app.get('/getEvent/:eventId', jwtMiddleware, (req, res) => {
  dataService.getEventDetails(req, req.params.eventId).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// saveUpdatedEvent
app.put('/updateReminder', jwtMiddleware, (req, res) => {
  dataService
    .saveUpdatedEvent(
      req,
      req.body.id,
      req.body.eventName,
      req.body.eventOccurTime,
      req.body.eventDesc
    )
    .then((result) => {
      console.log(result);
      res.status(result.statusCode).json(result);
    });
});

// assigning port number
app.listen(3000, () => {
  console.log('Reminder app server started at 3000');
});
