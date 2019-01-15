function checkstatus() {
    chrome.storage.sync.get(["visits"], function (result) {
        if (!result.visits) {
            return;
        }

        document.getElementById("status").innerHTML = "The extension is running!";
        document.getElementById("visits-count").innerHTML = result.visits.length;
    });
};
checkstatus();