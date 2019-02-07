async function setupQuestionnaire() {
  document.querySelector("#aware-yes-button").addEventListener(
    "click",
    async function() {
      document.querySelector("#aware-yes-button").disabled = true;
      document.querySelector("#aware-no-button").disabled = true;

      const visits = await getVisits();
      visits.wereYouAware = true;
      await setVisits(visits);

      document.querySelector("#question-1").classList.add("d-none");
      document.querySelector("#question-2").classList.remove("d-none");
    },
    false
  );

  document.querySelector("#aware-no-button").addEventListener(
    "click",
    async function() {
      document.querySelector("#aware-yes-button").disabled = true;
      document.querySelector("#aware-no-button").disabled = true;

      const visits = await getVisits();
      visits.wereYouAware = false;
      await setVisits(visits);

      document.querySelector("#question-1").classList.add("d-none");
      document.querySelector("#question-2").classList.remove("d-none");
    },
    false
  );

  document.querySelector("#change-habits-yes-button").addEventListener(
    "click",
    async function() {
      document.querySelector("#change-habits-yes-button").disabled = true;
      document.querySelector("#change-habits-no-button").disabled = true;

      const visits = await getVisits();
      visits.wantToChangeHabits = true;
      await setVisits(visits);

      document.querySelector("#question-2").classList.add("d-none");
      document.querySelector("#thank-you").classList.remove("d-none");
    },
    false
  );

  document.querySelector("#change-habits-no-button").addEventListener(
    "click",
    async function() {
      document.querySelector("#change-habits-yes-button").disabled = true;
      document.querySelector("#change-habits-no-button").disabled = true;

      const visits = await getVisits();
      visits.wantToChangeHabits = false;
      await setVisits(visits);

      document.querySelector("#question-2").classList.add("d-none");
      document.querySelector("#thank-you").classList.remove("d-none");
    },
    false
  );

  document.querySelector("#close").addEventListener(
    "click",
    function() {
      window.close();
    },
    false
  );

  const visits = await getVisits();
  const data = prepareData(visits);
  const subset = prepareSubset(data, 86400 * 1000);
  const [categories, aggregation] = aggregateDataByCategory(subset);
  const stats = aggregationToArray(aggregation, "categoryId");

  stats.sort(function(a, b) {
    return a.timeSpent > b.timeSpent ? -1 : 1;
  });

  const { categoryId, timeSpent } = stats[0];
  const categoryName = categories[categoryId];

  [...document.querySelectorAll(".category")].forEach(function(node) {
    node.innerHTML = categoryName;
  });

  [...document.querySelectorAll(".time-spent")].forEach(function(node) {
    node.innerHTML = duration(timeSpent);
  });
}

setupQuestionnaire();
