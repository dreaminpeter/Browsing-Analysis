checkstatus();

chrome.storage.local.get(["visits"], function (result) {
    const visits = result.visits;
    let totalTimeInMinutes = 0;

    visits.forEach(visit => {
        totalTimeInMinutes += (Date.now() - visit.time) / 1000 / 60;
    });

    console.log('-------->', totalTimeInMinutes);
});