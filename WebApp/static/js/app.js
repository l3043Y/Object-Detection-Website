var pageState = $('#nav-home');
var formState = 'login';
var userName = 'global'
var curent_user = null;
// update app state
$( document ).ready( updateAppState );
function updateAppState(){
    $.ajax({
        url: "/update/state",
        type: 'POST',
        success: function(jsonObject){
            console.log(jsonObject);
        }
    });
}

// handle login and register via AJAX to Flask API
$("#login-regForm").submit(function(event){
    event.preventDefault();
    console.log(formState);
    var myform = document.getElementById("login-regForm");
    var fd = new FormData(myform );
    if(formState == 'login'){
        $.ajax({
            url: "/login",
            data: fd,
            cache: false,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(jsonObject){
                handleAuthRespond(jsonObject);
            }
            
        });
    }
    else if(formState == 'register'){
        $.ajax({
            url: "/sign-up",
            data: fd,
            cache: false,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(jsonObject){
                handleAuthRespond(jsonObject);
            }
        });
    }
});

function logoutUser(){
    $.ajax({
        url: "/logout",
        type: 'POST',
        success: function(jsonObject){
            handleAuthRespond(jsonObject);
        }
    });
}

function handleAuthRespond(jsonObject){
    console.log('SUCCESS');
    console.log(jsonObject);
    if(jsonObject.user == 'global'){
        alertMsg(jsonObject.msg, false);
        $('#nav-login').show();
        $('#user-bar').remove();
        userName = 'global';
        curent_user = null;
    }

    if(jsonObject.success && jsonObject.user != 'global'){
        console.log('AUTHENTICATED');
        userName = jsonObject.user.firstName
        curent_user = jsonObject;
        // alert('Welcome! '+userName);
        alertMsg('Welcome! '+userName, curent_user.success);
        clickHome();
        $('#nav-login').hide();
    }else{
        alertMsg(curent_user.msg, curent_user.success);
        userName = 'global';
        curent_user = null;
    }
}
// alert message
function alertMsg(message, alertType){
    var bootstrapAlter = ''
    if(alertType){
        bootstrapAlter =
        '<div id="user-bar" class="alert alert-success alter-dismissable fade show" role="alert">'
        +message+
            '<button type="button" onclick="logoutUser()" style="float:right;" class="btn btn-outline-dark btn-sm">Logout '+
            '</button>'+
        '</div>'
    }
    else{
         bootstrapAlter = 
        '<div class="alert alert-danger alter-dismissable fade show" role="alert">'
        +message+
            '<button type="button" class="close" data-dismiss="alert">'+
            '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>'
    }
    $('#alert-msg').append(bootstrapAlter);
}

//swap active page
function hidePage($hideA){
    if($hideA == $('#nav-home').attr("id") ){
        $('.side-div-container').fadeOut('fast');
    }
    if($hideA == $('#nav-about').attr("id")){
        $('.about-container').fadeOut('fast');
    } 
    if($hideA == $('#nav-login').attr("id")){
        $('.auth-container').hide('fast');
    }
}
function showPage($showB){
    if($showB == $('#nav-home').attr("id")){
        $('.side-div-container').fadeIn(400);
    }
    if($showB == $('#nav-about').attr("id")){
        $('.about-container').fadeIn('fast');
    }
    if($showB == $('#nav-login').attr("id")){
        $('.auth-container').show('fast');
    }
}
function swapActivePage($hideA, $showB){
    if($hideA.hasClass('active') && !$showB.hasClass('active')){
        $hideA.removeClass('active');
        hidePage($hideA.attr("id"));
        $showB.addClass('active');
        showPage($showB.attr("id"));
        pageState = $showB;
    }
}
// handle nav home about
function clickHome() {
    if(pageState != $('#nav-home').attr("id") ){
        swapActivePage(pageState, $('#nav-home'));
    }
}
function clickAbout() {
    if(pageState != $('#nav-about').attr("id") ){
        swapActivePage(pageState, $('#nav-about'));
    }
}
// handle Login
function clickAuthentication(){
    if(pageState != $('#nav-login').attr("id") ){
        swapActivePage(pageState, $('#nav-login'));
    }
}
// prepare registor form
function loginRegisterForm(){
    if(formState == 'login'){
        $('#login-bttn').hide();
        $('#reg-bttn').hide();

        $('.register-form').slideDown();
        formState = 'register';
    }
    else if(formState == 'register'){
        $('#login-bttn').show();
        $('#reg-bttn').show();

        $('.register-form').slideUp();
        formState = 'login';
    }
}

