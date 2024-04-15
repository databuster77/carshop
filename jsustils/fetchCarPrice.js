export const fetchCarPrice = (carId) => {
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
          // console.log("foundCarPrice", foundCar.price);
          return foundCar.price;
        }
        throw new Error("Accessory not found");
      });
  };