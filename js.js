function getRandomInt (min, max) {
    return Math.floor ( Math.random () * ( max - min ) ) + min;
}
class Product  {
    constructor () {
        this.items = [];
    }

    createGoodsList ( count = getRandomInt ( 1, 20 ) ) {
        let item = {
            "amount": 0,
            "countGoods": 0,
            "content": []
        };

        for ( let i = 1; i <= count; i++ ) {
            let prodObj = {
                "id": i,
                "title": "Prod " + i,
                "price": getRandomInt ( 1, 999 )
            };
            item.amount += prodObj.price;
            item.countGoods++;
            item.content.push ( prodObj );
        }
        this.items = item;
    }
    renderGoodsItem ( item ) {
        return `<div class="goods-item"><div class="img"></div><h3>Title: ${item.title}</h3>`
            + `<p>Price: ${item.price}</p><p><input type="button" class="addToCart" value="Купить" id="${item.id}"></p></div>`;
    }
    renderGoodsList ()  {
        let goodsList = this.items.content.map ( item => this.renderGoodsItem ( item ) ).join ( '' );
        document.getElementById("catalog").innerHTML = goodsList;
    }
}
class Cart extends Product {
    constructor () {
        super ();
        this.cartItems = [];
    }

    insertItem (item) {
        console.log (this.cartItems);
        this.cartItems.push(item);
    }
    getAmount () {
        let amount = 0;
        for (let prop of this.cartItems) {
            amount += prop.price;
        }
        return amount;
    }
    getCount () {
        return this.cartItems.length;
    }
    createCart () {
        let elem = document.getElementById("cart");
        if (this.getCount() === 0) {
            elem.innerHTML = 'Корзина пуста ';
        } else {
            elem.innerHTML = 'В корзине : ' + this.getCount() + ' товаров, на: ' + this.getAmount() + ' рублей.';
        }
    }
}

document.onclick = function (event) {
/*    let cartContent = document.getElementById("cartContent");
    function f1 ( item ) {
        return `Title: ${item.title}, Price: ${item.price};<br>`;
    }
    function f2 ()  {
        let goodsList = cart.items.map ( item => f1 ( item ) ).join ( '' );
        cartContent.innerHTML = goodsList;
    }
*/
    if (event.target.className === 'addToCart') {
        let item = cart.items.content[event.target.id-1];
        cart.insertItem(item);
        cart.createCart();
    }
};
const cart = new Cart ();
cart.createCart();
cart.createGoodsList(8);
cart.renderGoodsList ();

document.querySelector ('#total').innerHTML = 'Всего товаров в каталоге на сумму: ' + cart.items.amount;

