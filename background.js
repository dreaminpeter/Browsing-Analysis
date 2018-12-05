//check initialization
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['inintialization'], function(result) {
    console.log('Value currently is ' + result.inintialization);
    if (result.inintialization == undefined) {
      var visits = [  Date.now() + ',' + 'inintialization'];
      chrome.storage.sync.set({'visits': visits}, function(){
        console.log('Empty database(visits) created!');

      });
      var currentDate = Date.now();
      chrome.storage.sync.set({'inintialization': '*extension initialized!*' + currentDate});
      console.log(result.inintialization);
    }else{
      console.log('Ready');
    }
  });
});
//URL listener
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    const tablink = tab.url;
    if (tablink == undefined) {
      return
    }
    var currentDate = Date.now();
    console.log(tablink);
    chrome.storage.sync.get(['visits'], function(result){
      var visits = result.visits;
      visits.push(currentDate + ',' + tablink);
      chrome.storage.sync.set({'visits': visits}, function() {
        // Notify that we saved.
        console.log("URL saved");
    });
    
    });
  }else{
    return
  }
});
