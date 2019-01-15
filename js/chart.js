google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(boot);

function boot() {
  chrome.storage.sync.get(["visits"], function(result) {
    console.log(result);
  });
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["Categories", "Total Views"],
    ["Streaming Media", 15],
    ["Shopping", 6],
    ["Technology and Computing", 3],
    ["Music and Audio", 8],
    ["Video & Computer Games", 10],
    ["Social Networking", 9]
  ]);

  var options = {
    title: "My Footprint"
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );

  chart.draw(data, options);
}
