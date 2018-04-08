var page = require('webpage').create();
page.open('https://www.facebook.com/magikarpusedfly', function() {
  page.render('matt.png');
  phantom.exit();
});