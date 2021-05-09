$(function(){
    // $('#card-col-id').css("border", "3px solid red");
    // console.log(!$('#card-col-id').children().length > 0 )

    if( !$('#card-col-id').children().length > 0 ) {
            var emptyCard = '<div class="card-body-nth">  <p class="card-text">Nothing to show</p> </div>'
            $('.card-col').append(emptyCard).show('slow')
        }


    var fileUploadSuccess = function(data){      
        // console.log("data: ");
        // console.dir(data);
        // console.dir(data[0].ResultText);
        var cardContainer = $('#card-col-id');
        var nthCard = '.card-body-nth';
        if( cardContainer.children(nthCard).length > 0 ){
            $(nthCard).remove();
        }

        var cardToBeAdd =   '<div class="card-body">' +
                            '   <p class="card-text"> Date: 2021-04-15, 22:38</p>' +  
                            '   <img class="card-img" src="data:image/jpg;base64, '+ data.Base64img+ '" >' + 
                            '   <p class="card-text">   Class Label:'+data.ResultText+ '</p>' + 
                            '</div>';
        
        cardContainer.prepend(cardToBeAdd);
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
