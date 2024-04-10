// definiton of used function 

const fetchAccesories = (apiUrl, selectElement) => {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((item) => {
        let displayText;
        if (selectElement.id === "batteries") {
          displayText = `${item.name}: Cena ${item.price} PLN`;
        } else if (selectElement.id === "oils") {
          displayText = `${item.name} Poj. ${item.capacity} L: Cena ${item.price} PLN`;
        } else if (selectElement.id === "tires") {
          displayText = `${item.name} ${item.width}/${item.profile} R${item.radius}: Cena ${item.price} PLN`;
        }
        const option = new Option(displayText, item.id);
        selectElement.add(option);
      });
    });
};

const fetchAccesoryPrice = (apiUrl, accesoryId) => {
  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let foundAccesory = data.filter((item) => item.id === accesoryId)[0];
      if (foundAccesory) {
        console.log("foundAccesory", foundAccesory);
        return foundAccesory.price;
      }
      throw new Error("Accessory not found");
    });
};

const fetchCarPrice = (carId) => {
  return fetch("assets/cars/cars.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let foundCar = data.filter((item) => item.id === carId)[0];
      if (foundCar) {
        console.log("foundCarPrice", foundCar.price);
        return foundCar.price;
      }
      throw new Error("Accessory not found");
    });
};

const recalculateOrderPrice = async (carId) => {
  const ul = document.getElementById("chosen-accesories");
  const accesoriesTotalPrice = [...ul.children]
    .map((li) =>
      parseInt(li.querySelector(".accesory-total-price-amount").textContent)
    )
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  let carPrice = await fetchCarPrice(carId);
  let totalOrderPrice = document.getElementById("total-price");
  // totalOrderPriceRecalculated = parseInt(totalOrderPrice.textContent) + accesoriesTotalPrice;
  let totalOrderPriceRecalculated = carPrice + accesoriesTotalPrice;
  totalOrderPrice.textContent = totalOrderPriceRecalculated;
  console.log("Recalculated Price", totalOrderPriceRecalculated);
  let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
  if (orderConfigData) {
    let chosenCar = orderConfigData.find((car) => car.id === carId);
    if (chosenCar) {
      let accesoriesData = [...ul.children].map((li) => {
        console.log("li", li);
        let accesoryId = li.querySelector(".accesory-id").textContent;
        let accesoryType = li.querySelector(".accesory-type").textContent;
        let assesoryName = li.querySelector(".assesory-name").textContent;
        let accesoryQuantity =
          li.querySelector("#accesory-quantity").textContent;
        let accesoryData = {
          accesoryId,
          accesoryType,
          assesoryName,
          accesoryQuantity,
        };
        return accesoryData;
      });

      console.log("accesoriesData", accesoriesData);
      chosenCar["chosen_accesories"] = accesoriesData;
      localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
      console.log("added items to localStorage");
    }
  }
};

const changeItemQuantity = (ops, button, accesoryPrice, carId) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const quantityInput =
      e.target.parentElement.querySelector("#accesory-quantity");
    const accesoryTotalPrice = e.target.parentElement.querySelector(
      ".accesory-total-price-amount"
    );
    let totalAccesoryQuantityRecalculated;
    if (ops === "add") {
      console.log("clicked MORE");
      totalAccesoryQuantityRecalculated =
        parseInt(quantityInput.textContent) + 1;
    } else if (ops === "subtract") {
      console.log("clicked LESS");
      totalAccesoryQuantityRecalculated =
        parseInt(quantityInput.textContent) - 1;
    }
    quantityInput.textContent = totalAccesoryQuantityRecalculated;
    accesoryTotalPrice.textContent =
      accesoryPrice * totalAccesoryQuantityRecalculated;
    recalculateOrderPrice(carId);
  });
};

const deletItem = (button, carId) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("clicked DELETE");
    const li = e.target.closest("li").remove();
    recalculateOrderPrice(carId);
  });
};

