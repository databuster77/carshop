
const fetchAccesories = (apiUrl, selectElement) => {
    fetch(apiUrl)
    .then(response => {        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {        
        data.forEach(item => {
            let displayText;
            if (selectElement.id ==='batteries') {
                displayText = `${item.name}: Cena ${item.price} PLN`;                
        }
            else if (selectElement.id ==='oils') {
                displayText = `${item.name} Poj. ${item.capacity} L: Cena ${item.price} PLN`                
            }
            else if (selectElement.id ==='tires') {
                displayText = `${item.name} ${item.width}/${item.profile} R${item.radius}: Cena ${item.price} PLN`
            }
            const option = new Option(displayText, item.id);
            selectElement.add(option);            
        });   
    })
};

const fetchAccesoryPrice = (apiUrl, accesoryId) => {
    return fetch(apiUrl)
    .then(response => {        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {        
        let foundAccesory = data.filter(item => item.id===accesoryId)[0];
        if (foundAccesory) {
            console.log('foundAccesory', foundAccesory);            
            return foundAccesory.price;
        }
        throw new Error('Accessory not found');
        
    })
};

const recalculateOrderPrice = () =>{
    const ul = document.getElementById('chosen-accesories');
    const accesoriesTotalPrice = [...ul.children].map(li => parseInt(li.querySelector('.accesory-total-price-amount').textContent)).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      },0);
    let totalOrderPrice = document.getElementById('total-price');
    totalOrderPriceRecalculated = parseInt(totalOrderPrice.textContent) + accesoriesTotalPrice;
    totalOrderPrice.textContent = totalOrderPriceRecalculated;


}


const addSelectionToBasket = async (e) => {
        e.preventDefault();
        console.log('clicked add button',e.target.id);
        const ul = document.getElementById('chosen-accesories');        
        console.log('chosen accessories before adding', ul)
        const parentEl = document.getElementById(e.target.id).parentElement;
        const selectElement = parentEl.querySelector('select');
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const selectedItemText = selectedOption.text;
        const selectedItemValue = selectedOption.value;        
        
        let [accesoryName, ...suffixSelection] = selectedItemText.split(':');
        let apiUrl;
        if (selectedItemValue.startsWith('ak')) {
            apiUrl = 'assets/parts/batteries.json';
        }
        else if (selectedItemValue.startsWith('op')) {
            apiUrl = 'assets/parts/tires.json';
        }
        else if (selectedItemValue.startsWith('ol')) {
            apiUrl = 'assets/parts/oils.json';
        }
        
        let accesoryPrice = await fetchAccesoryPrice(apiUrl, selectedItemValue);
        const existingLi = [...ul.children].find(li => li.querySelector('.accesory-id').textContent === selectedItemValue);


    if (existingLi) {        
        console.log('Old Li updated');        
        console.log('accesoryPrice', accesoryPrice);
        console.log('existingLi',existingLi)
        const quantityInput = existingLi.querySelector('input[id="accesory-quantity"]');        
        quantityInput.value = parseInt(quantityInput.value) + 1;        
        const accesoryTotalPrice = existingLi.querySelector('.accesory-total-price-amount');        
        accesoryTotalPrice.textContent = accesoryPrice;        
        recalculateOrderPrice();
    } else {
        console.log('New Li added');        
        console.log('accesoryPrice', accesoryPrice);
        console.log('existingLi',existingLi)
        const li = document.createElement('li');
        li.className = 'chosen-accesory';
        li.innerHTML = `<span class="accesory-id">${selectedItemValue}</span>
                        <span class="accesory-type">Opona</span>
                        <span class="assesory-name">${accesoryName}</span>
                        <span class="accesory-price">${accesoryPrice}</span>
                        <button class="accesory-more">+</button>
                        <input type="text" name="accesory-quantity" id="accesory-quantity" value=1>
                        <button class="accesory-less">-</button>
                        <button class="accesory-delete">Usuń</button>
                        <span class="accesory-total-price">Cena łącznie: <span class="accesory-total-price-amount">${accesoryPrice}</span> PLN</span>`;
        ul.appendChild(li);
        recalculateOrderPrice();
    }
    
    const accesoryMore = document.querySelector('.accesory-more');
    accesoryMore.addEventListener('click', (e)=>{
        e.preventDefault();        
        const quantityInput = e.target.parentElement.querySelector('#accesory-quantity')
        quantityInput.value = parseInt(quantityInput.value) + 1;
        const accesoryTotalPrice = e.target.parentElement.querySelector('.accesory-total-price-amount');
        accesoryTotalPrice.textContent = parseInt(quantityInput.value) * accesoryPrice;
        recalculateOrderPrice();
        })

    const accesoryLess = document.querySelector('.accesory-less');
    accesoryLess.addEventListener('click', (e)=>{
        e.preventDefault();
        const quantityInput = e.target.parentElement.querySelector('#accesory-quantity')
        quantityInput.value = parseInt(quantityInput.value) - 1;
        const accesoryTotalPrice = e.target.parentElement.querySelector('.accesory-total-price-amount');
        accesoryTotalPrice.textContent = parseInt(quantityInput.value) * accesoryPrice;
        recalculateOrderPrice();
        })
    
    const accesoryDelete = document.querySelector('.accesory-delete');
    accesoryDelete.addEventListener('click', (e)=>{
        e.preventDefault();
        const li = e.target.closest('li').remove();
        recalculateOrderPrice();        
        })

};


