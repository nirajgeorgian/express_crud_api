var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var User = require('./model/user')

//connect to database
mongoose.connect('mongodb://localhost:27017/api', (err) => {
  if(err) return err
  console.log("connected to database")
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var router = express.Router()
var port = process.env.PORT || 3030

//middleware for router
router.use((req, res, next) => {
  console.log("request is made")
  next()
})

router.get('/', (req, res) => {
  res.json('Running my api')
})

app.use('/api', router)

router.route('/users')
  .post((req, res) => {
    var user = new User()
    user.name = req.body.name
    user.username = req.body.username
    user.email = req.body.email

    //save to database
    user.save((err) => {
      if (err) res.render(err)
      res.json({success: "Successfully created a user"})
    })
  })
  .get((req, res) => {
    User.find((err, users) => {
      if (err) res.send(err)
      res.json(users)
    })
  })

router.route('/users/:user_id')
  .get((req, res) => {
      User.findById(req.params.user_id,(err, user) => {
        if (err) res.send(err)
        res.json(user)
      })
  })
  .put((req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) res.send(err)
      user.name = req.body.name
      user.email = req.body.email
      user.username = req.body.username

      user.save((err) => {
        if (err) res.send(err)
        res.json({
          success:"Successfully updated profile"
        })
      })
    })
  })
  .delete((req, res) => {
    User.remove({
      _id: req.params.user_id
    }, (err, user) => {
      if (err) res.send(err)
      res.json({
        success: "Successfully deleted the profile"
      })
    })
  })

app.listen(port, (err) => {
  if (err) throw err;
  console.log("running on "+ port)
})
