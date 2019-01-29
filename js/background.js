//check initialization
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(["visits"], function(result) {
    if (result.visits) {
      console.log("🕵️‍♂️ Digital Footprint is ready");
      return;
    }

    chrome.storage.local.set({ visits: { count: 0 } }, function() {
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
    chrome.storage.local.get(["visits"], function(result) {
      const visits = result.visits;
      let visitInfo = visits[url.host];

      // Increment the total number of visits.
      visits.count += 1;

      if (!visitInfo) {
        visitInfo = {
          category: "",
          hits: []
        };
      }

      visitInfo.hits.push(currentDate);
      visits[url.host] = visitInfo;

      // visits.push({ time: currentDate, host: url.host });
      chrome.storage.local.set({ visits: visits }, function() {
        // Notify that we saved.
        console.log("URL saved");
      });
    });
  } else {
    return;
  }
});
