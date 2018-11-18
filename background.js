//check initialization
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['visits'], function(result) {
    console.log('Value currently is ' + result.visits);
    if (result.visits == undefined) {
      var currentDate = Date.now();
      chrome.storage.sync.set({'visits': "*extension initialized!*" ,currentDate});
      console.log("Initialized");
    }else{
      console.log("Ready");
    }
  });
});
//URL listener
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    var tablink = tab.url;
    console.log(tablink);
    chrome.storage.local.set({ value: tablink }, function() {
      // Notify that we saved.
      console.log("URL saved");
    });
  }
});
