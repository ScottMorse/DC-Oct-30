// const tripLocation = document.getElementById('location')


// const replacer = new RegExp(/[\s\W]/,'g')

const tripImgs = Array.from(document.querySelectorAll('.trip-img'))
const tripLocations = Array.from(document.querySelectorAll('.location'))

// for(let i=0;i<tripImgs.length;i++){
//     fetch(mapPlaceURL + tripLocations[i].innerHTML.replace(replacer,'+'))
//         .then(response => {
//             return response.json()
//         })
//         .then(placeData => {
//             const ref = placeData.candidates[0].photos[0].photo_reference
//             fetch('https://maps.googleapis.com/maps/api/place/photo?maxheight=500&key=AIzaSyBXLCcENFupNH9DkxvC7z43zqkjdp4QcLc&photoreference=' + ref)
//                 .then(image => {
//                     tripImgs[i].style.backgroundImage = 'url("' + image.url + '")'
//                 }) 
//         })
// }

const addTripForm = document.getElementById('add-trip-form')

function handleAddTrip(e){
    // e.preventDefault()
    const dateStart = new Date(Date.parse(document.getElementById('datestart').value))
    const dateEnd = new Date(Date.parse(document.getElementById('dateend').value))
    if(dateStart > dateEnd){
        e.preventDefault()
        document.getElementById('err').innerHTML = "Return date should be after departure date"
    }
}

addTripForm.addEventListener('submit',handleAddTrip)