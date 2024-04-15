
export const fetchAccesories = (apiUrl, selectElement) => {
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
  
  export const fetchAccesoryPrice = (apiUrl, accesoryId) => {
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
          // console.log("foundAccesory", foundAccesory);
          let returnedAccessoryData = {"accesoryPrice": foundAccesory.price,
                                      "accesoryType": foundAccesory.type};
          // console.log("returnedAccessoryData", returnedAccessoryData);                                      
          return (returnedAccessoryData);
        }
        throw new Error("Accessory not found");
      });
  };