function clickLightMode(){
    if($('#btn-lightMode').text() == '☀️'){
        $('#btn-lightMode').text('🌘');

        if(! $('#content-main-body').hasClass('dark-bg') ){
            
            $('#content-main-body').addClass('dark-bg');
            $(':root').css('--base-color','rgba(70,70,70,1)');
            $(':root').css('--text-color','rgba(200,200,200,1)');
            $('img').css('filter','brightness(75%)');
            // $('#nav-home > a').addClass('dark-theme-panel');

            $('#lightMode-container > a:hover').css('textShadow','0 0 20px #FFFFFF');
            $('#alert-msg > .alert-success').css('color', '#c3e6cb');
            $('#alert-msg > .alert-success').css('background-color', '#84a38c87');
        }

    } else{
        $('#btn-lightMode').text('☀️');

        if($('#content-main-body').hasClass('dark-bg') ){

            $('#content-main-body').removeClass('dark-bg');
            $(':root').css('--base-color','rgba(255,255,255,1)');
            $(':root').css('--text-color','black');
            $('img').css('filter','brightness(100%)');

            $('#nav-home > a').removeClass('dark-theme-panel');

            $('#lightMode-container > a:hover').css('textShadow','0 0 20px #effa5e');
            $('#alert-msg > .alert-success').css('color', '#155724');
            $('#alert-msg > .alert-success').css('background-color', '#d4edda');
        }
    }
}

//handle main ui element
$(function(){
    // render readme markdown from github
    var options = {
        owner:'l3043Y',
        repo:'Object-Detection-Website'};
    $('#readme').readme(options);
        
    if( !$('#card-col-id').children().length > 0 ) {
            var emptyCard = '<div class="card-body-nth">  <p class="cardd-text">Nothing to show</p> </div>'
            $('.card-col').append(emptyCard)
        }

    function fileUploadSuccess(data){ 
        console.log(data);     
        var $cardContainer = $('#card-col-id');
        // Remove nothing card
        var $nthCard = $('.card-body-nth');
        if( $cardContainer.children($nthCard).length > 0 ){
            $nthCard.remove();
        }
        // Add card with data
        var d = new Date();
        var $cardToBeAdd =   $('<div class="card-bodyy">' +
                            '   <div class="cardd-text">User: '+userName+' at '+ d.toLocaleString()+'</div>' +  
                            '   <img class="card-img" src="data:image/jpg;base64, '+ data.base64Img+ '">' + 
                            '   <div class="cardd-text">'+data.resultText+'</div>' + 
                            '</div>').hide();
        $cardContainer.prepend($cardToBeAdd);
        // Scroll & show animation 
        var $firstCard = $('.card-bodyy').eq(0)
        $firstCard.slideDown(400);
        $('.card-col').animate({scrollTop: $('.card-bodyy').height()}, 400);
    };

    var fileUploadFail = function(data){};

    var dragHandler = function(evt){
        evt.preventDefault();
    };

    var dropHandler = function(evt){
        evt.preventDefault();
        var files = evt.originalEvent.dataTransfer.files;

        var formData = new FormData();
        formData.append("img_file", files[0]);
        $.ajax({
            url: "/",
            method: "post",
            processData: false,
            contentType: false,
            data: formData,
            success: function(jsonObject){
                fileUploadSuccess(jsonObject);
            }
        })
    };

    var dropHandlerSet = {
        dragover: dragHandler,
        drop: dropHandler
    };

    $(".droparea.upload").on(dropHandlerSet);
    $('#clickUpload').change(function(e){
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append("img_file", file);
        $.ajax({
            url: "/",
            method: "post",
            processData: false,
            contentType: false,
            data: formData,
            success: function(jsonObject){
                fileUploadSuccess(jsonObject);
            }
        })
    });

});
    // fileUploadSuccess(false); // called to ensure that we have initial data
    // var refreshFilenameList = function(data){
    //     var templateText = $("#tableTemplate").html();
    //     var template = Handlebars.compile(templateText);
    //     var renderedText = template(data);
    //     var renderedDom = $(renderedText);
    //     $("#tablearea").empty();
    //     $("#tablearea").append(renderedDom);
    // };
