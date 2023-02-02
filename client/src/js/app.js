import '../scss/styles.scss';


import { createCheckoutForm, createElement, createProductCard, updateProductPrice } from './helpers/domHelpers.js';
import {API_CATEGORIES_LIST, API_PRODUCTS_BY_CATEGORY_ID, API_ORDERS_LIST} from './urls.js';

let productsArr = [];
let currentProduct = {};

const sendOrder = () =>{
  const orderName = document.querySelector('.orderName').innerText;
  const orderPrice = document.querySelector('.priceOrder').innerText;
  const orderSize = document.querySelector('input[name="size"]:checked').value;
  const orderToping = document.querySelector('input[name="toppings"]:checked').value;
  const orderCustumer = document.querySelector('.client_name').value;

  if(orderCustumer.length > 0){
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
  else{
    alert("Заповніть всі дані");
  }
}

const showOrder = ()=>{
  fetch(API_ORDERS_LIST)
  .then(res => res.json())
  .then(response => console.log(response));
}


const changeSizeHandler = function(event) {
  const size = event.target.value; 
  const btnT = document.querySelectorAll('.toppings');
  if (size === 'big') {
    currentProduct.updatedPrice = currentProduct.price * 1.2;
  } else {
    currentProduct.updatedPrice = currentProduct.price;
  }
  for(let i =0; i < btnT.length; i++){
    btnT[i].checked = false;
  }
  updateProductPrice(currentProduct.updatedPrice);
}

const changeToppingHandler = function(event) {
  const toppingName = event.target.value;
  const topping = currentProduct.available_toppings.find(topping => topping.name === toppingName);
  let priceWithTopping = currentProduct.updatedPrice;
  if(topping){
    priceWithTopping +=  topping.price;
  }
  updateProductPrice(priceWithTopping);
}

const clickBuyHandler = function(event) {
  const productId = event.target.getAttribute('data-product-id'); // ok
  currentProduct = productsArr.find(product => product.id === productId);
  currentProduct.updatedPrice = currentProduct.price;
  createCheckoutForm(currentProduct, changeSizeHandler, changeToppingHandler, sendOrder, showOrder);
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
          'data-menu-item': category.id
        },
        {
          click: menuItemClickHandler
        },
        '#menu ul'
      );
    }
  })