import { addSelectionToBasket } from "./jsustils/addAccessories.js";
import { changeItemQuantity, deletItem } from "./jsustils/modifyChosenItems.js";
import { saveData } from "./jsustils/saveData.js";
import {
  fetchAccesories,
  fetchAccesoryPrice,
} from "./jsustils/fetchAccessories.js";

// document.getElementsByClassName("buy-form")[0].style.display = "none";
document.getElementsByClassName("buy-form")[0].classList.add("el-unvisible");
document.getElementsByClassName("buy-form")[0].classList.remove("el-flex");
document.getElementById("car-list").classList.remove("el-unvisible");
document.getElementById("search-form").classList.remove("el-unvisible");
document.getElementById("pagination-controls").classList.remove("el-unvisible");
document.getElementById("car-list").classList.add("el-flex");
document.getElementById("search-form").classList.add("el-flex");
document.getElementById("pagination-controls").classList.add("el-block");
let today = new Date();
let futureDate = new Date(today.setDate(today.getDate() + 14));
function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}
document
  .getElementsByClassName("buy-form")[0]
  .querySelector("input[type='date']").min = formatDate(futureDate);
document
  .getElementsByClassName("buy-form")[0]
  .querySelector("input[type='date']").value = formatDate(futureDate);

// cars data downloading and dynamic creation of car list

