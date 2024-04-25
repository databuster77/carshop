export const saveData = (e, carId) => {
    const orderConfigData = JSON.parse(localStorage.getItem("orderConfigData"));
    if (orderConfigData) {
      const chosenCar = orderConfigData.find((car) => car.id === carId);
      let updatedOrderDetails;
      if (chosenCar) {
        const changedField = e.target.id;     
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
        // console.log("updatedOrderDetails for chosen car", updatedOrderDetails);
        chosenCar["order_details"] = updatedOrderDetails;      
        localStorage.setItem("orderConfigData", JSON.stringify(orderConfigData));
        // console.log("added order details to localStorage", orderConfigData);
      }
    }
  };