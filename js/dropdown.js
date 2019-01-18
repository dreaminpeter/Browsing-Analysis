
checkstatus();

function deletelast() {
    chrome.storage.local.get(["visits"], function (result) {
        const visits = result.visits;
        visits.pop();
        chrome.storage.local.set({ visits: visits }, function() {
            checkstatus();
        });
    });
    document.getElementById("deletebuttontext").innerHTML = "Record deleted successfully";
};

function setup() {
    document.getElementById ("deletebutton").addEventListener("click", deletelast, false);
}

setup();