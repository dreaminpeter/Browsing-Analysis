chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("UP RUNNING!");
    });
  });
  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var tablink = tab.url;
        console.log(tablink);
        chrome.storage.local.set({'value': tablink}, function() {
            // Notify that we saved.
            console.log('URL saved');
          });
    }
  })
  