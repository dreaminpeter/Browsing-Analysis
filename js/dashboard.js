const COLORS = [
  "#09546A",
  "#74B188",
  "#F3E796",
  "#EF8533",
  "#EE463A",
  "#C0355C"
];

function prepareChartData(categories, data) {
  const listData = Object.keys(data).map(key => [key, data[key]]);
  categories["OTHERS"] = "Others";

  listData.sort((a, b) => (a[1] > b[1] ? -1 : 1));
  let rawValues = listData;

  if (listData.length > COLORS.length) {
    rawValues = listData.slice(0, COLORS.length - 1);
    const otherValues = listData.slice(COLORS.length);
    const otherTotal = otherValues.reduce(
      (buffer, [_, timeSpent]) => buffer + timeSpent,
      0
    );

    rawValues.push(["OTHERS", otherTotal]);
  }

  const values = rawValues.map(entry => entry[1]);
  const labels = rawValues.map(entry => categories[entry[0]]);

  console.log(values);

  //   Object.keys(data).forEach(categoryId => {
  //     labels.push(categories[categoryId]);
  //     values.push(data[categoryId]);
  //   });

  // We have more data than available colors,
  // so summarize everything into OTHERS bucket.
  //   if (labels.length > COLORS.length) {
  //   }

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
          label: "# of Votes",
          data: values,
          backgroundColor: COLORS,
          borderColor: COLORS,
          borderWidth: 1
        }
      ]
    },
    options: {
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
  console.log({ subset });

  const [categories, aggregation] = aggregateData(subset);

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
