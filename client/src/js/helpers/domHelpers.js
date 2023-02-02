export function createElement(tagName, content, attributes, eventHandlers, parent) {
  const parentElem = 
    typeof parent === 'string' ?
      document.querySelector(parent) :
      parent;
  const element = document.createElement(tagName);
  element.textContent = content;

  if (attributes && Object.keys(attributes).length > 0) {
    for (let key in attributes) {
      if (key === 'className') {
        element.setAttribute('class', attributes[key]);
      } else {
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  if (eventHandlers && Object.keys(eventHandlers).length > 0) {
    for (let eventNameKey in eventHandlers) {
      element.addEventListener(eventNameKey, eventHandlers[eventNameKey]);
    }
  }

  parentElem.appendChild(element);
  return element;
}

/**
 * attributes
 * { id: '', className: '', 'data-index': '' }
 * 
 * eventHandlers
 * { click: function, mouseover: function }
 */


export function createProductCard(product, buyClickHandler) {
  const parentElem = createElement('div', '', {className: 'product_card card mb-4 rounded-3 shadow-sm card-body col'}, null, '#content');
  createElement('h3', product.name, null, null, parentElem);
  createElement('p', `UAH ${product.price}`, null, null, parentElem);
  createElement(
    'input',
    '',
    {
      type: 'button',
      value: 'Buy',
      'data-product-id': product.id,
      className: 'w-100 btn btn-lg btn-outline-primary'
    },
    {click: buyClickHandler},
    parentElem
  );

  /*
  <div class="product_card">
        <h3>Product name</h3>
        <p>UAH 150</p>
        <input type="button" data-product-id= value="Buy" />
      </div>
  */
}

export function createCheckoutForm(product, changeSizeHandler, changeToppingHandler, sendOrder, showOrder) {
  document.querySelector('#modal_details').innerHTML = '';
  document.querySelector('#modal_price').innerHTML = '';
  updateProductPrice(product.price);
  

  createElement('p', product.name, {className: 'orderName textBg'}, null, '#modal_details');

  const sizeP = createElement('p', '', null, null, '#modal_details');
  createElement('h4', 'Size:', {className: 'textBg'}, null, sizeP);
  // Radio "small"
  createElement(
    'input',
    '',
    { type: 'radio', name: 'size', value: 'small', checked: 'checked' },
    { change: changeSizeHandler },
    sizeP
  );
  createElement('span', 'Small', {className: 'mg'}, null, sizeP);
  
  // Radio "big"
  createElement(
    'input',
    '',
    { type: 'radio', name: 'size', value: 'big' },
    { change: changeSizeHandler },
    sizeP
  );
  createElement('span', 'Big', null, null, sizeP);

  const toppingsP = createElement('p', '', null, null, '#modal_details');
  createElement('h4', 'Toppings:', {className: 'textBg'}, null, toppingsP);

  for(let topping of product.available_toppings) {
    const p = createElement('p', '', null, null, toppingsP);
    createElement('input', '', { type: 'radio', name: 'toppings', value: topping.name, className:'toppings'}, {change: changeToppingHandler}, p);
    createElement('span', `${topping.name} UAH ${topping.price}`, null, null, p)
  }

  const buttonsP = createElement('p', '', {className: 'btnOrders'}, null, '#modal_details');
  createElement('input', '', {type: 'text', name: 'client_name', placeholder: 'Enter your name', className: 'client_name inputCust'}, null, buttonsP);
  createElement('input', '', {type: 'button', value: 'Order', className: 'btn btn-lg btn-primary '}, {click: sendOrder}, buttonsP);
  createElement('input', '', {type: 'button', value: 'Show Order', className: 'btn btn-lg btn-primary '}, {click: showOrder}, buttonsP);
}

export function updateProductPrice(newPrice) {
  document.querySelector('#modal_price').innerHTML = '';
  createElement('span', `UAH ${newPrice}`, {className: 'priceOrder textBg'}, null, '#modal_price');
}