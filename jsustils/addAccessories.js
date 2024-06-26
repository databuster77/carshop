import { fetchAccesoryPrice } from "./fetchAccessories.js";
import { changeItemQuantity, deletItem } from "./modifyChosenItems.js";
import { recalculateOrderPrice } from "./recalculatePrice.js";


export const addSelectionToBasket = async (e, carId) => {
    e.preventDefault();    
    const ul = document.getElementById("chosen-accesories");        
    const parentEl = document.getElementById(e.target.id).parentElement;
    const selectElement = parentEl.querySelector("select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedItemText = selectedOption.text;
    const selectedItemValue = selectedOption.value;
  
    const [accesoryName, ...suffixSelection] = selectedItemText.split(":");
    let apiUrl;
    if (selectedItemValue.startsWith("ak")) {
      apiUrl = "assets/parts/batteries.json";
    } else if (selectedItemValue.startsWith("op")) {
      apiUrl = "assets/parts/tires.json";
    } else if (selectedItemValue.startsWith("ol")) {
      apiUrl = "assets/parts/oils.json";
    }
  
    const {accesoryPrice, accesoryType} = await fetchAccesoryPrice(apiUrl, selectedItemValue);    
    const existingLi = [...ul.children].find(
      (li) => li.querySelector(".accesory-id").textContent === selectedItemValue
    );
  
    if (existingLi) {      
      const quantityInput = existingLi.querySelector("#accesory-quantity");      
      let totalAccesoryQuantityRecalculated =
        parseInt(quantityInput.textContent) + 1;      
      quantityInput.textContent = totalAccesoryQuantityRecalculated;      
      const accesoryTotalPrice = existingLi.querySelector(
        ".accesory-total-price-amount"
      );
      accesoryTotalPrice.textContent =
        accesoryPrice * totalAccesoryQuantityRecalculated;
      recalculateOrderPrice(carId);
    } else {      
      let totalAccesoryQuantityRecalculated = 0;
      const li = document.createElement("li");
      li.className = "chosen-accesory";
      li.innerHTML = `<span class="accesory-id" display=none>${selectedItemValue}</span>
                          <span class="accesory-type">${accesoryType}</span>
                          <span class="assesory-name">${accesoryName}</span>
                          <span class="accesory-price">Cena szt.: ${accesoryPrice} PLN</span>
                          <button class="accesory-more">+</button>
                          <span id="accesory-quantity">${totalAccesoryQuantityRecalculated}</span>
                          <button class="accesory-less">-</button>
                          <button class="accesory-delete">Usuń</button>
                          <span class="accesory-total-price">Cena łącznie: <span class="accesory-total-price-amount"></span> PLN</span>`;
      // li.querySelector('.accesory-id').style.display="none";
      // li.querySelector('.accesory-price').style.display = "none";                              
      li.querySelector('.accesory-id').classList.add('el-unvisible');
      li.querySelector('.accesory-price').classList.add('el-unvisible');
      ul.appendChild(li);
      const lastAddedLi = ul.lastElementChild;
      const buttonMore = lastAddedLi.querySelector(".accesory-more");
      const buttonLess = lastAddedLi.querySelector(".accesory-less");
      const buttonDelete = lastAddedLi.querySelector(".accesory-delete");
      changeItemQuantity("add", buttonMore, accesoryPrice, carId);
      changeItemQuantity("subtract", buttonLess, accesoryPrice, carId);
      deletItem(buttonDelete, carId);      
      const quantityInput = lastAddedLi.querySelector("#accesory-quantity");      
      totalAccesoryQuantityRecalculated = 1;      
      quantityInput.textContent = totalAccesoryQuantityRecalculated;      
      const accesoryTotalPrice = lastAddedLi.querySelector(
        ".accesory-total-price-amount"
      );
      accesoryTotalPrice.textContent =
        accesoryPrice * totalAccesoryQuantityRecalculated;
      recalculateOrderPrice(carId);
    }
    
  };
  