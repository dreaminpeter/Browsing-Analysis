function getVisits() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["visits"], function(result) {
      resolve(result.visits);
    });
  });
}

function setVisits(visits) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ visits }, resolve);
  });
}

function prepareData(visits) {
  const keys = Object.keys(visits).filter(key => key.includes("."));
  const data = [];

  keys.forEach(key => {
    const hostInfo = visits[key];

    hostInfo.hits.forEach(hit => {
      data.push({
        ...hit,
        duration: hit.end - hit.start,
        host: key,
        category: hostInfo.category,
        hitsCount: hostInfo.count
      });
    });
  });

  return data;
}

function prepareSubset(data, threshold) {
  const time = Date.now() - threshold;

  return data.filter(hit => hit.end >= time);
}

function aggregateDataByCategory(data) {
  const aggregation = {};
  const categoryNames = {};

  data.forEach(entry => {
    const categoryId = entry.category.id;
    categoryNames[categoryId] = entry.category.name;

    if (!aggregation[categoryId]) {
      aggregation[categoryId] = {
        timeSpent: 0
      };
    }

    aggregation[categoryId].timeSpent += entry.duration;
  });

  return [categoryNames, aggregation];
}

function aggregateDataByHost(data) {
  const aggregation = {};

  data.forEach(entry => {
    if (!aggregation[entry.host]) {
      aggregation[entry.host] = {
        category: entry.category.name,
        timeSpent: 0,
        hitsCount: entry.hitsCount
      };
    }

    aggregation[entry.host].timeSpent += entry.duration;
  });

  return aggregation;
}

function aggregationToArray(aggregation, prop) {
  const result = [];

  Object.keys(aggregation).forEach(key => {
    const entry = aggregation[key];
    entry[prop] = key;
    result.push(entry);
  });

  return result;
}

function duration(durationInMilliseconds) {
  let minutes = Math.ceil(durationInMilliseconds / 1000 / 60);
  let hours;
  let duration = "";

  if (minutes > 60) {
    hours = parseInt(minutes / 60, 10);
    minutes -= hours * 60;
    duration += `${hours} ${plural(hours, "hour")}`;
  }

  if (minutes > 0) {
    duration += ` ${minutes} ${plural(minutes, "minute")}`;
  }

  return duration;
}

function plural(count, word) {
  if (count === 1) {
    return word;
  } else {
    return `${word}s`;
  }
}

function checkstatus() {
  chrome.storage.local.get(["visits"], function(result) {
    if (!result.visits) {
      return;
    }

    document.getElementById("status").innerHTML = "The extension is running!";
    document.getElementById("visits-count").innerHTML = result.visits.count;
    const runtimeElement = document.getElementById("runtime");

    if (runtimeElement) {
      runtimeElement.innerHTML = duration(Date.now() - result.visits.firstHit);
    }
  });
}
