function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

const form = document.getElementById("loan-form");
const results = document.getElementById("results");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const interest = parseFloat(document.getElementById("interest").value);
  const term = parseFloat(document.getElementById("term").value);
  const termType = document.getElementById("term-type").value;

  if (isNaN(amount) || amount <= 0 || isNaN(interest) || interest < 0 || isNaN(term) || term <= 0) {
    alert("Please enter valid positive values.");
    results.hidden = true;
    return;
  }

  const months = termType === "years" ? term * 12 : term;
  const monthlyInterest = interest / 100 / 12;

  let monthly;
  if (monthlyInterest === 0) {
    monthly = amount / months;
  } else {
    const x = Math.pow(1 + monthlyInterest, months);
    monthly = (amount * x * monthlyInterest) / (x - 1);
  }

  if (isFinite(monthly)) {
    const totalPayment = monthly * months;
    const totalInterest = totalPayment - amount;

    document.getElementById("monthly-payment").textContent = monthly.toFixed(2);
    document.getElementById("total-payment").textContent = totalPayment.toFixed(2);
    document.getElementById("total-interest").textContent = totalInterest.toFixed(2);
    results.hidden = false;

    drawChart(amount, totalInterest);
    updatePieLabels(amount, totalInterest);
  } else {
    alert("Calculation error. Please check your inputs.");
    results.hidden = true;
  }
});

let chart;
function drawChart(principal, interest) {
  const ctx = document.getElementById("loanChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [{
        data: [principal, interest],
        backgroundColor: ["#00b4db", "#ff6384"],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    }
  });
}

function updatePieLabels(principal, interest) {
  const pieLabelsContainer = document.getElementById("pieLabels");
  pieLabelsContainer.innerHTML = "";

  const total = principal + interest;
  const principalPercent = ((principal / total) * 100).toFixed(1);
  const interestPercent = ((interest / total) * 100).toFixed(1);

  const principalLabel = document.createElement("div");
  principalLabel.classList.add("pie-label");
  principalLabel.innerHTML = `<div class="color-box color-principal"></div> Principal: ${principalPercent}%`;
  
  const interestLabel = document.createElement("div");
  interestLabel.classList.add("pie-label");
  interestLabel.innerHTML = `<div class="color-box color-interest"></div> Interest: ${interestPercent}%`;

  pieLabelsContainer.appendChild(principalLabel);
  pieLabelsContainer.appendChild(interestLabel);
}
