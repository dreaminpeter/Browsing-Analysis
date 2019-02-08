const COLORS = [
  "#09546A",
  "#74B188",
  "#F3E796",
  "#EF8533",
  "#EE463A",
  "#C0355C",
  "#D6FF79",
  "#B0FF92",
  "#A09BE7",
  "#5F00BA"
];

document.querySelector("#download-button").addEventListener("click", function() {
  chrome.storage.local.get(null, function(items) { // null implies all items
    // Convert object to a string.
    var result = JSON.stringify(items);

    // Save as file
    var url = 'data:application/json;base64,' + btoa(result);
    chrome.downloads.download({
        url: url,
        filename: items.visits.id + '_db.json'
    });
});
});


function prepareChartData(categories, data) {
  const listData = Object.keys(data).map(categoryId => [
    categoryId,
    data[categoryId]
  ]);
  categories["OTHERS"] = "Others";

  listData.sort((a, b) => (a[1] > b[1] ? -1 : 1));
  let rawValues = listData;

  if (listData.length > COLORS.length) {
    rawValues = listData.slice(0, COLORS.length - 1);
    const otherValues = listData.slice(COLORS.length);
    let otherTotal = 0;

    otherValues.forEach(([categoryId, entry]) => {
      otherTotal += entry.timeSpent;
    });

    rawValues.push(["OTHERS", { timeSpent: otherTotal }]);
  }

  const values = rawValues.map(entry => entry[1].timeSpent);
  const labels = rawValues.map(entry => categories[entry[0]]);

  return [labels, values];
}

function drawChart(categories, data) {
  const ctx = document.getElementById("piechart").getContext("2d");

  const [labels, values] = prepareChartData(categories, data);

  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Browsing Analysis",
          data: values,
          backgroundColor: COLORS,
          borderColor: COLORS,
          borderWidth: 1
        }
      ]
    },
    options: {
      tooltips: {
        enabled: true,
        mode: "single",
        callbacks: {
          label: function(tooltipItems, data) {
            const timeSpent = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
            return data.labels[tooltipItems.index] + ": " + duration(timeSpent);
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

async function renderChart(threshold) {
  const visits = await getVisits();
  const data = prepareData(visits);
  const subset = threshold === 0 ? data : prepareSubset(data, threshold);
  const [categories, aggregation] = aggregateDataByCategory(subset);

  // display the chart
  drawChart(categories, aggregation);
}

checkstatus();
setInterval(checkstatus, 5000);

renderChart(7 * 24 * 60 * 60 * 1000);

document.querySelector("#chart-interval").addEventListener(
  "change",
  function(event) {
    const threshold = parseInt(event.target.value, 10);
    renderChart(threshold);
  },
  false
);
