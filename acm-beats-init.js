var extensionId = chrome.runtime.id;

$("body").append("<div id='acm-beats-overlay'></div>");

$("#acm-beats-overlay")
    .css({
    'display':'none',
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'background-color': 'white',
    'border-radius':'5px',
    'margin':'0 auto',
    'left':'50%',
    'transform':'translateX(-50%)',
    'padding':'5px',
    'z-index': 5000
}).load("chrome-extension://"+extensionId+"/popup.html", function(){
    $("#acm-beats-body [data-extension-src]").each(function(){
        $(this).prop("src", "chrome-extension://" + extensionId + "/" + $(this).data("extension-src"));
    });
    $("#acm-beats-body").css({
        "font-family":" 'HelveticaNeue-Thin'",
        "font-size":" 14px",
        "color":" #000000",
        "line-height":" 17px"
    });
    $("#acm-beats-body h1 ").css({
        "margin-top":" 12px",
        "font-family":" HelveticaNeue-Thin",
        "font-size":" 24px",
        "color":" #1792FF",
        "line-height":" 29px",
        "font-weight":" 100"
    });
    $("#acm-beats-body #logo ").css({
      "background-color":"#383838"
    });
    $("#acm-beats-body #logo img").css({
      "width":"100px",
      "height":"100px",
    });
    $("#acm-beats-body div ").css({
        "float":" left",
        "margin":" 10px"
    });
    $("#acm-beats-body label").css({
        "font-size":" 14px",
        "width":" 108px",
        "text-align":" right",
        "display":" inline-block"
    });
    $("#acm-beats-body #login label ").css({
        "font-size":" 14px",
        "width":" 58px"
    });
    $("#acm-beats-body input").css({
        "width":"auto",
        "margin-bottom":" 8px",
        "padding":" 4px"
    });
});

function setupPeditSubmitFunctionality(){
    $("#acm-beats-body input").keypress(function(e){
        if(e.keyCode==13){
                var username = $(".acm-beats-password-field#username").val();
                var password = $(".acm-beats-password-field#password").val();
                // TODO: Login

                // console.log(username);

                $.ajax({
                  type: "POST",
                  url: "https://www-s.acm.illinois.edu/beats/1104/v1/session",
                  data: {username: username, password: password},
                  success: function(res){

                    chrome.runtime.sendMessage(res, function(){
                        confirmLogin();
                    });
                    // console.log(chrome.extension.getBackgroundPage());
                    // res.token;
                  },
                  dataType: "JSON",
                  error: function(res){
                    console.log(res);
                  },
                });



        }
    })
}

    $("#acm-beats-overlay").fadeIn(function () {
        $("#acm-beats-overlay #initialRun").show();
        setupPeditSubmitFunctionality();
    });

function confirmLogin(hash){
    $("#acm-beats-overlay #initialRun").hide();
    $("#acm-beats-overlay #confirm").fadeIn();
    $("#acm-beats-overlay").delay(5000).fadeOut();
}
