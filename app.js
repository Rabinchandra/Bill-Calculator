const form = document.querySelector(".form");
const resultBody = document.querySelector(".result tbody");
let employeesDatas = [];

// Delete event which to be called when delete button is clicked
const addDeleteEmployeeEvent = () => {
  const delBtns = Array.from(document.querySelectorAll(".delete-employee"));

  delBtns.forEach((b, index) => {
    b.addEventListener("click", () => {
      if (confirm("Are you sure want to delete")) {
        // Removing  from employeesDatas Array
        employeesDatas.splice(index, 1);
        // Saving the modified employeesDatas to localStorage
        localStorage.setItem("employeesDatas", JSON.stringify(employeesDatas));
        // Re-render employee datas
        renderEmployeesDatas();
      }
    });
  });
};

// Rendering Employee Datas to the DOM
const renderEmployeesDatas = () => {
  const totalGross = employeesDatas.reduce((t, e) => (t += e.gross), 0);

  resultBody.innerHTML = "";

  employeesDatas.forEach((e) => {
    resultBody.innerHTML += `
            <tr>
                <td>${e.name}</td>
                <td>${e.officiating_pay} (${e.gp} + ${e.pb})</td>
                <td>${e.officiating_pay}</td>
                <td>${e.da}</td>
                <td>${e.hra}</td>
                <td>${e.sca}</td>
                <td>${e.ta}</td>
                <td>${e.gross}</td>
                <td>
                    <button class="btn btn-danger delete-employee">Delete</button>
                </td>
            </tr>
        `;
  });

  resultBody.innerHTML += `
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total Gross :</strong></td>
            <td><strong>${totalGross}</strong></td>
        </tr>
    `;

  // After rendering the elements (tr, td, etc.), add delete event to the delete buttons
  addDeleteEmployeeEvent();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Getting the user input values
  let name = document.querySelector("#name").value;
  let sca = parseInt(document.querySelector("#sca").value);
  let ta = parseInt(document.querySelector("#ta").value);
  let inc_percent = parseInt(
    document.querySelector("#increment_percent").value
  );
  let pb = parseInt(document.querySelector("#pb").value);
  let gp = parseInt(document.querySelector("#gp").value);

  let inc, officiating_pay, da, hra;

  // Calculation starts
  inc = parseInt(((gp + pb) * inc_percent) / 100);

  // To make inc ends with 0
  for (; inc % 10 !== 0; inc++);

  pb = inc + pb;
  officiating_pay = pb + gp;
  da = Math.round((officiating_pay * 141) / 100);
  hra = (officiating_pay * 10) / 100;

  const newEmployee = {
    name,
    pb,
    gp,
    basic: `${officiating_pay} ${pb + gp}`,
    officiating_pay,
    da,
    hra,
    sca,
    ta,
    gross: officiating_pay + da + hra + sca + ta,
  };

  employeesDatas.push(newEmployee);

  localStorage.setItem("employeesDatas", JSON.stringify(employeesDatas));
  renderEmployeesDatas();
});

// Load datas from localStorage
document.querySelector("#load-data").addEventListener("click", () => {
  const datas = localStorage.getItem("employeesDatas");

  if (datas !== null) {
    employeesDatas = JSON.parse(datas);
    renderEmployeesDatas();
  }
});
