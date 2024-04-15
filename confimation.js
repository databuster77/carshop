const carImage = localStorage.getItem("chosenCarImage");
if (carImage) {        
        const imgElement = document.createElement("img");
        imgElement.src = carImage;        
        imgElement.style.objectFit = "cover";
        // imgElement.style.borderBottomLeftRadius = "15px";
        // imgElement.style.borderBottomRightRadius = "15px";
        // imgElement.style.margin = "0 auto";
        // imgElement.style.marginBottom = "15px";
        document.querySelector('.car-image').appendChild(imgElement);
    }
const orderData = JSON.parse(localStorage.getItem('orderedCar'));
document.getElementById('total-price').textContent = `${orderData.total_price}`;
document.getElementById('acknowledge1').textContent = `${orderData.order_details["first-name"]} dziękujemy za zamówienie`.toUpperCase();
document.getElementById('acknowledge2').textContent = `Twoj samochód zostanie dostarczony ${orderData.order_details.delivery}`.toUpperCase();
const carDetails = document.querySelector('.car-details');
carDetails.querySelector('.car-id').querySelector('.item-att-val').textContent = `${orderData.id}`;
carDetails.querySelector('.brand').querySelector('.item-att-val').textContent = `${orderData.car_brand}`;
carDetails.querySelector('.car-name').querySelector('.item-att-val').textContent = `${orderData.car_name}`;
carDetails.querySelector('.year').querySelector('.item-att-val').textContent = `${orderData.manufacture_year}`;
carDetails.querySelector('.power').querySelector('.item-att-val').textContent = `${orderData.engine_power}`;
carDetails.querySelector('.milage').querySelector('.item-att-val').textContent = `${orderData.mileage}`;
carDetails.querySelector('.price').querySelector('.item-att-val').textContent = `${orderData.price}`;
if (orderData.chosen_accesories) { 
    const ul = document.getElementById("chosen-accesories");   
    orderData.chosen_accesories.forEach((accesory) => {
      let li = document.createElement("li");
      li.className = "chosen-accesory";
      li.innerHTML = `
                      <span class="accesory-type">${accesory.accesoryType}</span>
                      <span class="assesory-name">${accesory.assesoryName}</span>                                            
                      <span id="accesory-quantity">${accesory.accesoryQuantity} szt.</span>
                      <span class="accesory-total-price">Cena łącznie: <span class="accesory-total-price-amount"></span>${accesory.accesoryTotalPrice} PLN</span>`;
      ul.appendChild(li);
    })
}

const returnButton = document.getElementsByClassName(`return-list`)[0];
  returnButton.addEventListener("click", (e) => {
    e.preventDefault();    
    const ul = document.getElementById("chosen-accesories");
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    window.location.href = 'index.html';   
})

