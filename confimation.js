
    // let orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));

    // if (orderConfigData) {
    //   let chosenCar = orderConfigData.find((car) => car.id === carId);
    //   if (chosenCar) {
    //     const ul = document.getElementById("chosen-accesories");
    //     console.log("ul before putting data from storage", ul);
    //     if (chosenCar.chosen_accesories) {
    //       console.log("chosenCar.chosen_accesories",chosenCar.chosen_accesories);
    //       chosenCar.chosen_accesories.forEach((accesory) => {
    //         let li = document.createElement("li");
    //         li.className = "chosen-accesory";
    //         li.innerHTML = `<span class="accesory-id">${accesory.accesoryId}</span>
    //                         <span class="accesory-type">${accesory.accesoryType}</span>
    //                         <span class="assesory-name">${accesory.assesoryName}</span>
    //                         <span class="accesory-price">Cena szt.: PLN</span>
    //                         <button class="accesory-more">+</button>
    //                         <span id="accesory-quantity">${accesory.accesoryQuantity}</span>
    //                         <button class="accesory-less">-</button>
    //                         <button class="accesory-delete">Usuń</button>
    //                         <span class="accesory-total-price">Cena łącznie: <span class="accesory-total-price-amount"></span> PLN</span>`;
    //         ul.appendChild(li);
    //         const buttonMore = li.querySelector(".accesory-more");
    //         const buttonLess = li.querySelector(".accesory-less");
    //         const buttonDelete = li.querySelector(".accesory-delete");
    //         let apiUrl;
    //         if (accesory.accesoryId.startsWith("ak")) {
    //           apiUrl = "assets/parts/batteries.json";
    //         } else if (accesory.accesoryId.startsWith("op")) {
    //           apiUrl = "assets/parts/tires.json";
    //         } else if (accesory.accesoryId.startsWith("ol")) {
    //           apiUrl = "assets/parts/oils.json";
    //         }

