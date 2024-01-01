const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Enable CORS for all routes
app.use(
  cors({
    exposedHeaders: ['x-auth-token'],
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// get json as a input our backend
app.use(express.json());

const db = require('./connection');

//const axios = require('axios');
//const qs = require('qs');
require('dotenv').config();

//require('./start/routes')(app);

require('./start/allRoutes')(app);

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Server started on port ${port}`));
