const express = require('express')
const router = express.Router()
const db = require('../modules/pgutils')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const cookieName = 'EXPRESSTRIPSUSER'

//trip columns: id(p),uid,location(50),datestart,dateend,imageurl,details

let username
let uid

function checkCookie(req){
    const userCookie = req.cookies[cookieName]
    if(userCookie)
    {
      return userCookie.split('::')
    }
    return [null,null]
}

router.get('/',(req,res,next)=>{
    const [uid,username] = checkCookie(req)
    if(!uid){
      res.redirect('../../',{username:username,uid:uid}) 
      return
    }

    let trips

    db.filterData('trips',['*'],['uid'],uid)
      .then(tripRows =>{
        trips = tripRows.map(row=>{
          row.datestart = row.datestart.toDateString()
          row.dateend = row.dateend.toDateString()
          return row
        })
        res.render('mytrips',{username:username,uid:uid,trips:trips})
      })
      .catch(err=>console.log(err))
})

router.post('/addTrip',(req,res,next)=> {
  const [uid,username] = checkCookie(req)
  if(!uid){
    res.redirect('../../',{username:username,uid:uid}) 
    return
  }
   const bod = req.body
   const tripLocation = bod.tripLocation
   const tripDetails = bod.tripDetails
   const tripDeparture = bod.tripDeparture
   const tripReturn = bod.tripReturn
   let data = [uid,tripLocation,tripDeparture,tripReturn].map(db.wrap)
   let dataCol = ['uid','location','datestart','dateend']
   if(tripDetails){
     data.push(db.wrap(tripDetails))
     dataCol.push('details')
   }

   db.insertNewData('trips',dataCol,data).then(res => console.log(res)).catch(err=>console.log(err))

   res.redirect('/')
})

router.post('/delTrip',(req,res,next)=>{
  const [uid,username] = checkCookie(req)
  if(!uid){
    res.redirect('../../',{username:username,uid:uid}) 
    return
  }
  db.deleteData('trips',['id'],[req.body.tripId])
    .then(after => res.redirect('../'))
    .catch(err => {console.log(err);res.redirect('../')})
})

router.get('/addTrip',(req,res,next)=> res.redirect('../'))
router.get('/delTrip',(req,res,next)=> res.redirect('../'))



module.exports = router;