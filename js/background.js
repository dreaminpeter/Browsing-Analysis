async function check48hourUpload() {
  const visits = await getVisits();

  if (!visits.firstHit) {
    return;
  }

  const after48Hours = Date.now() - visits.firstHit >= 172800000;

  if (!after48Hours || visits.databaseuploaded) {
    return;
  }
  //generate db file & upload
  chrome.storage.local.get(null, function(items) {
    // null implies all items
    // Convert object to a string.
    var result = JSON.stringify(items);

    // Save as file
    var url = "data:application/json;base64," + btoa(result);

    //upload
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      method: "POST",
      headers,
      mode: "cors",
      body: result
    };

    fetch("https://browser-history.herokuapp.com", options).then(() => {
      visits.databaseuploaded = true;
      chrome.storage.local.set(visits, function() {
        console.log("Uploaded database");
      });
    });
  });
}

async function check24hourNotice() {
  const visits = await getVisits();

  if (!visits.firstHit) {
    return;
  }

  const after24Hours = Date.now() - visits.firstHit >= 86400000;

  if (!after24Hours || visits.displayed24hourNotice) {
    return;
  }

  window.open("reduce-usage-time-form.html");

  visits.displayed24hourNotice = true;
  await setVisits(visits);
}

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

      if (candidate) {
        return { id: candidate.id, name: candidate.label };
      }

      // get whatever has the higher score.
      candidate = categories[0];

      return { id: candidate.id, name: candidate.label };
    });
}

//check initialization
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    //reason ( enum of "install", "update", or "chrome_update" )
    window.open("../consent.html");
  }

  chrome.storage.local.get(["visits"], function(result) {
    if (result.visits) {
      console.log("🕵️‍♂️ Digital Footprint is ready");
      return;
    }

    chrome.storage.local.set(
      {
        visits: {
          count: 0,
          firstHit: null,
          id: (Math.random() * Math.random()).toString(36).substr(2, 12),
          installedAt: Date.now()
        }
      },
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

    if (!visits.consentedAt) {
      return;
    }

    if (session) {
      console.log("=> End ongoing session for", session.host);
      const hostInfo = visits[session.host];
      hostInfo.hits.push({ start: session.start, end: Date.now() });
      visits[session.host] = hostInfo;
      visits.session = null;
    }

    const hasUrl = "url" in tab;

    if (hasUrl) {
      const url = new URL(tab.url);
      const host = url.host;

      console.log("=> Start new session for", host);

      visits.session = { host, start: Date.now() };
    }

    await setVisits(visits);
    resolve();
  });
}

function initializeHost(tab) {
  return new Promise(async (resolve, reject) => {
    const visits = await getVisits();

    if (!visits.consentedAt) {
      return;
    }

    const hasUrl = "url" in tab;

    if (!hasUrl) {
      return resolve();
    }

    const url = new URL(tab.url);
    const host = url.host;
    let hostInfo = visits[host];

    if (!hostInfo) {
      hostInfo = {
        hits: [],
        category: null,
        count: 0
      };
    }

    if (!hostInfo.category) {
      try {
        hostInfo.category = await getCategory(host);
      } catch (error) {}
    }

    visits[host] = hostInfo;
    await setVisits(visits);
    resolve();
  });
}

function getTab(tabId) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.get(tabId, function(tab) {
        resolve(tab);
      });
    } catch (error) {
      console.log("error while getting tab", error);
      resolve();
    }
  });
}

// This event is triggered whenever a tab is activated,
// but it's not triggered when the url changes.
chrome.tabs.onActivated.addListener(async function(info) {
  const tab = await getTab(info.tabId);

  if (!tab) {
    await saveSession({});
    return;
  }

  if (tab.status !== "complete") {
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
chrome.tabs.onRemoved.addListener(async function() {
  await saveSession({});
});

chrome.idle.onStateChanged.addListener(function(state) {
  if (state === "active") {
    return;
  }

  saveSession({});
});

chrome.windows.onFocusChanged.addListener(async function() {
  await saveSession({});

  chrome.windows.getCurrent(function(window) {
    if (!window.focused) {
      return;
    }

    chrome.tabs.getAllInWindow(window.id, async function(tabs) {
      const activeTab = tabs.filter(tab => tab.active)[0];

      if (activeTab) {
        await saveSession(activeTab);
      }
    });
  });
});

setInterval(check24hourNotice, 5000);
setInterval(check48hourUpload, 5000);
