async function renderTable() {
  const visits = await getVisits();
  const data = prepareData(visits);
  const stats = aggregateDataByHost(data);
  const entries = aggregationToArray(stats, "host");

  let rows = "";

  entries.forEach(entry => {
    rows += "<tr>";
    rows += `<td>${entry.host}</td>`;
    rows += `<td>${entry.category}</td>`;
    rows += `<td>${entry.hitsCount}</td>`;
    rows += `<td>${duration(entry.timeSpent)}</td>`;
    rows += "</tr>";
  });

  document.querySelector("#tableBody").innerHTML = rows;
}

renderTable();
setInterval(renderTable, 5000);
