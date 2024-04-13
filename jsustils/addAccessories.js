import { fetchAccesoryPrice } from "./fetchAccessories.js";
import { changeItemQuantity, deletItem } from "./modifyChosenItems.js";
import { recalculateOrderPrice } from "./recalculatePrice.js";


export const addSelectionToBasket = async (e, carId) => {
    e.preventDefault();    
    const ul = document.getElementById("chosen-accesories");
    console.log("CLICKED BUTTON DODAJ");
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
  
    let {accesoryPrice, accesoryType} = await fetchAccesoryPrice(apiUrl, selectedItemValue);
    console.log('accesoryPrice, accesoryType for adding to basket', accesoryPrice, accesoryType);
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
                          <span class="accesory-type">${accesoryType}</span>
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
    document.getElementById("accesories").style.display="block";
  };
  