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
    let carPrice = await fetchCarPrice(carId);
    let totalOrderPrice = document.getElementById("total-price");
    // totalOrderPriceRecalculated = parseInt(totalOrderPrice.textContent) + accesoriesTotalPrice;
    let totalOrderPriceRecalculated = carPrice + accesoriesTotalPrice;
    totalOrderPrice.textContent = totalOrderPriceRecalculated;
    // console.log("Recalculated Price", totalOrderPriceRecalculated);
    let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
    if (orderConfigData) {
      let chosenCar = orderConfigData.find((car) => car.id === carId);
      if (chosenCar) {
        let accesoriesData = [...ul.children].map((li) => {
          // console.log("li", li);
          let accesoryId = li.querySelector(".accesory-id").textContent;
          let accesoryType = li.querySelector(".accesory-type").textContent;
          let assesoryName = li.querySelector(".assesory-name").textContent;
          let accesoryQuantity = li.querySelector("#accesory-quantity").textContent;          
          let accesoryTotalPrice = li.querySelector(".accesory-total-price-amount").textContent;          
          
          let accesoryData = {
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