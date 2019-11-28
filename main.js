$(document).ready(function(){
    if(localStorage.getItem('token')){
      isLogin(true)
      getUserTodo()
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
  
    $('#create-todo').submit(function(event){
      event.preventDefault()
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
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      let id_token = googleUser.getAuthResponse().id_token;
      $('#front-page').hide()
      $('#main-page').show()
  }
  
  function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        Swal.fire({
          icon: 'success',
          title: 'Logout User',
          text: 'Logout Success'
        })
        localStorage.clear()
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
      $('#emailLog').val('')
      $('#passLog').val('')
      $('#front-page').hide()
      $('#main-page').show()
      localStorage.setItem('token', data.token)
      getUserTodo()
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