const express = require('express')
const router = express.Router()
const db = require('../modules/pgutils')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const cookieName = 'EXPRESSTRIPSUSER'

/* GET home page. */
router.get('/', function(req, res, next) {
  const userCookie = req.cookies[cookieName]
  if(userCookie)
  {
   res.redirect('/mytrips') 
  }
  else{
   res.render('index')
  }
})

router.post('/register',(req,res,next) => {
  let valid = true
  let blame
  const username = req.body.regUsername
  const email = req.body.regEmail
  const pswd = db.encryptPassword(req.body.regPswd).then(pswdHash => {
    db.selectTableAll('users').then(userTableRows => {
      if(userTableRows.length == 0){
        db.insertNewData('users',['username','email','pswd'],[
             db.wrap(username),
             db.wrap(email),
             db.wrap(pswdHash)
        ]).then(result =>{
           db.selectTableAll('users').then(userTableRows => {
             userTableRows.forEach(row => {
               if(username == row.username){
                 user = row
                 res.cookie(cookieName,user.id + "::" + user.username)
                   res.redirect('/mytrips')
                   console.log('User added.')
               }
             })
           })
        })
     }
     else{
      userTableRows.forEach(row=> {
        if(row.username == username)
        {
          valid = false
          blame = 'username'
        }
        else if(row.email == email)
        {
          valid = false
          blame = 'email'
        }
      })
      }
      if(!valid){
        res.render('index',{regBlame: 'Sorry, that ' + blame + ' is not available!'})
        console.log("User denied")
      }
      else{
        db.insertNewData('users',['username','email','pswd'],[
          db.wrap(username),
          db.wrap(email),
          db.wrap(pswdHash)
        ]).then(result =>{
        db.selectTableAll('users').then(userTableRows => {
          userTableRows.forEach(row => {
            if(username == row.username){
              user = row
              res.cookie(cookieName,user.id + "::" + user.username)
                res.redirect('/mytrips')
                console.log('User added.')
            }
          })
        })
      })
     }
    })
  })
})

router.post('/login',(req,res,next) => {
  const username = req.body.logUsername
  const pswd = req.body.logPswd
  db.selectTableAll('users').then(userTableRows => {
     userTableRows.forEach(row => {
       if(username == row.username){
          user = row
       }
     })
     if(!user){
      res.render('index',{logBlame: 'Sorry, that username does not exist.'})
     }
     else{
       db.comparePasswords(pswd,user.pswd).then(isMatch => {
          if(isMatch){
            res.cookie(cookieName,user.id + "::" + user.username)
            res.redirect('/mytrips')
          }
          else{
            res.render('index',{logBlame: 'Sorry, incorrect password.'})
          }
        }
      )}
  })
})

router.post('/logout',(req,res,next) => {
    res.clearCookie(cookieName)
    res.redirect('../')
})

router.get('/logout',(req,res,next) => {
  res.clearCookie(cookieName)
  res.redirect('../')
})

router.get('/register',(req,res,next) => {
  res.redirect('/')
})
router.get('/login',(req,res,next) => {
  res.redirect('/')
})

module.exports = router;