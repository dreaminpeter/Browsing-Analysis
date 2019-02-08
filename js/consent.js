document.querySelector("#agree-button").addEventListener(
  "click",
  async function() {
    const visits = await getVisits();
    visits.consentedAt = Date.now();
    await setVisits(visits);

    window.close();
  },
  false
);

document.querySelector("#disagree-button").addEventListener(
  "click",
  function() {
    chrome.management.uninstallSelf();
  },
  false
);
