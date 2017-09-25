(function (window) {
    function myLibrary() {

        let catalog = createRandomCatalog(100);

        return {
            searchProductById: searchProductById,
            searchProductByPrice: searchProductByPrice,
            searchProductByType: searchProductByType,
            searchAllProducts: searchAllProducts
        };

        function createRandomProduct() {
            let typeArray = ['Electronic', 'Book', 'Clothing', 'Food'];
            let price = (Math.random() * 500).toFixed(2);
            let type = typeArray[Math.floor(Math.random() * 4)];

            return {price: price, type: type};
        }

        function createRandomCatalog(num) {
            let catalog = [];
            for (let i = 0; i < num; i++) {
                let obj = createRandomProduct();
                catalog.push({id: i, price: obj.price, type: obj.type});
            }
            return catalog;
        }

        function searchAllProducts() {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(catalog);
                }, 1000);
            });
            return promise;
        }

        function searchProductById(id) {
            let promise = new Promise((resolve, reject) => {
                let i = 0;
                setTimeout(() => {
                    while (i < catalog.length) {
                        if (catalog[i].id == id) {
                            resolve({id: id, price: catalog[i].price, type: catalog[i].type});
                        }
                        i++;
                    }
                    reject('Invalid ID: ' + id);
                }, 1000);
            });
            return promise;
        }

        function searchProductByType(type) {
            let promise = new Promise((resolve, reject) => {
                let i = 0;
                let typeArray = [];
                let possibleTypes = ['Electronic', 'Book', 'Clothing', 'Food'];
                if (!possibleTypes.includes(type)) {
                    reject('Invalid Type: ' + type);
                } else {
                    setTimeout(() => {
                        while (i < catalog.length) {
                            if (catalog[i].type == type) {
                                typeArray.push({id: catalog[i].id, price: catalog[i].price, type: catalog[i].type});
                            }
                            i++;
                        }
                        resolve(typeArray);
                    }, 1000);
                }
            });
            return promise;
        }

        function searchProductByPrice(price, difference) {
            let promise = new Promise((resolve, reject) => {
                let i = 0;
                let priceArray = [];
                if (!isFinite(price)) {
                    reject('Invalid Price: ' + price);
                } else {
                    setTimeout(() => {
                        while (i < catalog.length) {
                            if (Math.abs(catalog[i].price - price) < difference) {
                                priceArray.push({id: catalog[i].id, price: catalog[i].price, type: catalog[i].type});
                            }
                            i++;
                        }
                        resolve(priceArray);
                    }, 1000);
                }
            });
            return promise;
        }
    }

    if (typeof(window.api) === 'undefined') {
        window.api = myLibrary();
    }
})(window);

// library.js end

// productCatalog.js begin

function createTableHeader(tableId) {
    let tableHeaderRow = document.createElement('TR');
    let th1 = document.createElement('TH');
    let th2 = document.createElement('TH');
    let th3 = document.createElement('TH');
    let th4 = document.createElement('TH');
    th1.appendChild(document.createTextNode('ProductId'));
    th2.appendChild(document.createTextNode('Type'));
    th3.appendChild(document.createTextNode('Price'));
    th4.appendChild(document.createTextNode('Examine'));
    tableHeaderRow.appendChild(th1);
    tableHeaderRow.appendChild(th2);
    tableHeaderRow.appendChild(th3);
    tableHeaderRow.appendChild(th4);
    document.getElementById(tableId).appendChild(tableHeaderRow);
}

function updateTable(tableId, productArray) {
    let tableBody = document.getElementById(tableId);

    //reset table
    while (tableBody.hasChildNodes()) {
        tableBody.removeChild(tableBody.firstChild);
    }

    //create table header
    createTableHeader(tableId);

    //populate table rows
    for (let i = 0; i < productArray.length; i++) {
        let tr = document.createElement('TR');
        let td1 = document.createElement('TD');
        let td2 = document.createElement('TD');
        let td3 = document.createElement('TD');
        let td4 = document.createElement('button');

        td4.addEventListener('click', function () {
            processSearch(this.parentNode.firstChild.innerHTML);
        });


        td1.appendChild(document.createTextNode(productArray[i].id));
        td2.appendChild(document.createTextNode(productArray[i].type));
        td3.appendChild(document.createTextNode(productArray[i].price));
        td4.appendChild(document.createTextNode('Examine'));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tableBody.appendChild(tr);
    }
}

function updateExaminedText(product) {
    let outputString = 'Product Id: ' + product.id;
    outputString += '<br> Price: ' + product.price;
    outputString += '<br> Type: ' + product.type;
    document.getElementById('productText').innerHTML = outputString;
}

function getIntersection(arrA, arrB, searchedId) {
    let samePrice = arrA;
    let sameType = arrB;
    let similarArray = [];
    samePrice.forEach((obj1) => {
        sameType.forEach((obj2) => {
            if (obj1.id == obj2.id && obj1.id != searchedId) {
                similarArray.push(obj1);
            }
        });
    });

    return similarArray;
}

function processSearch(searchId) {
    api.searchProductById(searchId).then((val) => {
        return Promise.all([api.searchProductByPrice(val.price, 50), api.searchProductByType(val.type), val]);
    }).then((val) => {
        let similarArray = getIntersection(val[0], val[1], val[2].id);
        updateExaminedText(val[2]);
        updateTable('similarTable', similarArray);
    }).catch((val) => {
        alert(val);
    });
}

function processSearchType(type) {
    api.searchProductByType(type).then((val) => {
        updateTable('similarTable', val);
    }).catch((val) => {
        alert(val);
    });
}

function processSearchPrice(price) {
    api.searchProductByPrice(price, 50).then((val) => {
        updateTable('similarTable', val);
    }).catch((val) => {
        alert(val);
    });
}



api.searchAllProducts().then((value) => {
    updateTable('allTable', value)
});

document.getElementById('inputButton').addEventListener('click', () => {
    processSearch(document.getElementById('input').value);
});

document.getElementById('inputTypeButton').addEventListener('click', () => {
    processSearchType(document.getElementById('inputType').value);
});


document.getElementById('inputPriceButton').addEventListener('click', () => {
    processSearchPrice(document.getElementById('inputPrice').value);
});
