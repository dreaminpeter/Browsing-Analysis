function checkstatus() {
  chrome.storage.local.get(["visits"], function(result) {
    if (!result.visits) {
      return;
    }

    document.getElementById("status").innerHTML = "The extension is running!";
    document.getElementById("visits-count").innerHTML = result.visits.count;
  });
}
