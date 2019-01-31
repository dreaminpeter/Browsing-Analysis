
checkstatus();

function deletelast() {
    chrome.storage.local.get(["visits"], function (result) {
        const visits = result.visits;

        chrome.tabs.getSelected(null, function(tab) {
            const uri = new URL(tab.url);
            const host = uri.host;

            console.log('get url from selected tab on panel', uri, host);

            if (!visits[host]) {
                console.log('No info about ', host);
                return;
            }

            const hits = visits[host].hits;

            console.log('before', hits);
            hits.splice(-1);
            console.log('after', hits);

            visits[host].hits = hits;
            visits.count -= 1;
            chrome.storage.local.set({ visits: visits }, function() {
                checkstatus();
            });
        });
    });
    document.getElementById("deletebuttontext").innerHTML = "Record deleted successfully";
};

function setup() {
    document.getElementById ("deletebutton").addEventListener("click", deletelast, false);

}

setup();