async function fetchAndDisplayCars() {
  try {
    const response = await fetch("assets/cars/cars.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const ul = document.getElementById("car-list");
    data.forEach((item, index) => {
      const li = document.createElement("li");
      let liContent = `<div class="description" id="${item.id}">
                          <div class="car-name">
                            <span class="item-att-val">${item.car_name}</span>
                          </div>
                          <img class="car-main-picture" src="${
                            item.main_picture
                          }" alt="car"/>
                          <div class="brand">
                            <span class="item-att">Marka:</span><span class="item-att-val">${
                              item.car_brand
                            }</span>
                          </div>
                          <div class="power">
                            <span class="item-att">Moc silnika:</span><span class="item-att-val">${
                              item.engine_power
                            } KM</span>
                          </div>
                          <div class="year">
                            <span class="item-att">Rok produkcji:</span><span class="item-att-val">${
                              item.manufacture_year
                            }</span>
                          </div>
                          <div class="milage">
                            <span class="item-att">Przebieg:</span><span class="item-att-val">${
                              item.mileage
                            } km</span>
                          </div>
                          <div class="price">
                            <span class="item-att">Cena:</span><span class="item-att-val">${item.price.toLocaleString(
                              "pl-PL"
                            )} PLN</span>
                          </div>
                          <button class="order-config" data-index="${index}">Konfiguracja zamówienia</button>
                        </div>`;
      li.innerHTML = liContent;
      ul.appendChild(li);
    });

    // Pagination initialization
    const items = ul.querySelectorAll("li");
    const pageCount = 4;
    let currentPage = 1;

    const updateList = () => {
      const totalPage = Math.ceil(items.length / pageCount);
      document.getElementById(
        "page-info"
      ).textContent = `Strona ${currentPage} z ${totalPage}`;
      const start = (currentPage - 1) * pageCount;
      const end = start + pageCount;
      items.forEach((item, index) => {
        if (index >= start && index < end) {
          item.classList.add("el-flex");
          item.classList.remove("el-unvisible");
        } else {
          item.classList.add("el-unvisible");
          item.classList.remove("el-flex");
        }
      });
      document.getElementById("next-btn").disabled = currentPage === totalPage;
    };

    const nextPage = () => {
      const totalPage = Math.ceil(items.length / pageCount);
      if (currentPage < totalPage) {
        currentPage++;
        updateList();
      }
    };

    const prevPage = () => {
      if (currentPage > 1) {
        currentPage--;
        updateList();
      }
    };

    document.getElementById("next-btn").addEventListener("click", nextPage);
    document.getElementById("prev-btn").addEventListener("click", prevPage);

    updateList();

    return items;
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
}

let carsAll = await fetchAndDisplayCars();

// adding event listener to order-config button

document.getElementById("car-list").addEventListener("click", async (e) => {
  if (e.target.className === "order-config") {
    e.preventDefault();

    const index = e.target.getAttribute("data-index");

    // const description = document.getElementById(`ca_${index}`);
    const carId = `ca_${index}`;
    async function fetchAndDisplayCar() {
      try {
        const response = await fetch("assets/cars/cars.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const chosenCar = data.find((car) => car.id === carId);
        return chosenCar;
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    }
    const chosenCar = await fetchAndDisplayCar();
    console.log("chosenCar in buyform", chosenCar);

    const brand = chosenCar.car_brand;
    const carImage = chosenCar.main_picture;
    // const carImage = description
    //   .querySelector(".car-main-picture")
    //   .cloneNode(true);
    // carImage.className = "car-image-inner";
    const carName = chosenCar.car_name;
    const year = chosenCar.manufacture_year;
    const power = chosenCar.engine_power;
    const milage = chosenCar.mileage;
    const price = chosenCar.price;

    const buyForm = document.querySelector(".buy-form");

    buyForm
      .querySelector(".car-id")
      .querySelector(".item-att-val").textContent = carId;
    buyForm.querySelector(".brand").querySelector(".item-att-val").textContent =
      brand;
    buyForm
      .querySelector(".car-name")
      .querySelector(".item-att-val").textContent = carName;
    const carImageInner = document.createElement("img");
    carImageInner.className = "car-image-inner";
    carImageInner.src = carImage;
    carImageInner.alt = "car";
    buyForm.querySelector(".car-image").appendChild(carImageInner);
    buyForm.querySelector(".year").querySelector(".item-att-val").textContent =
      year;
    buyForm.querySelector(".power").querySelector(".item-att-val").textContent =
      power;
    buyForm
      .querySelector(".milage")
      .querySelector(".item-att-val").textContent = milage;
    buyForm.querySelector(".price").querySelector(".item-att-val").textContent =
      price;
    buyForm.dataset.carId = carId;
    document.getElementById("total-price").textContent = price;

    const formData = {
      id: carId,
      car_brand: brand,
      car_name: carName,
      car_image: carImage,
      manufacture_year: year,
      engine_power: power,
      mileage: milage,
      price: price,
      total_price: price,
    };
    const orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));

    if (orderConfigData) {
      const chosenCar = orderConfigData.find((car) => car.id === carId);
      if (chosenCar) {
        const ul = document.getElementById("chosen-accesories");
        if (chosenCar.chosen_accesories) {
          chosenCar.chosen_accesories.forEach((accesory) => {
            const li = document.createElement("li");
            li.className = "chosen-accesory";
            li.innerHTML = `<span class="accesory-id">${accesory.accesoryId}</span>
                              <span class="accesory-type">${accesory.accesoryType}</span>
                              <span class="assesory-name">${accesory.assesoryName}</span>
                              <span class="accesory-price">Cena szt.: PLN</span>
                              <button class="accesory-more">+</button>
                              <span id="accesory-quantity">${accesory.accesoryQuantity}</span>
                              <button class="accesory-less">-</button>
                              <button class="accesory-delete">Usuń</button>
                              <span class="accesory-total-price">Cena łącznie: <span class="accesory-total-price-amount"></span> PLN</span>`;
            // li.querySelector(".accesory-price").style.display = "none";
            // li.querySelector(".accesory-id").style.display = "none";
            li.querySelector(".accesory-price").classList.add("el-unvisible");
            li.querySelector(".accesory-id").classList.add("el-unvisible");
            ul.appendChild(li);
            const buttonMore = li.querySelector(".accesory-more");
            const buttonLess = li.querySelector(".accesory-less");
            const buttonDelete = li.querySelector(".accesory-delete");
            let apiUrl;
            if (accesory.accesoryId.startsWith("ak")) {
              apiUrl = "assets/parts/batteries.json";
            } else if (accesory.accesoryId.startsWith("op")) {
              apiUrl = "assets/parts/tires.json";
            } else if (accesory.accesoryId.startsWith("ol")) {
              apiUrl = "assets/parts/oils.json";
            }

            fetchAccesoryPrice(apiUrl, accesory.accesoryId).then(
              ({ accesoryPrice, accesoryType }) => {
                const quantityInput = li.querySelector("#accesory-quantity");
                const accesoryTotalPrice = li.querySelector(
                  ".accesory-total-price-amount"
                );
                const accesoryPriceIn = li.querySelector(".accesory-price");
                accesoryTotalPrice.textContent =
                  accesoryPrice * parseInt(quantityInput.textContent);
                accesoryPriceIn.textContent = `Cena szt.: ${accesoryPrice} PLN`;
                changeItemQuantity(
                  "add",
                  buttonMore,
                  accesoryPrice,
                  chosenCar.id
                );
                changeItemQuantity(
                  "subtract",
                  buttonLess,
                  accesoryPrice,
                  chosenCar.id
                );
                deletItem(buttonDelete, chosenCar.id);
              }
            );
          });
          if (chosenCar.chosen_accesories.length > 0) {
            // document.getElementById("accesories").style.display = "block";
            document.getElementById("accesories").classList.add("el-block");
            document
              .getElementById("accesories")
              .classList.remove("el-unvisible");
          }
        }

        const orderDetails = document.getElementById("order-details");
        if (chosenCar.order_details) {
          console.log("chosenCar.order_details", chosenCar.order_details);
          const radioCash = orderDetails.querySelector("#cash");
          const radioLeasing = orderDetails.querySelector("#leasing");
          const inputFirstName = orderDetails.querySelector("#first-name");
          const inputLastName = orderDetails.querySelector("#last-name");
          const inputDelivery = orderDetails.querySelector("#delivery");
          radioCash.checked = chosenCar.order_details.cash;
          radioLeasing.checked = chosenCar.order_details.leasing;
          inputFirstName.value = chosenCar.order_details["first-name"] || "";
          inputLastName.value = chosenCar.order_details["last-name"] || "";
          inputDelivery.value = chosenCar.order_details.delivery;
        }
      } else {
        orderConfigData.push(formData);
        localStorage.setItem(
          "orderConfigData",
          JSON.stringify(orderConfigData)
        );
      }
    } else {
      // localStorage.setItem("orderConfigData", JSON.stringify([]));
      let orderConfigData = [];
      orderConfigData.push(formData);
      localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
    }

    // document.getElementById("car-list").style.display = "none";
    // document.getElementById("search-form").style.display = "none";
    // document.getElementById("pagination-controls").style.display = "none";
    document.getElementById("car-list").classList.add("el-unvisible");
    document.getElementById("search-form").classList.add("el-unvisible");
    document
      .getElementById("pagination-controls")
      .classList.add("el-unvisible");
    document.getElementById("car-list").classList.remove("el-flex");
    document.getElementById("search-form").classList.remove("el-flex");
    document.getElementById("pagination-controls").classList.remove("el-block");
    // buyForm.style.display = "flex";
    buyForm.classList.add("el-flex");
    buyForm.classList.remove("el-unvisible");
    // document.querySelector("main").style.width = "800px";
    // document.querySelector("main").style.justifyContent = "center";
    document.querySelector("main").classList.add("main-after-config");

    const batteriesSelect = document.getElementById("batteries");
    fetchAccesories("assets/parts/batteries.json", batteriesSelect);
    const oilsSelect = document.getElementById("oils");
    fetchAccesories("assets/parts/oils.json", oilsSelect);
    const tiresSelect = document.getElementById("tires");
    fetchAccesories("assets/parts/tires.json", tiresSelect);
  }
});

// adding event listeners for buttons related to adding new accessories
document.body.addEventListener("click", (e) => {
  if (e.target && e.target.id === "add-batteries-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
    // document.getElementById("accesories").style.display = "block";
    document.getElementById("accesories").classList.add("el-block");
    document.getElementById("accesories").classList.remove("el-unvisible");
  } else if (e.target && e.target.id === "add-oils-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
    // document.getElementById("accesories").style.display = "block";
    document.getElementById("accesories").classList.add("el-block");
    document.getElementById("accesories").classList.remove("el-unvisible");
  } else if (e.target && e.target.id === "add-tires-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
    // document.getElementById("accesories").style.display = "block";
    document.getElementById("accesories").classList.add("el-block");
    document.getElementById("accesories").classList.remove("el-unvisible");
  }
});

// adding listener to keep changed order details in localStorage
// document.body.addEventListener("change", (e) => {
//   if (
//     e.target &&
//     ["cash", "leasing", "first-name", "last-name", "delivery"].includes(
//       e.target.id
//     )
//   ) {
//     console.log("new changed e value", e.target.value);
//     const carId = e.target.closest(".buy-form").dataset.carId;
//     saveData(e, carId);
//   }
// });

// adding event listeners for button return-list
const returnButton = document.getElementsByClassName(`return-list`)[0];
returnButton.addEventListener("click", (e) => {
  e.preventDefault();
  const ul = document.getElementById("chosen-accesories");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  const totalOrderPrice = document.getElementById("total-price");
  totalOrderPrice.textContent = 0;
  // document.getElementById("car-list").style.display = "flex";
  // document.getElementById("search-form").style.display = "flex";
  // document.getElementById("pagination-controls").style.display = "block";
  document.getElementById("car-list").classList.add("el-flex");
  document.getElementById("search-form").classList.add("el-flex");
  document.getElementById("pagination-controls").classList.add("el-block");
  document.getElementById("car-list").classList.remove("el-unvisible");
  document.getElementById("search-form").classList.remove("el-unvisible");
  document
    .getElementById("pagination-controls")
    .classList.remove("el-unvisible");
  // document.getElementById("accesories").style.display = "none";
  document.getElementById("accesories").classList.remove("el-block");
  document.getElementById("accesories").classList.add("el-unvisible");
  // document.getElementsByClassName("buy-form")[0].style.display = "none";
  document.getElementsByClassName("buy-form")[0].classList.add("el-unvisible");
  document.getElementsByClassName("buy-form")[0].classList.remove("el-flex");
  // document.querySelector("main").style.width = "1000px";
  // document.querySelector("main").style.justifyContent = "space-evenly";
  document
    .querySelector("main")
    .classList.replace("main-after-config", "main-after-return");
  document
    .querySelector(".buy-form")
    .querySelector(".car-image-inner")
    .remove();
});

// adding event listeners for button place order
const placeOrderButton = document.getElementsByClassName(`place-order-btn`)[0];
placeOrderButton.addEventListener("click", (e) => {
  e.preventDefault();
  const buyForm = document.getElementsByClassName("buy-form")[0];
  const existingErrors = document.querySelector(".validation-errors");
  if (existingErrors) {
    existingErrors.remove();
  }
  const radioFields = document
    .getElementById("order-details")
    .querySelectorAll('input[name="financing"]');
  const inputFields = document
    .getElementById("order-details")
    .querySelectorAll('input:not([name="financing"])');
  const validationErrors = {};
  inputFields.forEach((input) => {
    if (!Boolean(input.value)) {
      validationErrors[input.id] = true;
    }
  });
  const radioFieldsChecked = [...radioFields].map((input) => input.checked);

  if (!radioFieldsChecked.some(Boolean)) {
    validationErrors["radio_buttons"] = true;
  }
  if (Object.keys(validationErrors).length > 0) {
    const divErrors = document.createElement("div");
    divErrors.className = "validation-errors";
    Object.entries(validationErrors).forEach(([key, value]) => {
      const span = document.createElement("span");
      span.className = "error";
      if (key === "radio_buttons") {
        span.textContent = "Nie wybrano żadnej opcji finansowania";
      } else {
        span.textContent = `W polu ${key} nie wybrano wartości`;
      }
      divErrors.appendChild(span);
    });
    buyForm.appendChild(divErrors);
  } else {
    const carId = document
      .querySelector(".car-id")
      .querySelector(".item-att-val").textContent;

    const orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
    const chosenCar = orderConfigData.find((car) => car.id === carId);
    const radioCash = document.getElementById("cash");
    const radioLeasing = document.getElementById("leasing");
    const inputDelivery = document.getElementById("delivery");
    const inputFirstName = document.getElementById("first-name");
    const inputLastName = document.getElementById("last-name");
    const updatedOrderDetails = {
      [radioCash.id]: radioCash.checked,
      [radioLeasing.id]: radioLeasing.checked,
      [inputDelivery.id]: inputDelivery.value,
      [inputFirstName.id]: inputFirstName.value,
      [inputLastName.id]: inputLastName.value,
    };
    chosenCar["order_details"] = {
      ...chosenCar.order_details,
      ...updatedOrderDetails,
    };
    localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
    localStorage.setItem("orderedCar", JSON.stringify(chosenCar));
    // localStorage.removeItem("orderConfigData");
    window.location.href = "order-confirmation.html";
  }
});

// adding event listener to search form
const carList = document.getElementById("car-list");

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  const pageCount = 4;
  let currentPage = 1;
  const updateList = () => {
    if (searchText) {
      const filteredItems = [...carsAll].filter((item) => {
        const brand = item
          .querySelector(".brand .item-att-val")
          .textContent.toLowerCase();
        return brand.includes(searchText);
      });
      const carsNum = filteredItems.length;
      while (carList.firstChild) {
        carList.removeChild(carList.firstChild);
      }
      filteredItems.forEach((item, index) => {
        if (
          index >= (currentPage - 1) * pageCount &&
          index < currentPage * pageCount
        ) {
          carList.appendChild(item);
          item.classList.add("el-flex");
          item.classList.remove("el-unvisible");
        } else {
          item.classList.add("el-unvisible");
          item.classList.remove("el-flex");
        }
      });
      const totalPage = Math.ceil(carsNum / pageCount);
      console.log("currentPage", currentPage, "totalPage", totalPage);
      document.getElementById(
        "page-info"
      ).textContent = `Strona ${currentPage} z ${totalPage}`;

      if (currentPage === totalPage) {
        document.getElementById("next-btn").disabled = true;
      } else {
        document.getElementById("next-btn").disabled = false;
      }
    } else {
      console.log('there"s no searchtext');
      while (carList.firstChild) {
        carList.removeChild(carList.firstChild);
      }
      const start = (currentPage - 1) * pageCount;
      const end = start + pageCount;
      carsAll.forEach((item, index) => {
        if (index >= start && index < end) {
          // item.style.display = "flex";
          carList.appendChild(item);
          item.classList.add("el-flex");
          item.classList.remove("el-unvisible");
        } else {
          // item.style.display = "none";
          item.classList.add("el-unvisible");
          item.classList.remove("el-flex");
        }
      });
      const totalPage = Math.ceil(carsAll.length / pageCount);
      document.getElementById(
        "page-info"
      ).textContent = `Strona ${currentPage} z ${totalPage}`;

      if (currentPage === totalPage) {
        document.getElementById("next-btn").disabled = true;
      } else {
        document.getElementById("next-btn").disabled = false;
      }
    }
  };

  const nextPage = () => {
    let totalPage;
    if (searchText) {
      const carsNum = [...carsAll].filter((car) => {
        const brand = car
          .querySelector(".brand .item-att-val")
          .textContent.toLowerCase();
        return brand.includes(searchText);
      }).length;
      totalPage = Math.ceil(carsNum / pageCount);
    } else {
      totalPage = Math.ceil(cars.length / pageCount);
    }

    if (currentPage < totalPage) {
      currentPage++;
      updateList();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      updateList();
    }
  };

  document.getElementById("next-btn").addEventListener("click", nextPage);
  document.getElementById("prev-btn").addEventListener("click", prevPage);

  updateList();
});
