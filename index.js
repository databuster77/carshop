console.log('test');

const ul = document.getElementById('car-list');

console.log(ul);

fetch('assets/cars/cars.json')
    .then(response => {
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parses the JSON in the response
    })
    .then(data => {
        console.log(data);
        data.forEach((item, index) => {
            const li = document.createElement('li')

            let liContent = `<div class="description">
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
                            </div>`
            li.innerHTML = liContent

            ul.appendChild(li);

        });
        document.querySelectorAll('.order-config').forEach(button => {
            button.addEventListener('click', function (e) {
                console.log('data-index',e.target.getAttribute('data-index'))
                const index = this.getAttribute('data-index');
                document.querySelectorAll('.description').forEach((div, divIndex) => {
                    if (divIndex.toString() !== index) {
                        div.parentElement.style.display = 'none';
                    } else {
                        const formHtml = `
                                        <form id="buy-form-${index}" class="buy-form">

                                        <input type="radio" name="leasing" id="leasing">
                                        <input type="radio" name="cash" id="cash">
                                        <input type="text" name="first-name" id="first-name">
                                        <input type="text" name="last-name" id="last-name">
                                        <input type="date" name="delivery" id="delivery">
                                        <select name="tires" id="tires"></select>
                                        <select name="oils" id="oils"></select>
                                        <select name="batteries" id="batteries"></select>  
                                        <button class="add-basket-btn" id="add-basket-btn-${index}">Add to Basket</button>
                                        <button class="return-list" id="return-list-${index}">Wróć do listy</button>
                                        </form>
                                        `;
                        if (!document.querySelector(`#buy-form-${index}`)) {
                            div.insertAdjacentHTML('afterend', formHtml);
                        };

                        const returnButton = document.getElementById(`return-list-${index}`);
                        returnButton.addEventListener('click', (e) => {
                            e.preventDefault()
                            document.querySelectorAll('.description').forEach(div => { div.parentElement.style.display = 'list-item'; })
                        })

                        const addToBasketButton = document.getElementById(`add-basket-btn-${index}`);                        
                        addToBasketButton.addEventListener('click', (e) => {
                            e.preventDefault()
                            console.log('klik')
                            let shoppingBasket = localStorage.getItem('shoppingBasket')
                            console.log(shoppingBasket)
                            if (shoppingBasket) {shoppingBasket.push({})}
                            else {localStorage.setItem('shoppingBasket', [{}])}                            
                        })

                        const batteriesSelect = document.getElementById('batteries');
                    }
                });
            });
        });
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
