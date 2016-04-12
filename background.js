// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when a page has pedit data attributes
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlMatches: '(youtube|soundcloud)\.com' },
                    })
                ],
                // And shows the extension's page action.
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});


/* Logic */

chrome.pageAction.onClicked.addListener(function(tab) {

  if(getCookie("token") == ""){
    console.log("No Token");
    chrome.tabs.executeScript({
        file: 'acm-beats-init.js'
    });
  } else {

    chrome.tabs.getSelected(null,function(tab){

      var oReq = new XMLHttpRequest();
      oReq.onreadystatechange = function (oEvent) {
          if (oReq.readyState === 4) {
              if (oReq.status === 200 || oReq.status === 400 ) {
                console.log(oReq.responseText)
              } else {
                 console.log("Error", oReq.statusText);
                 document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                 chrome.tabs.executeScript({
                     file: 'acm-beats-init.js'
                 });
              }
          }
      };

      oReq.open("POST", "https://www-s.acm.illinois.edu/beats/1104/v1/queue/add");
      oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      try{
        oReq.send("token=" + getCookie("token") + "&url=" + tab.url);
      } catch(e){
        console.log(e);
      }
    });
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
    // console.log(request);

    if(request.token){
      var tomorrow = new Date();
      tomorrow.setDate( tomorrow.getDate() + 1 );
      document.cookie="token="+request.token+";" +  "expires="+ tomorrow + ";";
    }

    // if (request.greeting == "hello")
    //   sendResponse({farewell: "goodbye"});
  });

  function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
      }
      return "";
  }