fetch('assets/cars/cars.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {        
        const ul = document.getElementById('car-list');
        data.forEach((item, index) => {
            const li = document.createElement('li');
            let liContent = `<div class="description" id="desc-index-${index}">
                            <div class="brand">
                            <span class="item-att">Marka:</span><span class="item-att-val">${item.car_brand}</span>
                            </div>
                            <div class="car-name">
                            <span class="item-att">Nazwa:</span><span class="item-att-val">${item.car_name}</span>
                            </div>
                            <div class="year">
                            <span class="item-att">Moc silnika:</span><span class="item-att-val">${item.engine_power}</span>
                            </div>
                            <div class="power">
                            <span class="item-att">Rok produkcji:</span><span class="item-att-val">${item.manufacture_year}</span>
                            </div>
                            <div class="milage">
                            <span class="item-att">Przebieg:</span><span class="item-att-val">${item.mileage}</span>
                            </div>
                            <div class="price">
                            <span class="item-att">Cena:</span><span class="item-att-val">${item.price}</span>
                            </div>
                            <button class="order-config" data-index="${index}">Konfiguracja zamówienia</button>                            
                            </div>`;
            li.innerHTML = liContent;
            ul.appendChild(li);

        });
        document.querySelectorAll('.order-config').forEach(button => {
            button.addEventListener('click', (e) => {                
                const index = e.target.getAttribute('data-index');
                const description = document.getElementById(`desc-index-${index}`);
                let brand = description.querySelector('.brand').querySelector('.item-att-val').textContent;
                let carName = description.querySelector('.car-name').querySelector('.item-att-val').textContent;
                let year = description.querySelector('.year').querySelector('.item-att-val').textContent;
                let power = description.querySelector('.power').querySelector('.item-att-val').textContent;
                let milage = description.querySelector('.milage').querySelector('.item-att-val').textContent;
                let price = description.querySelector('.price').querySelector('.item-att-val').textContent;
                let formData = {brand,
                                carName,
                                year,
                                power,
                                milage,
                                price};
                localStorage.setItem('formData', JSON.stringify(formData));               
                
                const buyForm = document.getElementsByClassName('buy-form')[0];                
                buyForm.querySelector('.brand').querySelector('.item-att-val').textContent = brand;
                buyForm.querySelector('.car-name').querySelector('.item-att-val').textContent = carName;
                buyForm.querySelector('.year').querySelector('.item-att-val').textContent = year;
                buyForm.querySelector('.power').querySelector('.item-att-val').textContent = power;
                buyForm.querySelector('.milage').querySelector('.item-att-val').textContent = milage;
                buyForm.querySelector('.price').querySelector('.item-att-val').textContent = price;                
                document.getElementById('total-price').textContent = price;
                document.getElementById('car-list').hidden =true;
                buyForm.hidden =  false;                
                
                
                const batteriesSelect = document.getElementById('batteries');                
                fetchAccesories('assets/parts/batteries.json', batteriesSelect);
                const batteriesAdd = document.getElementById("add-batteries-btn");
                batteriesAdd.addEventListener('click', (e)=>addSelectionToBasket(e));

                const oilsSelect = document.getElementById('oils');
                fetchAccesories('assets/parts/oils.json', oilsSelect);
                const oilsAdd = document.getElementById("add-oils-btn");
                oilsAdd.addEventListener('click', (e)=>addSelectionToBasket(e));

                const tiresSelect = document.getElementById('tires');
                fetchAccesories('assets/parts/tires.json', tiresSelect);
                const tiresAdd = document.getElementById("add-tires-btn");
                tiresAdd.addEventListener('click', (e)=>addSelectionToBasket(e));

                const returnButton = document.getElementsByClassName(`return-list`)[0];
                returnButton.addEventListener('click', (e) => {
                    e.preventDefault()
                    const ul = document.getElementById('chosen-accesories');                    
                    ul.innerHTML = '';
                    document.getElementById('car-list').hidden =false;
                    buyForm.hidden =  true;
                    
                })

                const placeOrderButton = document.getElementsByClassName(`place-order-btn`)[0];                        
                placeOrderButton.addEventListener('click', (e) => {
                    e.preventDefault()                    
                    let shoppingBasket = localStorage.getItem('shoppingBasket')                    
                    if (shoppingBasket) {shoppingBasket.push({})}
                    else {localStorage.setItem('shoppingBasket', [{}])}                            
                })

                
            });
        });
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
