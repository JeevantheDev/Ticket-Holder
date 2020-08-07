class Plan {
  constructor(from, to, date, seat, medium) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.seat = seat;
    this.medium = medium;
  }
}

class UI {
  addPlanToList(plan) {
    const row = document.getElementById("plan-list");
    // Create card div
    const div = document.createElement("div");
    // Add class
    div.className = "col s12 m4";
    // Insert card
    div.innerHTML = `
        <div class="card hoverable">
            <div class="center-align card-action cyan darken-3 white-text">
                <span class="demo card-title">${plan.from} -  ${plan.to}</span>
                <a class="btn-floating halfway-fab  waves-effect waves-light"
                        > ${
                          plan.medium !== "AirLine"
                            ? plan.medium === "Bus"
                              ? `<i class="material-icons">directions_bus</i>`
                              : `<i class="material-icons">train</i>`
                            : `<i class="material-icons">flight</i>`
                        }
                </a>
                </div>
                <div class="cyan lighten-5 card-content">
                    <p>
                    Date - ${plan.date}
                    </p>
                    <p>
                    Seat No:- ${plan.seat}
                    </p>
                    <p>
                    Travel Type - ${plan.medium}
                    </p>
                    <div class="center card-action">
                        <a class="btn-floating waves-effect waves-light red">
                            <i class="delete material-icons">delete</i>
                        </a>
                    </div>
            </div>
        </div>
  `;
    row.appendChild(div);
  }

  //   Show toast
  showToast(text, className) {
    M.toast({
      html: text,
      classes: className,
      displayLength: "2000",
    });
  }

  //   Delete plan
  deletPlan(target) {
    if (target.className === "delete material-icons") {
      target.parentElement.parentElement.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("from").value = "";
    document.getElementById("to").value = "";
    document.getElementById("date").value = "";
    document.getElementById("seat").value = "";
    document.getElementById("travel_medium").value = "";
  }
}

// Local Storage class
class Store {
  static getPlans() {
    let plans;
    if (localStorage.getItem("plans") === null) {
      plans = [];
    } else {
      plans = JSON.parse(localStorage.getItem("plans"));
    }

    return plans;
  }

  static displayPlans() {
    const plans = Store.getPlans();
    plans.forEach((plan) => {
      const ui = new UI();

      // Add plan
      ui.addPlanToList(plan);

      //   Select option
      var elems = document.querySelectorAll("select");
      var instances = M.FormSelect.init(elems);

      //   Date picker
      var elems = document.querySelectorAll(".datepicker");
      var instances = M.Datepicker.init(elems);
    });
  }

  static addPlan(plan) {
    const plans = Store.getPlans();
    plans.push(plan);
    localStorage.setItem("plans", JSON.stringify(plans));
  }

  static removePlan(seat) {
    const plans = Store.getPlans();
    plans.forEach((plan, index) => {
      if (plan.seat === seat) {
        plans.splice(index, 1);
      }
    });

    localStorage.setItem("plans", JSON.stringify(plans));
  }
}

// DOM load event
document.addEventListener("DOMContentLoaded", Store.displayPlans);

// Event Listener for add plan
document.getElementById("form").addEventListener("submit", function (e) {
  // Get values
  const from = document.getElementById("from").value,
    to = document.getElementById("to").value,
    date = document.getElementById("date").value,
    seat = document.getElementById("seat").value,
    medium = document.getElementById("travel_medium").value;

  // Instantiate plan
  const plan = new Plan(from, to, date, seat, medium);

  // Instantiate UI
  const ui = new UI();

  console.log(ui);

  //   Validate
  if (from === "" || to === "" || date === "" || seat === "" || medium === "") {
    // Error toast
    ui.showToast("Please Fill the form", "danger");
  } else {
    // Add plan
    ui.addPlanToList(plan);
    // ADD tio LS
    Store.addPlan(plan);
    // Show success toast
    ui.showToast("Plan Added", "success");
    // Clear Fields
    ui.clearFields();
  }
  e.preventDefault();
});

// Event for delete
document.getElementById("plan-list").addEventListener("click", function (e) {
  const ui = new UI();

  ui.deletPlan(e.target);

  const toRemove =
    e.target.parentElement.parentElement.previousElementSibling
      .previousElementSibling.textContent;
  const seatNo = toRemove.match(/(\d+)/);
  Store.removePlan(seatNo[0]);
  ui.showToast("Plan Removed", "danger");
  setTimeout(function () {
    location.reload();
  }, 1000);
  e.preventDefault();
});
