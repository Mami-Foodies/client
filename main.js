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
  
  function backHome(){
    $('#main-page').show()
    $('#detail-page').hide()
  }

  function isLogin(status){
    if(status){
      $('#front-page').hide()
      $('#main-page').show()
      $('#detail-page').hide()
    }else{
      $('#login').hide()
      $('#register').hide()
      $('#main-page').hide()
      $('#detail-page').hide()
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
        $('#detail-page').hide()
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
        if(restaurant.user_rating.aggregate_rating >= 3){
          $('#content-resto').append(`
          <div class="card mr-2 mt-3 card-content" style="width: 18rem;" onclick="getRestaurantDetail(${restaurant.id})">
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
        }else if(restaurant.user_rating.aggregate_rating < 3 && restaurant.user_rating.aggregate_rating >= 2){
          $('#content-resto').append(`
          <div class="card mr-2 mt-3 card-content" style="width: 18rem;" onclick="getRestaurantDetail(${restaurant.id})">
            <img src="${restaurant.thumb}" class="card-img-top" alt="gambar">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="">
                <h5 class="card-title">${restaurant.name}</h5>
                <p class="text-muted">${restaurant.location.address}</p>
                <p class="card-text"></p>
                </div>
                <div>
                <a href="#" class="btn btn-warning">${restaurant.user_rating.aggregate_rating}</a>
                </div>
            </div>
          </div>
          `)
        }else{
          $('#content-resto').append(`
          <div class="card mr-2 mt-3 card-content" style="width: 18rem;" onclick="getRestaurantDetail(${restaurant.id})">
            <img src="${restaurant.thumb}" class="card-img-top" alt="gambar">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="">
                <h5 class="card-title">${restaurant.name}</h5>
                <p class="text-muted">${restaurant.location.address}</p>
                <p class="card-text"></p>
                </div>
                <div>
                <a href="#" class="btn btn-danger">${restaurant.user_rating.aggregate_rating}</a>
                </div>
            </div>
          </div>
          `)
        }
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

  function getRestaurantDetail(id){
    $.ajax({
      method:'get',
      url:`http://localhost:3000/api/zomato/restaurant/${id}`
    })
    .done(restaurant=>{
      $('#main-page').hide()
      $('#detail-page').show()
      $('#detail-one-card').empty()
      $('#detail-one-card').append(`
      <h2>${restaurant.name}</h2>
      <p>${restaurant.location.address}</p>
      `)
      $('#rating-one-card').empty()
      $('#rating-one-card').append(`
      <h1><mark>${restaurant.user_rating.aggregate_rating}</mark></h1>
      `)
      $('#number-resto').empty()
      $('#number-resto').append(`
      <h4>Nomor Telephone</h4>
      <h5 style="color:darkgreen">
      ${restaurant.phone_numbers}
      </h5>
      <p style="color: darkgray">Reservasi meja direkomendasikan</p><br />
      <h4>Harga Rata-rata</h4>
      <p>Rp. ${restaurant.average_cost_for_two}</p>
      <div id="new-rate"></div>
      <div class="d-flex">
      <select class="custom-select mr-3" id="inputGroupSelect01">
        <option selected>Choose...</option>
        <option value="USD">USD</option>
        <option value="JPY">JPY</option>
        <option value="SGD">SGD</option>
      </select>
      <button class="btn btn-success" onclick="getConvertedRate(${id})">Convert</button>
      </div>
      <br />
      <h4>Masakan</h4>
      <p style="color: red">
      ${restaurant.cuisines}</p>
      `)

      $('#resto-time').empty()
      $('#resto-time').append(`
      <h4>Jam Buka</h4>
      <p>${restaurant.timings}</p>
      <br />
      <h4>Alamat</h4>
      <p>${restaurant.location.address}</p>
      <br />
      `)
      $('#list-highlight').empty()
      let hg = restaurant.highlights
      hg.forEach(element => {
        $('#list-highlight').append(`
        <li>${element}</li>
        `)
      })
      $('#head-image').empty()
      $('#head-image').append(`
      <img class="w-100"
      src="${restaurant.thumb}"
      class="d-block caro-detail" alt="gambar" style="vertical-align: middle"/>
      `)
      const restObj = {
        name: restaurant.name,
        latitude: restaurant.location.latitude,
        longitude: restaurant.location.longitude
      }
      getPlaceId(restObj)
    })
    .fail(err=>{
      console.log(err)
    })
  
  }
  
  function getPlaceId(objRestLocation){
    $.ajax({
      method: 'get',
      url: `http://localhost:3000/api/gmap/getplaceidbylonglat/?restname=${objRestLocation.name}&latitude=${objRestLocation.latitude}&longitude=${objRestLocation.longitude}`
    })
    .done(placeId=>{
      $('#restaurant-location').empty()
      $('#restaurant-location').append(`
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
  

  function getConvertedRate(id){
    let currency = $('#inputGroupSelect01').val()
    $.ajax({
      method:'get',
      url:`http://localhost:3000/api/zomato/restaurant/${id}`
    })
    .done(restaurant => {
        const individualMenu={
          price:restaurant.average_cost_for_two,
          convertFrom:'IDR',
          convertInto:`${currency}`
        }
        getRate(individualMenu)
    })
    .fail(err => {
      console.log(err)
    })
    
  }


  function getRate(individualMenu){
    $.ajax({
      method:'get',
      url:`http://localhost:3000/api/currency/getcurrencyrate/?price=${individualMenu.price}&convertFrom=${individualMenu.convertFrom}&convertInto=${individualMenu.convertInto}`
    })
    .done(result=>{
      $('#new-rate').empty()
      $('#new-rate').append(`
        <p style="color: red">${individualMenu.convertInto} ${result}</p>
      `)
    })
    .fail(err=>{
      console.log(err)
    })
  }