const addSelectionToBasket = async (e, carId) => {
  e.preventDefault();
  console.log("clicked add button", e.target.id);
  const ul = document.getElementById("chosen-accesories");
  console.log("chosen accessories before adding", ul);
  const parentEl = document.getElementById(e.target.id).parentElement;
  const selectElement = parentEl.querySelector("select");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedItemText = selectedOption.text;
  const selectedItemValue = selectedOption.value;

  let [accesoryName, ...suffixSelection] = selectedItemText.split(":");
  let apiUrl;
  if (selectedItemValue.startsWith("ak")) {
    apiUrl = "assets/parts/batteries.json";
  } else if (selectedItemValue.startsWith("op")) {
    apiUrl = "assets/parts/tires.json";
  } else if (selectedItemValue.startsWith("ol")) {
    apiUrl = "assets/parts/oils.json";
  }

  let accesoryPrice = await fetchAccesoryPrice(apiUrl, selectedItemValue);
  const existingLi = [...ul.children].find(
    (li) => li.querySelector(".accesory-id").textContent === selectedItemValue
  );

  if (existingLi) {
    console.log("Old Li updated");
    console.log("accesoryPrice", accesoryPrice);
    const quantityInput = existingLi.querySelector("#accesory-quantity");
    console.log("quantityInput bef upd", quantityInput.textContent);
    let totalAccesoryQuantityRecalculated =
      parseInt(quantityInput.textContent) + 1;
    console.log(
      "totalAccesoryQuantityRecalculated",
      totalAccesoryQuantityRecalculated
    );
    quantityInput.textContent = totalAccesoryQuantityRecalculated;
    console.log("quantityInput aft upd", quantityInput.textContent);
    const accesoryTotalPrice = existingLi.querySelector(
      ".accesory-total-price-amount"
    );
    accesoryTotalPrice.textContent =
      accesoryPrice * totalAccesoryQuantityRecalculated;
    recalculateOrderPrice(carId);
  } else {
    console.log("New Li added");
    console.log("accesoryPrice", accesoryPrice);
    console.log("existingLi", existingLi);
    let totalAccesoryQuantityRecalculated = 0;
    const li = document.createElement("li");
    li.className = "chosen-accesory";
    li.innerHTML = `<span class="accesory-id">${selectedItemValue}</span>
                        <span class="accesory-type">Opona</span>
                        <span class="assesory-name">${accesoryName}</span>
                        <span class="accesory-price">Cena szt.: ${accesoryPrice} PLN</span>
                        <button class="accesory-more">+</button>
                        <span id="accesory-quantity">${totalAccesoryQuantityRecalculated}</span>
                        <button class="accesory-less">-</button>
                        <button class="accesory-delete">Usuń</button>
                        <span class="accesory-total-price">Cena łącznie: <span class="accesory-total-price-amount"></span> PLN</span>`;
    ul.appendChild(li);
    let lastAddedLi = ul.lastElementChild;
    let buttonMore = lastAddedLi.querySelector(".accesory-more");
    let buttonLess = lastAddedLi.querySelector(".accesory-less");
    let buttonDelete = lastAddedLi.querySelector(".accesory-delete");
    changeItemQuantity("add", buttonMore, accesoryPrice, carId);
    changeItemQuantity("subtract", buttonLess, accesoryPrice, carId);
    deletItem(buttonDelete, carId);
    console.log("lastAddedLi", lastAddedLi);
    const quantityInput = lastAddedLi.querySelector("#accesory-quantity");
    console.log(
      "quantityInput bef upd",
      quantityInput.textContent,
      parseInt(quantityInput.textContent)
    );
    totalAccesoryQuantityRecalculated = 1;
    console.log(
      "totalAccesoryQuantityRecalculated",
      totalAccesoryQuantityRecalculated
    );
    quantityInput.textContent = totalAccesoryQuantityRecalculated;
    console.log("quantityInput aft upd", quantityInput.textContent);
    const accesoryTotalPrice = lastAddedLi.querySelector(
      ".accesory-total-price-amount"
    );
    accesoryTotalPrice.textContent =
      accesoryPrice * totalAccesoryQuantityRecalculated;
    recalculateOrderPrice(carId);
  }
};


const saveData = (e, carId) => {
    let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
    if (orderConfigData) {
      let chosenCar = orderConfigData.find((car) => car.id === carId);
      let updatedOrderDetails;
      if (chosenCar) {
        let changedField = e.target.id;     
        let newFieldValue;
        let valuesChanged={};            
        if (changedField!=='cash' && changedField!=='leasing'){
          newFieldValue = e.target.value;
          valuesChanged = {[changedField]:newFieldValue}        
      }
        else if (changedField==='cash') {
          newFieldValue = e.target.checked;
          valuesChanged = {[changedField]:newFieldValue, "leasing": false};        
        }
        else if (changedField==='leasing') {
          newFieldValue = e.target.checked;
          valuesChanged = {[changedField]:newFieldValue, "cash": false};        
        }
        updatedOrderDetails = {...chosenCar.order_details, ...valuesChanged };
        console.log("updatedOrderDetails for chosen car", updatedOrderDetails);
        chosenCar["order_details"] = updatedOrderDetails;      
        localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
        console.log("added order details to localStorage");
      }
    }
  };

