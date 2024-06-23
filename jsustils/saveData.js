export const saveData = (e, carId) => {
  const orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
  if (orderConfigData) {
    const chosenCar = orderConfigData.find((car) => car.id === carId);
    let updatedOrderDetails;
    if (chosenCar) {
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
    }
  }
};
