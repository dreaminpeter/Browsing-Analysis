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

        return scoreA > scoreB ? -1 : 1;
      });

      let candidate = null;

      // first try to get whatever has the WS<NUMBER> suffix.
      [candidate] = categories.filter(category => category.id.match(/-WS\d+$/));

      console.log("filter by WS", candidate);

      if (candidate) {
        return { id: candidate.id, name: candidate.label };
      }

      // get whatever has the higher score.
      console.log("sorry! this is all i got for you", candidate);
      candidate = categories[0];

      return { id: candidate.id, name: candidate.label };
    });
}

//check initialization
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(["visits"], function(result) {
    if (result.visits) {
      console.log("🕵️‍♂️ Digital Footprint is ready");
      return;
    }

    chrome.storage.local.set(
      { visits: { count: 0, firstHit: null } },
      function() {
        console.log("🕵️‍♂️ Empty database(visits) created!");
      }
    );
  });
});

function saveSession(tab) {
  return new Promise(async (resolve, reject) => {
    const visits = await getVisits();
    const session = visits.session;

    if (session) {
      const hostInfo = visits[session.host];
      hostInfo.hits.push({ start: session.start, end: Date.now() });
      visits[session.host] = hostInfo;
      visits.session = null;
    }

    const hasUrl = "url" in tab;

    if (hasUrl) {
      const url = new URL(tab.url);
      const host = url.host;
      visits.session = { host, start: Date.now() };
    }

    await setVisits(visits);
    resolve();
  });
}

function initializeHost(tab) {
  return new Promise(async (resolve, reject) => {
    const visits = await getVisits();
    const hasUrl = "url" in tab;

    if (!hasUrl) {
      return resolve();
    }

    const url = new URL(tab.url);
    const host = url.host;

    if (!visits[host]) {
      visits[host] = {
        hits: [],
        category: await getCategory(host),
        count: 0
      };

      await setVisits(visits);
    }

    resolve();
  });
}

function getTab(tabId) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.get(tabId, resolve);
    } catch (error) {
      console.log("error while getting tab", error);
    } finally {
      resolve();
    }
  });
}

// This event is triggered whenever a tab is activated,
// but it's not triggered when the url changes.
chrome.tabs.onActivated.addListener(async function(info) {
  const tab = await getTab(info.tabId);

  if (!tab || tab.status !== "complete") {
    return;
  }

  await initializeHost(tab);
  await saveSession(tab);
});

// This event is triggered whenever the tab url changes,
// including page reloads.
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  if (tab.status !== "complete") {
    return;
  }

  if (!tab.url) {
    return;
  }

  await initializeHost(tab);
  await saveSession(tab);

  const visits = await getVisits();

  if (!visits.firstHit) {
    visits.firstHit = Date.now();
  }

  const host = new URL(tab.url).host;

  visits.count += 1;
  visits[host].count += 1;

  await setVisits(visits);
});

// This event is triggered whenever the tab is closed.
chrome.tabs.onRemoved.addListener(async function(tabId) {
  const tab = await getTab(tabId);
  await initializeHost(tab);
  await saveSession(tab);
});

chrome.runtime.onInstalled.addListener(function (details) {

  if (details.reason == "install") { //reason ( enum of "install", "update", or "chrome_update" )
      window.open('../consent.html')
  }
});