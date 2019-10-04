class Base {
    constructor() {
        this.size = 'small';
        this.topping = 'cheese';
        this.stuffing = [];
        this.db = {};
    }
    setDb (db) {
        db.then(items => {
            this.db = items.db;
        });
    }
    setSize (size) {
        this.size = size;
    }
    setTopping (topping) {
        this.topping = topping;
    }

    getSize() {
        return this.size;
    }
    getSizePrice () {
        return this.db.size[this.getSize()].price;
    }
    getSizeCalories () {
        return this.db.size[this.getSize()].calories;
    }

    getTopping () {
        return this.topping;
    }
    getToppingPrice () {
        return this.db.topping[this.getTopping()].price;
    }
    getToppingCalories () {
        return this.db.topping[this.getTopping()].calories;
    }

    setStuffing (stuffing) {
        let index = this.stuffing.indexOf(stuffing);
        if (index === -1) {
            this.stuffing.push(stuffing);
        }
    }
    delStuffing (stuffing) {
        let index = this.stuffing.indexOf(stuffing);
        if (index !== -1) {
            this.stuffing.splice (index, 1);
        }
    }
    getStuffing () {
        if (this.stuffing.length !== 0) {
            return this.stuffing;
        } else {
            return [];
        }
    }
    getStuffingPrice () {
        let amount = 0;
        for (let prop of this.stuffing) {
            if (prop !== null) {
                amount += this.db.stuffing[prop].price;
            }
        }
        return amount;
    }
    getStuffingCalories () {
        let calories = 0;
        for (let prop of this.stuffing) {
            if (prop !== null) {
                calories += this.db.stuffing[prop].calories;
            }
        }
        return calories;
    }

    getAllPrice () {
        return this.getSizePrice () + this.getToppingPrice () + this.getStuffingPrice ();
    }
    getAllCalories () {
        return this.getSizeCalories() + this.getStuffingCalories() + this.getToppingCalories();
    }
}
class Hamburger extends Base {
    constructor () {
        super ();
        this.sizeId = 'size';
        this.toppingId = 'topping';
        this.stuffingId = 'stuffing';
        this.totalId = 'total';
        this.callorieId = 'calorie';
    }
    renderSize () {
        document.getElementById ('result-' + this.sizeId).innerHTML =
            'Размер гамбургера: ' + this.db.size[super.getSize()].title;
    }
    renderTopping () {
        document.getElementById ('result-' + this.toppingId).innerHTML =
            'Начинка: ' + this.db.topping[this.topping].title;
    }
    renderStuffing () {
        let msg = '';
        if (super.getStuffing() === false) {
            msg = 'Без специй и майонеза'
        } else {
            let stuffing = [];
            for (let prop of super.getStuffing()) {
                if (prop !== null) {
                    stuffing.push(this.db.stuffing[prop].title);
                }
            }
            msg = 'Дополнительно: ' + stuffing.join(', ');
        }
        document.getElementById ('result-' + this.stuffingId).innerHTML =
            msg;
    }
    renderCalorie () {
        document.getElementById ('result-' + this.callorieId).innerHTML =
            'Калорийность: ' + super.getAllCalories();
    }
    renderTotal () {
        document.getElementById ('result-' + this.totalId).innerHTML =
            'Цена: ' + super.getAllPrice();
    }

    render () {
        this.renderSize();
        this.renderTopping();
        this.renderStuffing();
        this.renderCalorie();
        this.renderTotal();
    }
}

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status !== 200) {
                    reject();
                }
                const data = JSON.parse(xhr.responseText);

                resolve(data);
            }
        }
        xhr.send();
    });
}

let hamburger = new Hamburger();
hamburger.setDb(sendRequest("http://localhost:3000/db"));

document.querySelector ('#size').addEventListener("change", () => {
    let elem = document.getElementById ('size');
    let size = elem.options[elem.selectedIndex].value;
    hamburger.setSize (size);
    hamburger.render ();
});
document.querySelector ('#topping').addEventListener("change", () => {
    let elem = document.getElementById ('topping');
    let topping = elem.options[elem.selectedIndex].value;
    hamburger.setTopping (topping);
    hamburger.render ();
});
document.querySelectorAll ('.stuffing').forEach(element => {
    element.addEventListener('click', () => {
        let spice = document.querySelector('.stuffing[value="spice"]');
        let mayonnaise = document.querySelector('.stuffing[value="mayonnaise"]');

        if (spice.checked === true) {
            hamburger.setStuffing(spice.value);
        } else {
            hamburger.delStuffing(spice.value);
        }
        if (mayonnaise.checked === true) {
            hamburger.setStuffing(mayonnaise.value);
        } else {
            hamburger.delStuffing(mayonnaise.value);
        }
        hamburger.render ();
    })
})