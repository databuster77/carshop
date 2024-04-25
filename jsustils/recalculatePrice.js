import { fetchCarPrice } from "./fetchCarPrice.js";

export const recalculateOrderPrice = async (carId) => {
    const ul = document.getElementById("chosen-accesories");
    const accesoriesTotalPrice = [...ul.children]
      .map((li) =>
        parseInt(li.querySelector(".accesory-total-price-amount").textContent)
      )
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    const carPrice = await fetchCarPrice(carId);
    const totalOrderPrice = document.getElementById("total-price");
    // totalOrderPriceRecalculated = parseInt(totalOrderPrice.textContent) + accesoriesTotalPrice;
    const totalOrderPriceRecalculated = carPrice + accesoriesTotalPrice;
    totalOrderPrice.textContent = totalOrderPriceRecalculated;
    // console.log("Recalculated Price", totalOrderPriceRecalculated);
    const orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
    if (orderConfigData) {
      const chosenCar = orderConfigData.find((car) => car.id === carId);
      if (chosenCar) {
        const accesoriesData = [...ul.children].map((li) => {
          // console.log("li", li);
          const accesoryId = li.querySelector(".accesory-id").textContent;
          const accesoryType = li.querySelector(".accesory-type").textContent;
          const assesoryName = li.querySelector(".assesory-name").textContent;
          const accesoryQuantity = li.querySelector("#accesory-quantity").textContent;          
          const accesoryTotalPrice = li.querySelector(".accesory-total-price-amount").textContent;          
          
          const accesoryData = {
            accesoryId,
            accesoryType,
            assesoryName,
            accesoryQuantity,
            accesoryTotalPrice
            
          };
          return accesoryData;
        });
          
        chosenCar["chosen_accesories"] = accesoriesData;
        chosenCar["total_price"] = totalOrderPriceRecalculated;
        localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));  
      }
    }
  };