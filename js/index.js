// Initialize flatpickr for the date input
flatpickr("#dateInput", {
    dateFormat: "d/m/Y",
    defaultDate: new Date()
  });

// Function to calculate the required changes
function calculateChange(currVal, currAvg, avgInc, day, numDays) {
  const lastMonthAvg = currAvg - avgInc;
  const currentTargetAvg = lastMonthAvg + 500;
  const todayTargetAmt = ((currentTargetAvg * numDays) - (currAvg * (day - 1))) / (numDays - day + 1);
  const changeValue = parseFloat((currVal - todayTargetAmt).toFixed(2));

  sessionStorage.setItem("currentValue", currVal)
  sessionStorage.setItem("currentAvg", currAvg)
  sessionStorage.setItem("currentAvgInc", avgInc)
  sessionStorage.setItem("lastMonthAvg", lastMonthAvg);
  sessionStorage.setItem("currentTargetAvg", currentTargetAvg);
  sessionStorage.setItem("todayTargetAmt", todayTargetAmt);
  sessionStorage.setItem("numDays", numDays);
  sessionStorage.setItem("day", day);
  sessionStorage.setItem("changeValue", changeValue);

  let todayText = "";
  if (changeValue > 0 && Math.abs(changeValue) > currVal){
    todayText = "Today : No Possible Solution";
  } else {
    if (changeValue > 0) {
      todayText = "Today : Withdraw $" + Math.abs(changeValue);
    } else {
      todayText = "Today : Deposit $" + Math.abs(changeValue);
    }
  }
  sessionStorage.setItem("todayText", todayText);

  const nextMonthAvg = currentTargetAvg + 500;
  const firstDayAmt = parseFloat((nextMonthAvg - todayTargetAmt).toFixed(2));

  let nextMonthText = "";
  if (firstDayAmt < 0 && Math.abs(firstDayAmt) > currVal){
    nextMonthText = "1st next month : No Possible Solution";
  } else {
    if (firstDayAmt < 0) {
      nextMonthText = "First Day next month : Withdraw $" + Math.abs(firstDayAmt);
    } else {
      nextMonthText = "First Day next month : Deposit $" + Math.abs(firstDayAmt);
    }
  }
  sessionStorage.setItem("nextMonthText", nextMonthText);
  
  return { todayText, nextMonthText };
}

// Event listener for Calculate button
document.getElementById("calculateBtn").addEventListener("click", () => {
  const currVal = parseFloat(document.getElementById("currBalance").value);
  const currAvg = parseFloat(document.getElementById("currAvg").value);
  const avgInc = parseFloat(document.getElementById("avgIncrease").value);
  const selectedDate = document.getElementById("dateInput").value;

  if (isNaN(currVal) || isNaN(currAvg) || isNaN(avgInc) || !selectedDate) {
    alert("Please fill out all fields correctly.");
    return;
  }

    const [dayStr, monthStr, yearStr] = selectedDate.split('/');
    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    var monthIndex = month - 1;  // because array indices start at 0
    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const monthName = monthNames[monthIndex];
    const prevMonthName = monthNames[monthIndex-1];
    const folMonthName = monthNames[monthIndex+1];
    sessionStorage.setItem("monthName", monthName);
    sessionStorage.setItem("prevMonthName", prevMonthName);
    sessionStorage.setItem("folMonthName", folMonthName);

  // Get number of days in the selected month
  const numDays = new Date(year, month, 0).getDate();

  const prevMonthNumDays = new Date(year, Number(month)-1, 0).getDate()
  sessionStorage.setItem("prevMonthNumDays", prevMonthNumDays);

  const results = calculateChange(currVal, currAvg, avgInc, day, numDays);

  document.getElementById("todayResult").textContent = results.todayText;
  document.getElementById("nextMonthResult").textContent = results.nextMonthText;

  document.getElementById("firstPage").classList.add("hidden");
  document.getElementById("secondPage").classList.remove("hidden");
});

// Event listener for Back button
document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("secondPage").classList.add("hidden");
  document.getElementById("firstPage").classList.remove("hidden");
});

// Event listener for More Info button
document.getElementById("fullTableCalc").addEventListener("click", () => {
  window.location.href = "excel.html";
});


