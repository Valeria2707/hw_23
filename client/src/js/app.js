import '../scss/styles.scss';


import { createCheckoutForm, createElement, createProductCard, updateProductPrice } from './helpers/domHelpers.js';
import {API_CATEGORIES_LIST, API_PRODUCTS_BY_CATEGORY_ID, API_ORDERS_LIST} from './urls.js';

let productsArr = [];
let currentProduct = {};

const sendOrder = () =>{
  const orderCustumer = document.querySelector('.client_name').value;
  const orderToping = document.querySelector('input[name="toppings"]:checked').value;
  const orderName = document.querySelector('.orderName').innerText;
  const orderPrice = document.querySelector('.priceOrder').innerText;
  const orderSize = document.querySelector('input[name="size"]:checked').value;

    if(orderCustumer.length <= 0){
      alert("Заповніть всі дані");
    }
    else{
      const obj = {
        order:
         {
          name: orderName,
          price: orderPrice,
          size: orderSize,
          topping: orderToping,
          customer: orderCustumer
        }
      }
    
      fetch(API_ORDERS_LIST, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then(response => console.log(response));
    }
}

const showOrder = ()=>{
  fetch(API_ORDERS_LIST)
  .then(res => res.json())
  .then(response => console.log(response));
}

class Hamburger{
  constructor(size, stuffing){
    this.size = size;
    this.stuffing = stuffing;
  }

  static changeSizeHandlers() {
    const orderSize = document.querySelector('input[name="size"]:checked').value;
    return orderSize;
  }

  static stuffingTp(){
    const orderToping = document.querySelector('input[name="toppings"]:checked').value;
    return orderToping;
  }

  calculatePrice(){
    const topping = currentProduct.available_toppings.find(topping => topping.name === this.stuffing);

    if (this.size === 'big' && topping) {
      currentProduct.updatedPrice = currentProduct.price * 1.2 + topping.price;
    } else if(this.size === 'small' && topping) {
      currentProduct.updatedPrice = currentProduct.price + topping.price;
    }
    
    return currentProduct.updatedPrice;
  }
}

const changePrice = function() {
  var hamburger = new Hamburger(Hamburger.changeSizeHandlers(), Hamburger.stuffingTp());
  updateProductPrice(hamburger.calculatePrice());
}

const clickBuyHandler = function(event) {
  const productId = event.target.getAttribute('data-product-id'); // ok
  currentProduct = productsArr.find(product => product.id === productId);
  currentProduct.updatedPrice = currentProduct.price;
  createCheckoutForm(currentProduct, sendOrder, showOrder, changePrice);
}

const menuItemClickHandler = function(event) {
  const currentId = event.target.getAttribute('data-menu-item');
  
  fetch(API_PRODUCTS_BY_CATEGORY_ID.replace(':category', currentId))
    .then(res => res.json())
    .then(products => {
      productsArr = products;

      document.querySelector('#content').innerHTML = '';
      for(let product of products) {
        createProductCard(product, clickBuyHandler);
      }

    })
}

// onload:
fetch(API_CATEGORIES_LIST)
  .then(res => res.json())
  .then(categories => {

    for(let category of categories) {
      createElement(
        'li',
        category.name, 
        {
          'data-menu-item': category.id,
          className: "li-header"
        },
        {
          click: menuItemClickHandler
        },
        '#menu ul'
      );
    }
  })