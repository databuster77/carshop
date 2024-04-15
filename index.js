import { addSelectionToBasket } from "./jsustils/addAccessories.js";
import { changeItemQuantity, deletItem } from "./jsustils/modifyChosenItems.js";
import { saveData } from "./jsustils/saveData.js";
import {
  fetchAccesories,
  fetchAccesoryPrice,
} from "./jsustils/fetchAccessories.js";

document.getElementsByClassName("buy-form")[0].style.display = "none";
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

fetch("assets/cars/cars.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
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
                            </div>
                            <button class="order-config" data-index="${index}">Konfiguracja zamówienia</button>                            `;
      li.innerHTML = liContent;
      ul.appendChild(li);
    });
  })
  .then(() => {
    const ul = document.getElementById("car-list");
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
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
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
  })
  .catch((error) => {
    console.error("There was a problem with your fetch operation:", error);
  });

// adding event listener to order-config button

document.getElementById("car-list").addEventListener("click", (e) => {
  if (e.target.className === "order-config") {
    e.preventDefault();

    const index = e.target.getAttribute("data-index");
    const description = document.getElementById(`ca_${index}`);

    let carId = `ca_${index}`;
    let brand = description
      .querySelector(".brand")
      .querySelector(".item-att-val").textContent;
    let carImage = description
      .querySelector(".car-main-picture")
      .cloneNode(true);
    carImage.className = "car-image-inner";
    let carName = description
      .querySelector(".car-name")
      .querySelector(".item-att-val").textContent;
    let year = description
      .querySelector(".year")
      .querySelector(".item-att-val").textContent;
    let power = description
      .querySelector(".power")
      .querySelector(".item-att-val").textContent;
    let milage = description
      .querySelector(".milage")
      .querySelector(".item-att-val").textContent;
    let price = description
      .querySelector(".price")
      .querySelector(".item-att-val").textContent;

    const buyForm = document.querySelector(".buy-form");

    buyForm
      .querySelector(".car-id")
      .querySelector(".item-att-val").textContent = carId;
    buyForm.querySelector(".brand").querySelector(".item-att-val").textContent =
      brand;
    buyForm
      .querySelector(".car-name")
      .querySelector(".item-att-val").textContent = carName;
    buyForm.querySelector(".car-image").appendChild(carImage);
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

    let formData = {
      id: carId,
      car_brand: brand,
      car_name: carName,
      manufacture_year: year,
      engine_power: power,
      mileage: milage,
      price: price,
      total_price: price,
    };
    let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));

    if (orderConfigData) {
      let chosenCar = orderConfigData.find((car) => car.id === carId);
      if (chosenCar) {
        const ul = document.getElementById("chosen-accesories");        
        if (chosenCar.chosen_accesories) {          
          chosenCar.chosen_accesories.forEach((accesory) => {
            let li = document.createElement("li");
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
            li.querySelector(".accesory-price").style.display = "none";
            li.querySelector(".accesory-id").style.display = "none";
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
            document.getElementById("accesories").style.display = "block";
          }
        }

        const orderDetails = document.getElementById("order-details");        
        if (chosenCar.order_details) {
          // console.log("chosenCar.order_details", chosenCar.order_details);
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
      orderConfigData = [];
      orderConfigData.push(formData);
      localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
    }

    document.getElementById("car-list").style.display = "none";
    document.getElementById("search-form").style.display = "none";
    buyForm.style.display = "flex";
    document.querySelector("main").style.width = "800px";
    document.querySelector("main").style.justifyContent = "center";
    document.getElementById("pagination-controls").style.display = "none";

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
    document.getElementById("accesories").style.display = "block";
  } else if (e.target && e.target.id === "add-oils-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
    document.getElementById("accesories").style.display = "block";
  } else if (e.target && e.target.id === "add-tires-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
    document.getElementById("accesories").style.display = "block";
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
  document.getElementById("car-list").style.display = "flex";
  document.getElementsByClassName("buy-form")[0].style.display = "none";
  document.getElementById("search-form").style.display = "flex";
  document.querySelector("main").style.width = "1000px";
  document.querySelector("main").style.justifyContent = "space-evenly";
  document
    .querySelector(".buy-form")
    .querySelector(".car-image-inner")
    .remove();
  document.getElementById("pagination-controls").style.display = "block";
  document.getElementById("accesories").style.display = "none";
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
  let radioFieldsChecked = [...radioFields].map((input) => input.checked);

  if (!radioFieldsChecked.some(Boolean)) {
    validationErrors["radio_buttons"] = true;
  }
  if (Object.keys(validationErrors).length > 0) {
    let divErrors = document.createElement("div");
    divErrors.className = "validation-errors";
    Object.entries(validationErrors).forEach(([key, value]) => {
      let span = document.createElement("span");
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
    let carId = document
      .querySelector(".car-id")
      .querySelector(".item-att-val").textContent;
    let carImage = document.querySelector(".car-image-inner");
    const canvas = document.createElement("canvas");
    const style = getComputedStyle(carImage);
    const width = parseInt(style.width, 10);
    const height = parseInt(style.height, 10);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(carImage, 0, 0, width, height);
    const dataURL = canvas.toDataURL();
    localStorage.setItem("chosenCarImage", dataURL);
    let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
    let chosenCar = orderConfigData.find((car) => car.id === carId);
    const radioCash = document.getElementById('cash');
    const radioLeasing = document.getElementById('leasing');
    const inputDelivery = document.getElementById('delivery');
    const inputFirstName = document.getElementById('first-name');
    const inputLastName = document.getElementById('last-name');
    let updatedOrderDetails = {[radioCash.id]:radioCash.checked,
                              [radioLeasing.id]:radioLeasing.checked,
                              [inputDelivery.id]:inputDelivery.value,
                              [inputFirstName.id]:inputFirstName.value,
                              [inputLastName.id]:inputLastName.value,};
    chosenCar["order_details"] = {...chosenCar.order_details, ...updatedOrderDetails };      
    localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
    localStorage.setItem("orderedCar", JSON.stringify(chosenCar));
    localStorage.removeItem("orderConfigData");
    window.location.href = "order-confirmation.html";
  }
});

// adding event listener to search form
const searchInput = document.getElementById("search");
const carList = document.getElementById("car-list");
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  const cars = carList.querySelectorAll("li");
  
  let carsNum = [...cars].filter((car)=>{
    const brand = car
        .querySelector(".brand .item-att-val")
        .textContent.toLowerCase();
      return brand.includes(searchText);
    }).length

  cars.forEach((car) => {
    const brand = car
      .querySelector(".brand .item-att-val")
      .textContent.toLowerCase();
    if (brand.includes(searchText)) {
      car.style.display = "flex";
    } else {
      car.style.display = "none";
    }
  });

  const pageCount = 4;
  let currentPage = 1;

  const updateList = () => {
    const totalPage = Math.ceil(carsNum / pageCount);
    document.getElementById(
      "page-info"
    ).textContent = `Strona ${currentPage} z ${totalPage}`;  
  };

  const nextPage = () => {
    const totalPage = Math.ceil(carsNum / pageCount);
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


