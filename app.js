// Chart.js and daily check-in functionality
(() => {
  const form = document.getElementById("checkin-form");
  const dateInput = document.getElementById("date");
  const ratingsFields = ["energy", "fatigue", "cravings", "focus", "mood", "sleep", "headaches", "bloating"];
  const mealsFields = ["breakfast", "lunch", "dinner", "snacks"];
  const mealsTableBody = document.getElementById("mealsTableBody");
  const chartCtx = document.getElementById("ratingsChart").getContext("2d");
  let entries = JSON.parse(localStorage.getItem("dailyCheckinEntries") || "{}");
  const todayStr = new Date().toISOString().slice(0, 10);
  dateInput.value = todayStr;
  let ratingsChart;

  function saveEntries() {
    localStorage.setItem("dailyCheckinEntries", JSON.stringify(entries));
  }

  function renderMealsTable() {
    mealsTableBody.innerHTML = "";
    const sortedDates = Object.keys(entries).sort();
    sortedDates.forEach((date) => {
      const e = entries[date];
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${date}</td><td>${e.breakfast || ""}</td><td>${e.lunch || ""}</td><td>${e.dinner || ""}</td><td>${e.snacks || ""}</td>`;
      mealsTableBody.appendChild(tr);
    });
  }

  function prepareChartData() {
    const sortedDates = Object.keys(entries).sort();
    const labels = sortedDates;
    const datasets = ratingsFields.map((field, i) => {
      return {
        label: field.charAt(0).toUpperCase() + field.slice(1),
        data: sortedDates.map((date) => entries[date][field] || null),
        borderColor: ["#2563eb", "#ea580c", "#16a34a", "#db2777", "#8b5cf6", "#0ea5e9", "#f43f5e", "#22c55e"][i],
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3
      };
    });
    return { labels, datasets };
  }

  function renderChart() {
    if (ratingsChart) ratingsChart.destroy();
    const data = prepareChartData();
    ratingsChart = new Chart(chartCtx, {
      type: "line",
      data,
      options: {
        responsive: true,
        interaction: { mode: "nearest", intersect: false },
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            min: 0,
            max: 10,
            ticks: { stepSize: 1 },
            title: { display: true, text: "Rating (1 to 10)" }
          },
          x: { title: { display: true, text: "Date" } }
        }
      }
    });
  }

  function fillFormIfExists(date) {
    if (entries[date]) {
      const e = entries[date];
      ratingsFields.forEach((field) => { document.getElementById(field).value = e[field] || ""; });
      mealsFields.forEach((field) => { document.getElementById(field).value = e[field] || ""; });
    } else {
      ratingsFields.forEach((field) => { document.getElementById(field).value = ""; });
      mealsFields.forEach((field) => { document.getElementById(field).value = ""; });
    }
  }

  dateInput.addEventListener("change", () => {
    fillFormIfExists(dateInput.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = dateInput.value;
    const newEntry = {};
    ratingsFields.forEach((field) => {
      newEntry[field] = parseInt(document.getElementById(field).value, 10) || null;
    });
    mealsFields.forEach((field) => {
      newEntry[field] = document.getElementById(field).value.trim();
    });
    entries[date] = newEntry;
    saveEntries();
    renderMealsTable();
    renderChart();
  });

  fillFormIfExists(todayStr);
  renderMealsTable();
  renderChart();


// Rating UI logic

 // const ratingsFields = ["energy", "fatigue", "cravings", "focus", "mood", "sleep", "headaches", "bloating"];

const descriptions = {
    energy: {
      1: "Unable to function, constant fatigue, need to lie down",
      2: "Struggling to stay awake, low motivation, heavy limbs",
      3: "Barely functioning, frequent yawning, can't concentrate",
      4: "Slow to start, groggy, can do light tasks only",
      5: "Baseline – okay, not great, can do usual activities",
      6: "Mild energy, able to work, but not full power",
      7: "Good energy, motivated, slight fatigue in evening",
      8: "High energy, mentally sharp, physically ready",
      9: "Very high energy, excited to move, focused and present",
      10: "Peak performance – energized, mentally clear, unstoppable"
    },
    fatigue: {
      1: "No fatigue at all, feeling fresh",
      2: "Barely noticeable tiredness",
      3: "Slightly tired but manageable",
      4: "Mild fatigue, still productive",
      5: "Average fatigue level",
      6: "Moderate fatigue, slowing down",
      7: "Noticeably tired, affecting focus",
      8: "Strong fatigue, pushing through",
      9: "Heavy fatigue, needing rest soon",
      10: "Exhausted, unable to continue tasks"
    },
    cravings: {
      1: "No cravings, totally satisfied",
      2: "Minimal cravings, easy to ignore",
      3: "Occasional cravings",
      4: "Mild urge for snacks or sweets",
      5: "Some cravings, manageable",
      6: "Frequent cravings, mildly distracting",
      7: "Strong cravings, thinking about food often",
      8: "Very strong cravings, hard to resist",
      9: "Nearly uncontrollable cravings",
      10: "Overwhelming cravings, acted on impulse"
    },
    focus: {
      1: "Unable to focus at all",
      2: "Very poor concentration",
      3: "Distracted easily, hard to complete tasks",
      4: "Below average focus",
      5: "Moderate focus, can complete tasks",
      6: "Above average focus with occasional distractions",
      7: "Good focus, mostly on task",
      8: "Very focused, productive day",
      9: "Extremely sharp focus",
      10: "Laser focus, totally immersed in tasks"
    },
    mood: {
      1: "Very low mood, hopelessness",
      2: "Sad, down, teary",
      3: "Low motivation, withdrawn",
      4: "Below average mood",
      5: "Neutral or okay mood",
      6: "Slightly upbeat",
      7: "Good mood, smiling",
      8: "Happy, energetic mood",
      9: "Joyful, very positive outlook",
      10: "Euphoric, top of the world feeling"
    },
    sleep: {
      1: "No sleep at all",
      2: "Very poor sleep, barely rested",
      3: "Interrupted sleep, low rest",
      4: "Light sleep, waking often",
      5: "Average sleep, not fully rested",
      6: "Slept okay, mild grogginess",
      7: "Good quality sleep",
      8: "Very restful sleep",
      9: "Excellent sleep, fully recharged",
      10: "Best sleep ever, woke up refreshed"
    },
    headaches: {
      1: "No headaches",
      2: "Very faint headache",
      3: "Occasional, mild headache",
      4: "Dull, manageable pain",
      5: "Noticeable headache",
      6: "Distracting headache",
      7: "Throbbing pain, difficult to focus",
      8: "Strong headache, needs rest or meds",
      9: "Very intense headache",
      10: "Debilitating migraine-level pain"
    },
    bloating: {
      1: "No bloating at all",
      2: "Very slight bloating",
      3: "Occasionally noticeable bloating",
      4: "Mild bloating",
      5: "Somewhat bloated",
      6: "Moderate bloating, uncomfortable",
      7: "Noticeably bloated, tight clothing",
      8: "Very bloated, distended stomach",
      9: "Painfully bloated",
      10: "Severe bloating, needs relief"
    }
  };

  function syncRating(fieldId, value) {
    const input = document.getElementById(fieldId);
    const slider = document.querySelector(`.rating-slider[data-target='${fieldId}']`);
    const desc = document.getElementById(`desc-${fieldId}`);
    input.value = value;
    slider.value = value;
    if (desc) desc.textContent = descriptions[fieldId]?.[value] || "";
    document.querySelectorAll(`.rating-buttons[data-target='${fieldId}'] button`).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === value.toString());
    });
  }

  function initRatingsUI() {
    ratingsFields.forEach(fieldId => {
      const container = document.querySelector(`.rating-buttons[data-target='${fieldId}']`);
      if (!container) return;
      container.innerHTML = "";
      for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.textContent = i;
        btn.dataset.value = i;
        btn.addEventListener("click", () => syncRating(fieldId, i));
        container.appendChild(btn);
      }

      const input = document.getElementById(fieldId);
      const slider = document.querySelector(`.rating-slider[data-target='${fieldId}']`);
      if (input && slider) {
        input.addEventListener("input", () => syncRating(fieldId, parseInt(input.value)));
        slider.addEventListener("input", () => syncRating(fieldId, parseInt(slider.value)));
      }
    });
  }

  initRatingsUI();
})();