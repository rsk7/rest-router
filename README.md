```javascript
// setting up REST routes for SomeModel
var express = require('express');
var restroutes = require('restroutes');
var mongoose = require('mongoose');
var router = express.Router();
var SomeModel = mongoose.model('SomeModel');
module.exports = restroutes(router, SomeModel);
```
