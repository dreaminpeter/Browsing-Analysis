document.querySelector("#agree-button").addEventListener("click", function() {
    window.close();
}, false);

document.querySelector("#disagree-button").addEventListener("click", function() {
    chrome.management.uninstallSelf();
}, false);