// 
// 
// 
// document.getElementsByClassName("buy-form")[0].hidden = true;
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
      let liContent = `<div class="car-image">
                            <img class="car-main-picture" src="${item.main_picture}" alt="car"/>
                            </div>
                            <div class="description" id="${item.id}">
                            <div class="brand">
                            <span class="item-att">Marka:</span><span class="item-att-val">${item.car_brand}</span>
                            </div>
                            <div class="car-name">
                            <span class="item-att">Nazwa:</span><span class="item-att-val">${item.car_name}</span>
                            </div>
                            <div class="year">
                            <span class="item-att">Moc silnika:</span><span class="item-att-val">${item.engine_power}</span>
                            </div>
                            <div class="power">
                            <span class="item-att">Rok produkcji:</span><span class="item-att-val">${item.manufacture_year}</span>
                            </div>
                            <div class="milage">
                            <span class="item-att">Przebieg:</span><span class="item-att-val">${item.mileage}</span>
                            </div>
                            <div class="price">
                            <span class="item-att">Cena:</span><span class="item-att-val">${item.price}</span>
                            </div>                            
                            </div>
                            <button class="order-config" data-index="${index}">Konfiguracja zamówienia</button>                            `;
      li.innerHTML = liContent;
      ul.appendChild(li);
    });
  })
  .catch((error) => {
    console.error("There was a problem with your fetch operation:", error);
  });

document.getElementById("car-list").addEventListener("click", (e) => {
  if (e.target.className === "order-config") {
    e.preventDefault();
    // e.target.addEventListener('click', (e) => {
    const index = e.target.getAttribute("data-index");
    const description = document.getElementById(`ca_${index}`);
    let carId = `ca_${index}`;
    let brand;
    let carName;
    let year;
    let power;
    let milage;
    let price;
    brand = description
      .querySelector(".brand")
      .querySelector(".item-att-val").textContent;
    carName = description
      .querySelector(".car-name")
      .querySelector(".item-att-val").textContent;
    year = description
      .querySelector(".year")
      .querySelector(".item-att-val").textContent;
    power = description
      .querySelector(".power")
      .querySelector(".item-att-val").textContent;
    milage = description
      .querySelector(".milage")
      .querySelector(".item-att-val").textContent;
    price = description
      .querySelector(".price")
      .querySelector(".item-att-val").textContent;

    const buyForm = document.getElementsByClassName("buy-form")[0];
    buyForm
      .querySelector(".car-id")
      .querySelector(".item-att-val").textContent = carId;
    buyForm.querySelector(".brand").querySelector(".item-att-val").textContent =
      brand;
    buyForm
      .querySelector(".car-name")
      .querySelector(".item-att-val").textContent = carName;
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
      car_brand: carName,
      manufacture_year: year,
      engine_power: power,
      mileage: milage,
      price: price,
    };
    let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));

    if (orderConfigData) {
      let chosenCar = orderConfigData.find((car) => car.id === carId);
      if (chosenCar) {
        const ul = document.getElementById("chosen-accesories");
        console.log("ul before putting data from storage", ul);
        if (chosenCar.chosen_accesories) {
          console.log("chosenCar.chosen_accesories",chosenCar.chosen_accesories);
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
              (accesoryPrice) => {
                const quantityInput = li.querySelector("#accesory-quantity");
                const accesoryTotalPrice = li.querySelector(
                  ".accesory-total-price-amount"
                );
                const accesoryPriceIn = li.querySelector(".accesory-price");
                accesoryTotalPrice.textContent =
                  accesoryPrice * parseInt(quantityInput.textContent);
                accesoryPriceIn.textContent = accesoryPrice;
                changeItemQuantity("add", buttonMore, accesoryPrice, chosenCar.id);
                changeItemQuantity("subtract",  buttonLess, accesoryPrice, chosenCar.id);
                deletItem(buttonDelete, chosenCar.id);
              }
            );
          });
        };
        
        const orderDetails = document.getElementById("order-details");
        console.log("orderDetails before putting data from storage", orderDetails);
        if (chosenCar.order_details) {
          console.log("chosenCar.order_details",chosenCar.order_details);
          const radioCash = orderDetails.querySelector('#cash');
          const radioLeasing = orderDetails.querySelector('#leasing');
          const inputFirstName = orderDetails.querySelector('#first-name');
          const inputLastName = orderDetails.querySelector('#last-name');
          const inputDelivery = orderDetails.querySelector('#delivery');
          radioCash.checked = chosenCar.order_details.cash;
          radioLeasing.checked = chosenCar.order_details.leasing;
          inputFirstName.value = chosenCar.order_details["first-name"]||'';
          inputLastName.value = chosenCar.order_details["last-name"]||'';
          inputDelivery.value = chosenCar.order_details.delivery;
        };
        
      } else {
        orderConfigData.push(formData);
        localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
      }
    } else {
      localStorage.setItem("orderConfigData", JSON.stringify([]));
      orderConfigData = [];
      orderConfigData.push(formData);
      localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
    }

    document.getElementById("car-list").hidden = true;
    buyForm.hidden = false;

    const batteriesSelect = document.getElementById("batteries");
    fetchAccesories("assets/parts/batteries.json", batteriesSelect);
    const oilsSelect = document.getElementById("oils");
    fetchAccesories("assets/parts/oils.json", oilsSelect);
    const tiresSelect = document.getElementById("tires");
    fetchAccesories("assets/parts/tires.json", tiresSelect);
    // });
  }
});

