var router        = require('express').Router();
var cookieParser  = require('cookie-parser');
var instagramApi  = require('instagram-node').instagram();
var fs            = require('fs');
var Bluebird      = require('bluebird');
var config        = require('./config');
var Lob           = require('lob')(config.lob_api_key);

/* things added to allow database to work */
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

Bluebird.promisifyAll(instagramApi);


/* Index Page
 * IF the instagram cookie is present, show the app
 * ELSE show an Instagram login button
 */

function store(image, req, res) {
    console.log("time to connect");
    /* first test if database will have data inserted after each time random images is clicked */
    var results = [];
    //console.log("time to connect");
       pg.connect(connectionString, function (err, client, done) {
          if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
          }

          /* insert into table */
          client.query("INSERT INTO test(text, complete) values($1, $2)", ['hi', false]);
          //console.log("connection established");
          //client.query("INSERT INTO images(img) values($1)", [img1]);
          // SQL Query > Select Data
          /*var query = client.query("SELECT * FROM test ORDER BY id ASC");
          //var query = client.query("SELECT * FROM images ORDER BY img ASC");
           // Stream results back one row at a time
           query.on('row', function(row) {
            results.push(row);
           }); */

           // close connection
           /*query.on('end', function() {
              done();
            //return res.json(results);
           }); */
           console.log("successfully added to database");
           console.log(image, " is the image");
        }); 


}

router.get('/', function (req, res) {

  //var results = [];
  //var img1 = null;
  //console.log("we have initialized img1");
  //console.log("img1 is ", img1);


  if (req.cookies.instaToken) {
    console.log("have the token");

    instagramApi.use({ access_token: req.cookies.instaToken });
    return instagramApi.user_self_media_recentAsync(50)
    .spread(function (medias, pagination, remaining, limit) {
      return Bluebird.all([
        instagramApi.mediaAsync(medias[Math.floor(Math.random() * medias.length -1) + 1].id),
        instagramApi.mediaAsync(medias[Math.floor(Math.random() * medias.length -1) + 1].id),
        instagramApi.mediaAsync(medias[Math.floor(Math.random() * medias.length -1) + 1].id)
      ]);
    })
    .spread(function (image1, image2, image3) {
      res.render('index', {
        image1: image1[0].images.standard_resolution.url,
        image2: image2[0].images.standard_resolution.url,
        image3: image3[0].images.standard_resolution.url,
        access_token: req.cookies.instaToken
       // img1: image1[0].images.standard_resolution.url

        
      });

      //console.log("done rendering");
      store(image1, req, res);

    })
      .catch(function (errors) {
            console.log(errors);
      });

  } else {
    res.render('index', {
      showLogin: true
    });
  }
});


/* Redirect user to Instagram for authentication */
router.get('/authorize-user', function (req, res) {
  instagramApi.use({
    client_id: config.instagram_client_id,
    client_secret: config.instagram_client_secret
  });
  res.redirect(instagramApi.get_authorization_url(config.instagram_redirect_uri));
});

/* Set cookie once Instagram sends access code */
router.get('/handleauth', function (req, res) {
  instagramApi.authorize_userAsync(req.query.code, config.instagram_redirect_uri)
  .then(function (result) {
    res.cookie('instaToken',result.access_token, { maxAge: 900000, httpOnly: true });
    res.redirect('/');
  })
  .catch(function (errors) {
    console.log(errors);
  });
});


/* Create Postcard and Send it to Lob */
/*router.post('/create-postcard', function (req, res) {

  var postcardTemplate = fs.readFileSync(__dirname + '/postcard.html').toString();

  return Lob.addresses.create({
    name: req.body.name,
    address_line1: req.body.address,
    address_city: req.body.city,
    address_state: req.body.state,
    address_zip: req.body.zip,
    address_country: 'US',
  })
  .then(function (address) {
    return Lob.postcards.create({
      description: 'Instagram Postcard Demo',
      to: address.id,
      front: postcardTemplate,
      message: req.body.message,
      data: {
        image1: req.body.image1,
        image2: req.body.image2,
        image3: req.body.image3
      }
    });
  })
  .then(function (postcard) {
    res.render('complete', { url: postcard.url });
  })
  .catch(function (errors){
    res.render('complete', { error: errors.message });
  });
}); */

module.exports = router;