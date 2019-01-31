function generateTable(data){
    prepareData(result.visits);

}
function prepareData(visits) {
  const data = [];

    Object.keys(visits).forEach(function (host) {
      if (!visits[host].hits) {
        return;
      }

      visits[host].hits.forEach(function(hit) {
          const info = {
              host: host,
              time: hit
          };

          data.push(info);
      });
    });

    data.sort(function(a, b) {
      if (a.time > b.time) {
        return -1;
      } else {
        return 1;
      }
    });

    console.log(data);
}

function checkstatus() {
  chrome.storage.local.get(["visits"], function(result) {
    if (!result.visits) {
      return;
    }

    document.getElementById("status").innerHTML = "The extension is running!";
    document.getElementById("visits-count").innerHTML = result.visits.count;
  //runtime
    let totalTimeInMinutes = Math.floor((Date.now() - result.visits.firstHit) / 1000 / 60);
    console.log('-------->', totalTimeInMinutes);

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
