const express = require('express');
const expressStaticGzip = require('express-static-gzip')

const app = express();
<<<<<<< HEAD
const { retrieveProduct, retrieveStyles, conductSearch } = require('./apiMethods.js');
=======
const { retrieveProduct, conductSearch, retrieveRelatedData } = require('./apiMethods.js');
>>>>>>> 77246a5a312fe76d7a6734dc02337c20b4d6b15c

var port = 3000;

app.listen(port, () => {
  console.log('serving on 3000');
})

//app.use(express.static('public'));

// G-zipped static service
app.use('/', expressStaticGzip('public'));



// GET single product by ID
app.get('/products/:id', (req, res) => {

  var id = req.params.id;

  retrieveProduct(id).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
  });

})

// GET styles by product ID
app.get('/styles/:id', (req, res) => {

  var id = req.params.id;

  retrieveStyles(id).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
  });

})



// GET product by search term
app.get('/search/:searchTerm', (req, res) => {

  var query = req.params.searchTerm;

  conductSearch(query).then(data => {
    res.send(200, data);
  }).catch((err) => {
    console.log(err);
  });

})





//GET all related data
app.get('/related/:ids', (req, res) => {

  var reqParam = req.params.ids;
  var ids = reqParam.split('&');
  var cb = (data) => {
    res.send(data);
  }
  var data = retrieveRelatedData(ids, cb);
})

app.get('/outfits/:ids', (req, res) => {

  var reqParam = req.params.ids;
  console.log('reqparam', reqParam);
  var ids = reqParam.split('&');
  var cb = (data) => {
    res.send(data);
  }
  var data = retrieveRelatedData(ids, cb);
})