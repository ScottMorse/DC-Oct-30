const express = require('express')
const router = express.Router()
const db = require('../modules/pgutils')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const cookieName = 'EXPRESSTRIPSUSER'

//trip columns: id(p),uid,location(50),datestart,dateend,imageurl,details

let username
let uid
router.get('/',(req,res,next)=>{
    const userCookie = req.cookies[cookieName].split('::')
    if(userCookie)
    {
      uid = userCookie[0]
      username = userCookie[1]
    }
    else
    {
      res.redirect('../')
    }
    res.render('mytrips',{username:username,uid:uid})
})



module.exports = router;