$(document).ready(function(){
    if(localStorage.getItem('token')){
      isLogin(true)
      fetchRestaurant()
    }else{
      isLogin(false)
    }
    
    // welcome animation
    $('#welcome-text').delay(300).animate({opacity:1},600)
    $('.get-start').delay(1300).animate({'margin-top':'+=-80px', opacity:1},800)
  
    $('#register-form').submit(function(event){
      event.preventDefault()
      register()
    })
  
    $('#login-form').submit(function(event){
      event.preventDefault()
      login()
    })
  
    $('#setLogin').click(function(event){
      event.preventDefault()
    })
  
    $('#setRegister').click(function(event){
      event.preventDefault()
    })

    $('#search-resto').submit(function(event){
      event.preventDefault()
      let value = $('#searchRes').val()
      fetchRestaurant(value)
    })
  
    $('#back-home').click(function(){
      $('#main-look').show('fast')
      $('#login').hide('fast')
      $('#register').hide('fast')
    })
  })
  
  function isLogin(status){
    if(status){
      $('#front-page').hide()
      $('#main-page').show()
    }else{
      $('#login').hide()
      $('#register').hide()
      $('#main-page').hide()
    }
  }
  
  function onSignIn(googleUser) {
      let id_token = googleUser.getAuthResponse().id_token;
      $.ajax({
          url: 'http://localhost:3000/user/signin/google',
          method: 'POST',
          data:{
              idToken: id_token
          }
      })
      .done(response=>{
        localStorage.setItem('token', response.token)
        fetchRestaurant('')
        Swal.fire({
            icon: 'success',
            title: 'Login User',
            text: 'Login Success'
        })
        $('#front-page').hide()
        $('#main-page').show()
      })
      .fail(err=>{
        Swal.fire({
            icon: 'error',
            title: 'Loging Google',
            text: 'Login Error'
        })
      })
  }
  
  function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        localStorage.clear()
        Swal.fire({
          icon: 'success',
          title: 'Logout User',
          text: 'Logout Success'
        })
        $('#front-page').show()
        $('#main-look').show()
        $('#main-page').hide()
        $('#login').hide()
        $('#register').hide()
      });
  }
  
  function register(){
      let username = $('#nameReg').val()
      let email = $('#emailReg').val()
      let password = $('#passReg').val()
      $.ajax({
        url: 'http://localhost:3000/user/register',
        method: 'POST',
        data: {username, email, password}
      })
      .done(data => {
        $('#nameReg').val('')
        $('#emailReg').val('')
        $('#passReg').val('')
        Swal.fire({
          icon: 'success',
          title: 'register user',
          text: `register ${data.username} success!`
        })
      })  
      .fail(err => {
        Swal.fire({
          icon: 'error',
          title: 'register error',
          text: `${err.responseJSON.message[0]}`
        })
      })
  }
  
  function login(){
    let email = $('#emailLog').val()
    let password = $('#passLog').val()
    $.ajax({
      url: 'http://localhost:3000/user/login',
      method: 'POST',
      data: { email, password}
    })
    .done(data => {
      fetchRestaurant('')
      $('#emailLog').val('')
      $('#passLog').val('')
      $('#front-page').hide()
      $('#main-page').show()
      localStorage.setItem('token', data.token)
      Swal.fire({
        icon: 'success',
        title: 'User Login',
        text: `${data.user.username} Login Success!`
      })
    })
    .fail(err => {
      Swal.fire({
        icon: 'error',
        title: 'User Login',
        text: `${err.responseJSON.message}`
      })
    })
  }
  
  function setToLogin(){
      $('#register').hide('fast')
      $('#login').show('fast')
  }
  
  function setToRegister(){
    $('#register').show('fast')
    $('#login').hide('fast')
  }
  
  function showRegister(){
    $('#register').show('fast')
    $('#main-look').hide('fast')
  }

  function fetchRestaurant(value){
    let place;
    if(!value || value == ''){
      place = 'KebayoranLama'
    }else{
      place = value
    }
    $.ajax({
      url: 'http://localhost:3000/api/zomato/search',
      method: 'POST',
      data: { place }
    })
    .done((response) => {
      $('#content-resto').empty()
      $('#searchRes').val('')
      response.forEach(restaurant => {
        $('#content-resto').append(`
        <div class="card mr-2 mt-3 card-content" style="width: 18rem;" onclick="detailRestaurant(${restaurant.id})">
          <img src="${restaurant.thumb}" class="card-img-top" alt="gambar">
          <div class="card-body d-flex flex-column justify-content-between">
              <div class="">
              <h5 class="card-title">${restaurant.name}</h5>
              <p class="text-muted">${restaurant.location.address}</p>
              <p class="card-text"></p>
              </div>
              <div>
              <a href="#" class="btn btn-success">${restaurant.user_rating.aggregate_rating}</a>
              </div>
          </div>
        </div>
        `)
      });
      Swal.fire({
        icon: 'success',
        title: 'Fetching Resto',
        text: 'Success!'
      })
    })
    .fail(err => {
      console.log(err)
    })
  }

  function detailRestaurant(id){

    $.ajax({
      url: `http://localhost:3000/api/zomato/restaurant/${id}`,
      method: 'GET'
    })
    .done(response => {
      const responseFiltered = {
        name: response.name,
        locality: response.locality,
        address: response.location.address,
        longitude: response.longtitude,
        latitude: response.latitude

      }
      console.log(response)  
    })
    .fail(err => {
      
    })
  }












  // gawean JAP
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