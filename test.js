document.querySelectorAll('.description').forEach((div, divIndex) => {
    if (divIndex.toString() !== index) {
        div.parentElement.style.display = 'none';
    } else {
        const formHtml = `
                        <form id="buy-form-${index}" class="buy-form">
                        <fieldset disabled>
                            <div class="brand">
                                <span class="item-att">Marka:</span><span class="item-att-val">Skoda</span>
                            </div>
                            <div class="car-name">
                                <span class="item-att">Nazwa:</span><span class="item-att-val">Skoda Kamiq</span>
                            </div>
                            <div class="year">
                                <span class="item-att">Moc silnika:</span><span class="item-att-val">150</span>
                            </div>
                            <div class="power">
                                <span class="item-att">Rok produkcji:</span><span class="item-att-val">2021</span>
                            </div>
                            <div class="milage">
                                <span class="item-att">Przebieg:</span><span class="item-att-val">95000</span>
                            </div>
                            <div class="price">
                                <span class="item-att">Cena:</span><span class="item-att-val">175000</span>
                            </div>
                        </fieldset>
                        <input type="radio" name="leasing" id="leasing">
                        <input type="radio" name="cash" id="cash">
                        <input type="text" name="first-name" id="first-name">
                        <input type="text" name="last-name" id="last-name">
                        <input type="date" name="delivery" id="delivery">
                        <select name="tires" id="tires"></select>
                        <button class="add-order-btn" id="add-tires-btn-${index}">Dodaj</button>
                        <select name="oils" id="oils"></select>
                        <button class="add-order-btn" id="add-oils-btn-${index}">Dodaj</button>
                        <select name="batteries" id="batteries"></select>  
                        <button class="add-order-btn" id="add-batteries-btn-${index}">Dodaj</button>
                        <p>WARTOŚĆ ZAMÓWIENIA ŁĄCZNIE:</p><span id="total-price"></span>
                        <button class="add-basket-btn" id="add-basket-btn-${index}">Zamów</button>
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