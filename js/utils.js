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

function generateTable(data) {
  prepareData(result.visits);
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
        category: hostInfo.category
      });
    });
  });

  return data;
}

function prepareSubset(data, threshold) {
  const time = Date.now() - threshold;

  return data.filter(hit => hit.end >= time);
}

function aggregateData(data) {
  const aggregation = {};
  const categoryNames = {};

  data.forEach(entry => {
    const categoryId = entry.category.id;
    categoryNames[categoryId] = entry.category.name;

    if (!aggregation[categoryId]) {
      aggregation[categoryId] = 0;
    }

    aggregation[categoryId] += entry.duration;
  });

  return [categoryNames, aggregation];
}

function checkstatus() {
  chrome.storage.local.get(["visits"], function(result) {
    if (!result.visits) {
      return;
    }

    document.getElementById("status").innerHTML = "The extension is running!";
    document.getElementById("visits-count").innerHTML = result.visits.count;
    //runtime
    let totalTimeInMinutes = Math.floor(
      (Date.now() - result.visits.firstHit) / 1000 / 60
    );
    console.log("-------->", totalTimeInMinutes);

    if (totalTimeInMinutes < 1) {
      totalTimeInMinutes = "Less than a minute";
    } else {
      totalTimeInMinutes = `${totalTimeInMinutes} minutes`;
    }

    const runtimeElement = document.getElementById("runtime");

    if (runtimeElement) {
      runtimeElement.innerHTML = totalTimeInMinutes;
    }

    //table
    // const tbody = document.getElementById("tableBody");
    //   for (var i = 0; i < result.visits.count; i++) {
    //       var tr = "<tr>";
    //
    //       /* Verification to add the last decimal 0 */
    //       if (results.visits[i].value.toString().substring(result.visits[i].value.toString().indexOf('.'), result.visits[i].value.toString().length) < 2)
    //           results.visits[i].value += "0";
    //
    //       /* Must not forget the $ sign */
    //       tr += "<td>" + results.visits[i].key + "</td>" + "<td>$" + results.visits[i].value.toString() + "</td></tr>";
    //
    //       /* We add the table row to the table body */
    //       tbody.innerHTML += tr;
    //   }
  });
}
