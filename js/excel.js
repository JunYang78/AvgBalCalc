const tbody = document.querySelector('#data-table tbody');
const Row1 = document.createElement('tr');

const cell1 = document.createElement('td');
const cell2 = document.createElement('td');
const cell3 = document.createElement('td');
const cell4 = document.createElement('td');
const cell5 = document.createElement('td');

var prevDay = Number(sessionStorage.getItem("day")) - 1;
if (prevDay === 0) {
    prevDay = sessionStorage.getItem("prevMonthName") + " " + sessionStorage.getItem("prevMonthNumDays");
} else {
  prevDay = sessionStorage.getItem("monthName") + " " + prevDay
}

cell1.textContent = prevDay;
cell2.textContent = sessionStorage.getItem("monthName") + " " + Number(sessionStorage.getItem("day")) + " (Today)";
cell3.textContent = sessionStorage.getItem("currentValue");
cell4.textContent = sessionStorage.getItem("currentAvg");
cell5.textContent = sessionStorage.getItem("currentAvgInc");

Row1.appendChild(cell1);
Row1.appendChild(cell2);
Row1.appendChild(cell3);
Row1.appendChild(cell4);
Row1.appendChild(cell5);

tbody.appendChild(Row1);

// Convert sessionStorage values to numbers for arithmetic operations
var daycount = Number(sessionStorage.getItem("day"));
var changingAvg  = Number(sessionStorage.getItem("currentAvg"));
var newValue = Number(sessionStorage.getItem("currentValue")) - Number(sessionStorage.getItem("changeValue"));
var numRows = Number(sessionStorage.getItem("numDays")) - daycount + 1;

for (let i = 0; i < numRows; i++) {
    const newRow = document.createElement('tr');
    const cell1 = document.createElement('td');
    const cell2 = document.createElement('td');
    const cell3 = document.createElement('td');
    const cell4 = document.createElement('td');
    const cell5 = document.createElement('td');
    
    // Cell 1: Specific day number
    cell1.textContent = sessionStorage.getItem("monthName") + " " + Number(daycount + i); 

    if (i != numRows-1) {
      cell2.textContent = sessionStorage.getItem("monthName") + " " + Number(daycount + i + 1); 
    } else {
      cell2.textContent = sessionStorage.getItem("folMonthName") + " 1"
    }

    // Cell 2: Calculated current value difference
    cell3.textContent = newValue;

    // Cell 3: Some average calculation
    // (Make sure this formula does what you intend)
    cell4.textContent = parseFloat(((newValue*(i+1)) + (changingAvg * (daycount-1))) / (daycount+i)).toFixed(2);

    // Cell 4: Calculated difference from last month's average
    cell5.textContent = parseFloat(((newValue*(i+1)) + (changingAvg * (daycount-1)))/ 
                                    (daycount+i) - Number(sessionStorage.getItem("lastMonthAvg"))).toFixed(2); 
    
    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);
    newRow.appendChild(cell4);
    newRow.appendChild(cell5);
    tbody.appendChild(newRow);
}

// Event listener for Export button
document.getElementById('export-btn').addEventListener('click', function () {
  // Grab the HTML table element
  var table = document.getElementById('data-table');

  // Convert the HTML table to a workbook object using SheetJS
  var workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

  // Generate Excel file and trigger a download
  XLSX.writeFile(workbook, 'data.xlsx');
});

document.getElementById("lastMonthAvgLbl").textContent = "Last Month's Average: " + sessionStorage.getItem("lastMonthAvg");
document.getElementById("targetMonthAvgLbl").textContent = "Current Month's Target Average: " + sessionStorage.getItem("currentTargetAvg");
document.getElementById("changeAmtLbl").textContent = sessionStorage.getItem("todayText");
document.getElementById("firstDayAmtLbl").textContent = sessionStorage.getItem("nextMonthText");

document.getElementById("excelBackBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
