function getCategory(host) {
  return fetch("https://webshrinker.herokuapp.com/category?host=" + host)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      const categories = json.categories;

      categories.sort(function(a, b) {
        const scoreA = parseFloat(a.score);
        const scoreB = parseFloat(b.score);

        if (scoreA > scoreB) {
          return -1;
        } else if (scoreB > scoreA) {
          return 1;
        } else {
          return 0;
        }
      });

      return categories[0].label;
    });
}

//check initialization
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(["visits"], function(result) {
    if (result.visits) {
      console.log("🕵️‍♂️ Digital Footprint is ready");
      return;
    }

    chrome.storage.local.set({ visits: { count: 0, firstHit: null } }, function() {
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
    chrome.storage.local.get(["visits"], async function(result) {
      const visits = result.visits;
      let visitInfo = visits[url.host];

      // Increment the total number of visits.
      visits.count += 1;

      // Save first hit.
      if (!visits.firstHit) {
        visits.firstHit = Date.now();
      }

      if (!visitInfo) {
        visitInfo = {
          category: await getCategory(url.host),
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
