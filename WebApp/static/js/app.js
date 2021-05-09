$(function(){
    // $('#card-col-id').css("border", "3px solid red");
    // console.log(!$('#card-col-id').children().length > 0 )
    

    if( !$('#card-col-id').children().length > 0 ) {
            var emptyCard = '<div class="card-body-nth">  <p class="card-text">Nothing to show</p> </div>'
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
        var $cardToBeAdd =   $('<div class="card-body">' +
                            '   <p class="card-text"> Date: 2021-04-15, 22:38</p>' +  
                            '   <img class="card-img" src="data:image/jpg;base64, '+ data.Base64img+ '" >' + 
                            '   <p class="card-text">   Class Label:'+data.ResultText+ '</p>' + 
                            '</div>').hide();
        $cardContainer.prepend($cardToBeAdd);
        // Scroll & show animation 
        var $firstCard = $('.card-body').eq(0)
        $firstCard.show(500);
        $('.card-col').animate({scrollTop: $('.card-body').height()}, 300);
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
