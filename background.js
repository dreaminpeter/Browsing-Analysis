//check initialization
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(["visits"], function(result) {
    if (result.visits) {
      console.log("🕵️‍♂️ Digital Footprint is ready");
      return;
    }

    chrome.storage.sync.set({ visits: [] }, function() {
      console.log("🕵️‍♂️ Empty database(visits) created!");
    });
  });
});

//URL listener
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    const tablink = tab.url;

    if (tablink == undefined) {
      return;
    }

    const url = new URL(tablink);
    console.log(url);

    const currentDate = Date.now();
    console.log(tablink);
    chrome.storage.sync.get(["visits"], function(result) {
      const visits = result.visits;
      visits.push({ time: currentDate, host: url.host });
      chrome.storage.sync.set({ visits: visits }, function() {
        // Notify that we saved.
        console.log("URL saved");
      });
    });
  } else {
    return;
  }
});
