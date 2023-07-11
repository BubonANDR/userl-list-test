import "./pages/index.css";

("use strict");

let Url = "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users";
let data, sortCol;
let sortAsc = 1;
let page = 1;
const usersContainer = document.querySelector(".grid-container");
let seachForm = document.forms.seachform;
let seachRow = seachForm.elements.seachrow;
let resetSeachButton = seachForm.elements.clearbutton;
let prevButton = document.getElementById("prevButton");
let nextButton = document.getElementById("nextButton");
let popup = document.querySelector(".popup__overflow");
let popupForm = document.forms.popupform;

document.addEventListener("DOMContentLoaded", loadData(Url));

async function loadData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const message = ` ОШИБКА: ${response.status}`;
    throw new Error(message);
  }
  data = await response.json();
  renderTable(data);
}

const createItem = (user, email, regDate, raiting) => {
  const template = document.querySelector("#users-template");
  const item = template.content.cloneNode(true);
  item.querySelector(".template__user").textContent = user;
  item.querySelector(".template__email").textContent = email;
  item.querySelector(".template__reg-date").textContent = new Date(
    regDate
  ).toLocaleDateString(undefined, {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });
  item.querySelector(".template__raiting").textContent = raiting;
  item.querySelector(".cancel-icon").addEventListener("click", (evt) => {
    popup.classList.add("popup__overflow_visible");
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      deleteUser(evt);
      popup.classList.remove("popup__overflow_visible");
    });
  });
  return item;
};

const deleteUser = (evt) => {
  let userForDelete = evt.target
    .closest("tr")
    .querySelector(".template__user").textContent;
  data = data.filter((dt) => dt.username !== userForDelete);
  renderTable(data);
};

function renderTable(data) {
  usersContainer.innerHTML = `<tr class=\"table-row\">
     <th class=\"labels-text\">Имя пользователя</th>
     <th class=\"labels-text\">E-mail</th>
     <th id=\"dateSort\" class=\"labels-text\">Дата регистрации</th>
     <th id=\"reitingSort\" class=\"labels-text\">Рейтинг</th>
        </tr>`;
  data.slice(page * 5 - 5, page * 5).forEach((element) => {
    let currentitem = createItem(
      element.username,
      element.email,
      element.registration_date,
      element.rating
    );
    usersContainer.append(currentitem);
  });
  pageSetting();
}

const pageSetting = () => {
  let pageNumber = document.querySelector(".page-number");
  pageNumber.innerHTML = ` Page ${page} `;
};

function sort(thisSort) {
  if (sortCol === thisSort) sortAsc = -1 * sortAsc;
  sortCol = thisSort;

  if (thisSort === "dateSort") {
    data.sort(
      (a, b) =>
        (new Date(a.registration_date) - new Date(b.registration_date)) *
        sortAsc
    );
  }
  if (thisSort === "reitingSort") {
    data.sort((a, b) => (parseInt(a.rating) - parseInt(b.rating)) * sortAsc);
  }
  renderTable(data);
}

seachForm.addEventListener("submit", (e) => e.preventDefault());

popupForm.elements.nobutton.addEventListener("click", () => {
  popup.classList.remove("popup__overflow_visible");
});

seachRow.addEventListener("input", (e) => {
  e.preventDefault();
  data = data.filter(
    (el) =>
      el.username.toLowerCase().includes(seachRow.value.toLowerCase()) ||
      el.email.toLowerCase().includes(seachRow.value.toLowerCase())
  );
  seachRow.value.length === 0
    ? (resetSeachButton.style.visibility = "hidden")
    : (resetSeachButton.style.visibility = "visible");
  renderTable(data);
});

resetSeachButton.addEventListener("click", () => {
  loadData(Url);
  resetSeachButton.style.visibility = "hidden";
});

document.querySelector(".date-sorting").addEventListener("click", () => {
  document
    .querySelector(".raiting-sorting")
    .classList.remove("sorting-link_active");
  document.querySelector(".date-sorting").classList.add("sorting-link_active");
  sort("dateSort");
  resetSeachButton.style.visibility = "visible";
});
document.querySelector(".raiting-sorting").addEventListener("click", () => {
  document
    .querySelector(".date-sorting")
    .classList.remove("sorting-link_active");
  document
    .querySelector(".raiting-sorting")
    .classList.add("sorting-link_active");
  sort("reitingSort");
  resetSeachButton.style.visibility = "visible";
});

nextButton.addEventListener("click", () => {
  if (page < Math.ceil(data.length / 5)) {
    page += 1;
    renderTable(data);
    prevButton.style.visibility = "visible";
  }
  if (page === Math.ceil(data.length / 5)) {
    nextButton.style.visibility = "hidden";
  }
});

prevButton.addEventListener("click", () => {
  if (page > 1) {
    page -= 1;
    renderTable(data);
    nextButton.style.visibility = "visible";
  }
  if (page === 1) {
    prevButton.style.visibility = "hidden";
  }
});
