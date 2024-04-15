import { recalculateOrderPrice } from "./recalculatePrice.js";

export const changeItemQuantity = (ops, button, accesoryPrice, carId) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const quantityInput =
        e.target.parentElement.querySelector("#accesory-quantity");
      const accesoryTotalPrice = e.target.parentElement.querySelector(
        ".accesory-total-price-amount"
      );
      let totalAccesoryQuantityRecalculated;
      if (ops === "add") {        
        totalAccesoryQuantityRecalculated =
          parseInt(quantityInput.textContent) + 1;
      } else if (ops === "subtract") {        
        if (parseInt(quantityInput.textContent)>1){
          totalAccesoryQuantityRecalculated =
          parseInt(quantityInput.textContent) - 1;
        } else{
          totalAccesoryQuantityRecalculated = 1
        }
        
      }
      quantityInput.textContent = totalAccesoryQuantityRecalculated;
      accesoryTotalPrice.textContent =
        accesoryPrice * totalAccesoryQuantityRecalculated;
      recalculateOrderPrice(carId);
    });
  };
  
  export const deletItem = (button, carId) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();      
      const li = e.target.closest("li").remove();
      recalculateOrderPrice(carId);
    });
  };