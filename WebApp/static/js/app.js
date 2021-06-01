var pageState = $('#nav-home');
//swap active page
function hidePage($hideA){
    if($hideA == $('#nav-home').attr("id") ){
        $('.side-div-container').hide('fast');
    }
    if($hideA == $('#nav-about').attr("id")){
        $('.about-container').hide('fast');
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
        $('.about-container').show('fast');
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
function registerForm(){
    $('#login-bttn').hide();
    $('.register-form').slideDown();
    $('#login-regForm').attr("action", "/sign-up");

    // $('#reg-bttn').removeAttr("onclick");
    // $('#reg-bttn').attr("type", "submit");
    $('#reg-bttn').hide();

} 
function loginForm(){
    $('.register-form').slideUp();
    $('#login-bttn').show();
    $('#login-regForm').attr("action", "/login");

    $('#reg-bttn').attr("onclick", "registerForm()");
    $('#reg-bttn').attr("type", "button");
    $('#reg-bttn').show();
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
        }
    }
}
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

    var fileUploadSuccess = function(data){      
        var $cardContainer = $('#card-col-id');
        // Remove nothing card
        var $nthCard = $('.card-body-nth');
        if( $cardContainer.children($nthCard).length > 0 ){
            $nthCard.remove();
        }
        // Add card with data
        var d = new Date();
        var $cardToBeAdd =   $('<div class="card-bodyy">' +
                            '   <div class="timeStamp">'+ d.toLocaleString()+'</div>' +  
                            '   <img class="card-img" src="data:image/jpg;base64, '+ data.Base64img+ '">' + 
                            '   <div class="cardd-text">'+data.ResultText+'</div>' + 
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

        var req = {
            url: "/",
            method: "post",
            processData: false,
            contentType: false,
            data: formData
        };
        $.ajax(req).done(fileUploadSuccess);
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

            var req = {
                url: "/",
                method: "post",
                processData: false,
                contentType: false,
                data: formData
            };
            $.ajax(req).done(fileUploadSuccess);
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
