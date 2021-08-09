var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  let lon = Math.random() * 181;
  let lat = Math.random() * 91;
  lon = lon.toFixed(2);
  lat = lat.toFixed(2);
  res.json({lon, lat});
});

module.exports = router;