document.body.addEventListener("click", (e) => {
  if (e.target && e.target.id === "add-batteries-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
  } else if (e.target && e.target.id === "add-oils-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
  } else if (e.target && e.target.id === "add-tires-btn") {
    const carId = e.target.closest(".buy-form").dataset.carId;
    addSelectionToBasket(e, carId);
  }
});

document.body.addEventListener("change", (e) => {
  if (e.target && ["cash", "leasing", "first-name", "last-name", "delivery"].includes(e.target.id)) {
//   if (e.target && e.target.id === "first-name") {
    console.log("new changed e value", e.target.value);
    const carId = e.target.closest(".buy-form").dataset.carId;
    saveData(e, carId);
  }
});

const returnButton = document.getElementsByClassName(`return-list`)[0];
returnButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked RETURN");
  const ul = document.getElementById("chosen-accesories");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  const totalOrderPrice = document.getElementById("total-price");
  totalOrderPrice.textContent = 0;
  console.log(
    "chosen accessories before adding",
    document.getElementById("chosen-accesories")
  );
  document.getElementById("car-list").hidden = false;
  document.getElementsByClassName("buy-form")[0].hidden = true;
});

const placeOrderButton = document.getElementsByClassName(`place-order-btn`)[0];
placeOrderButton.addEventListener("click", (e) => {
  e.preventDefault();  
  const radioFields = document.getElementById("order-details").querySelectorAll('input[name="financing"]');        
  const inputFields = document.getElementById("order-details").querySelectorAll('input:not([name="financing"])');
  const validationErrors ={};
  inputFields.forEach(input=>{
    if (!Boolean(input.value)){
        validationErrors[input.id] = true;
    } 
  })
  let radioFieldsChecked = [...radioFields].map(input=>input.checked);
  if (!radioFieldsChecked.every(Boolean)){
    validationErrors["radio_buttons"] = true
  }
    console.log('validationErrors',validationErrors);

    if (validationErrors) {
        const buyForm = document.getElementsByClassName("buy-form")[0];
        
        let divErrors = document.createElement('div');
            divErrors.className = 'validation-errors';
        
            Object.entries(validationErrors).forEach(([key, value]) => {
            console.log(`${key} from validationErrors: ${value}`);
            let span = document.createElement('span');
                span.className = 'error';
            if (key==='radio_buttons'){                
                span.textContent = 'Nie wybrano żadnej opcji finansowania';
            }
            else {span.textContent = `W polu ${key} nie wybrano wartości`}
            divErrors.appendChild(span);           
            
          });
        
            buyForm.appendChild(divErrors);
        
          
        
    }
  let carId = document.querySelector('.car-id').querySelector('.item-att-val').textContent;  
//   const orderConfigData = JSON.parse(localStorage.getItem(orderConfigData));
//   let chosenCar = orderConfigData.find((car) => car.id === carId);
//   localStorage.setItem('orderedCar', chosenCar);
//   localStorage.removeItem('orderConfigData');
//   window.location.href = 'order-confirmation.html';

});

document.addEventListener('DOMContentLoaded', function() {
  console.log('TEST PAGINATION')
  const itemsPerPage = 5;
  let currentPage = 1;
  const listItems = document.querySelectorAll('#car-list li');
  const totalPages = Math.ceil(listItems.length / itemsPerPage);

  function showPage(page) {
    console.log('TEST PAGINATION')
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    listItems.forEach((item, index) => {
      if (index >= start && index < end) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });    
    document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
    
    // document.getElementById('prev-btn').style.visibility = currentPage === 1 ? 'hidden' : 'visible';
    // document.getElementById('next-btn').style.visibility = currentPage === totalPages ? 'hidden' : 'visible';
  }

  document.getElementById('prev-btn').addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
    }
  });

  document.getElementById('next-btn').addEventListener('click', function() {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage);
    }
  });

  // Initialize
  showPage(currentPage);
});
