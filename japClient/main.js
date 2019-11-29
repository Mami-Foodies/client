$(document).ready(function(){
    getRestaurantDetail()
    
    
  })


function getRestaurantDetail()
{
  // maquis belezza
  const dummyId = 7402064
  $.ajax({
    method:'get',
    url:`http://localhost:3000/api/zomato/restaurant/${dummyId}`
  })
  .done(restaurant=>{
    $('#restaurant-info').empty()
    $('#restaurant-info').append(`
    <div class="">
      <h5 class="card-title">${restaurant.name}</h5>
      <p class="text-muted">${restaurant.location.address}</p>
      <p class="card-text">Phone</p>
      <p class="text-muted">${restaurant.phone_numbers}</p>
      <p class="card-text">Cuisine</p>
      <p class="text-muted">${restaurant.cuisines}</p>
      <p class="card-text">Opening Hours</p>
      <p class="card-text"></p>
    </div>
    `)


    const restObj = {
      name: restaurant.name,
      latitude: restaurant.location.latitude,
      longitude: restaurant.location.longitude
    }
    console.log("TCL: restObj", restObj)
    
    getPlaceId(restObj)



    const individualMenu={
      price:10000,
      convertFrom:'IDR',
      convertInto:'USD'
    }

    getConvertedRate(individualMenu)


  })
  .fail(err=>{
    console.log(err)
  })

}



function getPlaceId(objRestLocation)
{
  $.ajax({
    method: 'get',
    url: `http://localhost:3000/api/gmap/getplaceidbylonglat/?restname=${objRestLocation.name}&latitude=${objRestLocation.latitude}&longitude=${objRestLocation.longitude}`
  })
  .done(placeId=>{
    $('#restaurant-location').empty()
    $('#restaurant-location').append(`
      woiwoiwowiowio
      ${placeId}

      <div class="mt-5">
        <!-- Highlight a place or an address -->
        <iframe width="100%" height="450" frameborder="0" style="border:0"
        src="https://www.google.com/maps/embed/v1/place?q=place_id:${placeId}&key=AIzaSyB7M7GX2lx2Jd72pCYcHb0mpZed0XoQEcU" allowfullscreen></iframe>

    `)

  })
  .fail(err=>{
    console.log(err)
  })
}




function getConvertedRate(individualMenu)
{
  $.ajax({
    method:'get',
    url:`http://localhost:3000/api/currency/getcurrencyrate/?price=${individualMenu.price}&convertFrom=${individualMenu.convertFrom}&convertInto=${individualMenu.convertInto}`
  })
  .done(result=>{
    $('#converted-rate').empty()
    $('#converted-rate').append(`
      ${individualMenu.convertInto} ${result}
    `)
  })
  .fail(err=>{
    console.log(err)
  })
  
}