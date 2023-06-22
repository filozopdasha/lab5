//getting pizza from json
document.addEventListener('DOMContentLoaded', function () {
  fetch('assets/js/data.json')
    .then(response => response.json())
    .then(data => {
      const pizzas = data.pizzas;

      for (var i = 0; i < pizzas.length; i++) {
        var newLine = createPizzaCard(pizzas[i]);

        if (newLine.classList.contains('popular')) {
             newLine.setAttribute('data-tooltip', 'Популярна');
          } else if (newLine.classList.contains('new')) {
             newLine.setAttribute('data-tooltip', 'Нова');
          }

        if(pizzas[i].small_size){
           var buySmallButton = newLine.querySelector('.buyS');
           buySmallButton.removeEventListener('click', buySmallPizza);
           buySmallButton.addEventListener('click', buySmallPizza);
          }

        if(pizzas[i].big_size){
           var buyBigButton = newLine.querySelector('.buyB');
           buyBigButton.removeEventListener('click', buyBigPizza);
           buyBigButton.addEventListener('click', buyBigPizza);
          }

        var firstPart = document.querySelector('.row');
        firstPart.appendChild(newLine);
      }
  });
});

//pizza-card adding
function createPizzaCard(pizza) {
  var newLine = document.createElement('div');
  newLine.classList = pizza.classes;
  var ingredients = Object.values(pizza.content).flat().join(', ');

  var innerHTML = `
    <div class="thumbnail pizza-card">
      <img src="${pizza.icon}" class="images">
      <div class="caption">
        <h3>${pizza.title}</h3>
        <h5 class="description">${pizza.type}</h5>
        <p class="ingredients">${ingredients}</p>
        ${createIconsSection(pizza)}
      </div>
    </div>
  `;
  newLine.innerHTML = innerHTML;
  return newLine;
}

//bottom-part of card
function createIconsSection(pizza) {
  if (pizza.small_size && pizza.big_size) {
    return `
      <div class="icons">
        <p><img src="assets/images/size-icon.svg" alt="Size Icon"> 30</p>
        <p><img src="assets/images/size-icon.svg" alt="Size Icon"> 40</p>
        <p class="smallWeight"><img src="assets/images/weight.svg" alt="Size Icon"> ${pizza.small_size.weight}</p>
        <p class="bigWeight"><img src="assets/images/weight.svg" alt="Size Icon"> ${pizza.big_size.weight}</p>
        <section>
          <h1 class="smallPrice"><b>${pizza.small_size.price}</b></h1>
          <h4><b>грн.</b></h4>
          <button class="buyS buyButton">Купити</button>
        </section>
        <section>
          <h1 class="bigPrice"><b>${pizza.big_size.price}</b></h1>
          <h4><b>грн.</b></h4>
          <button class="buyB buyButton">Купити</button>
        </section>
      </div>
    `;
  } else if (pizza.big_size) {
    return `
      <div class="oneRowIcons">
        <p><img src="assets/images/size-icon.svg" alt="Size Icon"> 40</p>
        <p class="bigWeight"><img src="assets/images/weight.svg" alt="Size Icon"> ${pizza.big_size.weight}</p>
        <section>
          <h1 class="bigPrice"><b>${pizza.big_size.price}</b></h1>
          <h4><b>грн.</b></h4>
          <button class="buyB buyButton">Купити</button>
        </section>
      </div>
    `;
  } else if (pizza.small_size) {
    return `
      <div class="oneRowIcons">
        <p><img src="assets/images/size-icon.svg" alt="Size Icon"> 30</p>
        <p class="smallWeight"><img src="assets/images/weight.svg" alt="Size Icon"> ${pizza.small_size.weight}</p>
        <section>
          <h1 class="smallPrice"><b>${pizza.small_size.price}</b></h1>
          <h4><b>грн.</b></h4>
          <button class="buyS buyButton">Купити</button>
        </section>
      </div>
    `;
  } else {
    return '';
  }
}


var boughtPizzasNames = [];
var boughtPizzas = [];
document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length

//data about pizza
function updateLocalStorage() {
  var buyData = [];
  var buyElement = document.querySelectorAll('.buy .line');
  var conclusion = document.querySelector('.totalPrice').textContent;

  for(var i=0; i<buyElement.length; i++){
      var name = buyElement[i].querySelector('h4').textContent;
      var size = buyElement[i].querySelector('.boughtSize').textContent;
      var weight = buyElement[i].querySelector('.boughtWeight').textContent;
      var amount = buyElement[i].querySelector('.pizza-amount').textContent;
      var price = buyElement[i].querySelector('.price').textContent;
      var photo = buyElement[i].querySelector('.smallImages').getAttribute('src');

      buyData.push({
          name: name,
          size: size,
          weight: weight,
          amount: amount,
          price:price,
          photo:photo,
      });
  }
  localStorage.setItem('pizza', JSON.stringify(buyData));
  localStorage.setItem('boughtPizzas', JSON.stringify(boughtPizzasNames));
  localStorage.setItem('totalPrice', conclusion);
}

//reloading page
function loadBoughtPizzasFromLocalStorage() {

  var pizzaData = JSON.parse(localStorage.getItem('pizza'));
  
  for(var i=0; i<pizzaData.length; i++){
      var newLine = document.createElement("div");
      newLine.classList.add("mainLine");
      newLine.innerHTML = 
        `<section class="line">
  
        <h4>${pizzaData[i].name}</h4>
  
        <div class="buyIcons">
            <p class="boughtSize"> <img src="assets/images/size-icon.svg" alt="Size Icon"> ${pizzaData[i].size} </p>
            <p class="boughtWeight"> <img src="assets/images/weight.svg" alt="Size Icon"> ${pizzaData[i].weight} </p>
        </div>
  
        <div class="block"> 
            <b class="price">${pizzaData[i].price}</b>
            <span class="red-minus"><b></b></span>
            <span class="pizza-amount">${pizzaData[i].amount}</span>
            <span class="green-plus"><b></b></span>
            <span class="cross"><h3><b>⨯</b></h3></span>
        </div>
  
        <img src="${pizzaData[i].photo}" class="smallImages">
  
        </section>`;
      var firstPart = document.querySelector('.list');
      firstPart.appendChild(newLine);
      boughtPizzasNames.push(pizzaData[i].name);

      document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length
      document.querySelector('.totalPrice').innerHTML = localStorage.getItem('totalPrice')
  } 
}



//sorting pizzas
var typesSpan = document.querySelector('.types');
typesSpan.addEventListener('click', function(event) {

var types = typesSpan.querySelectorAll('p');
types.forEach(function(f){
     f.classList.remove('active')
 });

var target = event.target;
var all = document.querySelectorAll('.col-sm-6');


if (target.classList.contains('allTypes')) {
  all.forEach(function(element) {
      element.style.display = 'inline-block';
      target.classList.add('active')
  });

} else if (target.classList.contains('meatType')) {
  all.forEach(function(element) {
      if(!element.classList.contains('meat')){
      element.style.display = 'none';
      target.classList.add('active')
      }else{
          element.style.display = 'inline-block';
      }
  });

} else if (target.classList.contains('pineaplesType')) {
  all.forEach(function(element) {
      if(!element.classList.contains('pineaples')){
      element.style.display = 'none';
      target.classList.add('active')
      }else{
          element.style.display = 'inline-block';
      }
  });

} else if (target.classList.contains('mushroomsType')) {
  all.forEach(function(element) {
      if(!element.classList.contains('mushrooms')){
      element.style.display = 'none';
      target.classList.add('active')
      }else{
          element.style.display = 'inline-block';
      }
  });

} else if (target.classList.contains('seafoodType')) {
  all.forEach(function(element) {
      if(!element.classList.contains('seafood')){
      element.style.display = 'none';
      target.classList.add('active')
      }else{
          element.style.display = 'inline-block';
      }
  });

} else if (target.classList.contains('vegaType')) {
  all.forEach(function(element) {
      if(!element.classList.contains('vega')){
      element.style.display = 'none';
      target.classList.add('active');
      }else{
          element.style.display = 'inline-block';
      }
  });
}
});


//buy small pizza
function buySmallPizza(){
  var pizzaCard = this.closest('.pizza-card');
  var name = pizzaCard.querySelector('.caption h3').textContent;
  var photo = pizzaCard.querySelector('.images').getAttribute('src');
  var substringToRemove = ".jpg";
  var smallPhoto = photo.replace(substringToRemove, "_without_bg.png");
  var conclusion = document.querySelector('.totalPrice');
  var pay = parseInt(conclusion.textContent)

  var smallPrice = pizzaCard.querySelector('.smallPrice').textContent;
  var smallWeight = pizzaCard.querySelector('.smallWeight').textContent;

  if(!boughtPizzasNames.includes(name+" (Мала)")){
  var newLine = document.createElement("div");
  newLine.classList.add("mainLine");
  newLine.innerHTML = 
    `<section class="line">

    <h4>${name} (Мала)</h4>

    <div class="buyIcons">
        <p class="boughtSize"> <img src="assets/images/size-icon.svg" alt="Size Icon"> 30 </p>
        <p class="boughtWeight"> <img src="assets/images/weight.svg" alt="Size Icon"> ${smallWeight} </p>
    </div>

    <div class="block"> 
        <b class="price">${smallPrice}грн</b>
        <span class="red-minus"><b></b></span>
        <span class="pizza-amount">1</span>
        <span class="green-plus"><b></b></span>
        <span class="cross"><h3><b>⨯</b></h3></span>
    </div>

    <img src="${smallPhoto}" class="smallImages">

    </section>`;

  var firstPart = document.querySelector('.list');
  firstPart.appendChild(newLine);
  boughtPizzasNames.push(name+" (Мала)");
  document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length
  conclusion.innerHTML = (pay + parseInt(smallPrice))+" грн";
  }else{
      var lines = document.querySelectorAll('.line h4');
      var goods = document.querySelectorAll('.pizza-amount');
      var price = document.querySelectorAll('.price');
      var totalName = name + " (Мала)";
      for (var i = 0; i < lines.length; i++) {
        var nameBought = lines[i].textContent;
        var amount = parseInt(goods[i].textContent);
        var totalPrice = parseInt(price[i].textContent);
        if (nameBought.includes(totalName)) {
          amount++
          goods[i].innerHTML = amount;
          price[i].innerHTML = (totalPrice + parseInt(smallPrice))+"грн";
          conclusion.innerHTML = (pay + parseInt(smallPrice))+" грн"
        }
      }
  }
  updateLocalStorage();
  addEventListener();
  
}

//buy big pizza
function buyBigPizza(){
  var pizzaCard = this.closest('.pizza-card');
  var name = pizzaCard.querySelector('.caption h3').textContent;
  var photo = pizzaCard.querySelector('.images').getAttribute('src');
  var substringToRemove = ".jpg";
  var smallPhoto = photo.replace(substringToRemove, "_without_bg.png");
  var conclusion = document.querySelector('.totalPrice');
  var pay = parseInt(conclusion.textContent)

  var bigPrice = pizzaCard.querySelector('.bigPrice').textContent;
  var bigWeight = pizzaCard.querySelector('.bigWeight').textContent;

  if(!boughtPizzasNames.includes(name+" (Велика)")){
  var newLine = document.createElement("div");
  newLine.classList.add("mainLine");
  newLine.innerHTML = 
    `<section class="line">

    <h4>${name} (Велика)</h4>

    <div class="buyIcons">
        <p class="boughtSize"> <img src="assets/images/size-icon.svg" alt="Size Icon"> 40 </p>
        <p class="boughtWeight"> <img src="assets/images/weight.svg" alt="Size Icon"> ${bigWeight} </p>
    </div>

    <div class="block"> 
        <b class="price">${bigPrice}грн</b>
        <span class="red-minus"><b></b></span>
        <span class="pizza-amount">1</span>
        <span class="green-plus"><b></b></span>
        <span class="cross"><h3><b>⨯</b></h3></span>
    </div>

    <img src="${smallPhoto}" class="smallImages">

    </section>`;

  var firstPart = document.querySelector('.list');
  firstPart.appendChild(newLine);
  boughtPizzasNames.push(name+" (Велика)");
  document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length
  conclusion.innerHTML = (pay + parseInt(bigPrice))+" грн";
  }else{
      var lines = document.querySelectorAll('.line h4');
      var goods = document.querySelectorAll('.pizza-amount');
      var price = document.querySelectorAll('.price');
      var totalName = name + " (Велика)";
      for (var i = 0; i < lines.length; i++) {
        var nameBought = lines[i].textContent;
        var amount = parseInt(goods[i].textContent);
        var totalPrice = parseInt(price[i].textContent);
        if (nameBought.includes(totalName)) {
          amount++
          goods[i].innerHTML = amount;
          price[i].innerHTML = (totalPrice + parseInt(bigPrice))+"грн";
          conclusion.innerHTML = (pay + parseInt(bigPrice))+" грн"
        }
      }
  }
  updateLocalStorage();
  addEventListener();
}


//clearing all pizzas
function clearTheOrder(){
  var list = document.querySelector('.list');
  boughtPizzasNames = [];
  document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length
  list.innerHTML = "";
  document.querySelector('.totalPrice').textContent = "0 грн"
  updateLocalStorage();
  addEventListener();
}

// increasing pizza amount
function increaseAmount(){
  var line = this.closest('.line');
  var goods = line.querySelector('.pizza-amount');
  var amount = parseInt(goods.textContent);

  var price = line.querySelector('.price');
  var factPrice = parseInt(price.textContent)/amount;

  var conclusion = document.querySelector('.totalPrice');
  var pay = parseInt(conclusion.textContent)

  price.innerHTML = parseInt(price.textContent) + factPrice + "грн"
  conclusion.innerHTML = (pay + factPrice) + " грн"
  amount++
  goods.innerHTML = amount;
  updateLocalStorage();
  addEventListener();
}

//decreasing pizza amount
function decreaseAmount(){
  var list = document.querySelector('.list');
  var line = this.closest('.line');
  var name = line.querySelector('h4').textContent;
  var goods = line.querySelector('.pizza-amount');
  var amount = parseInt(goods.textContent);

  var price = line.querySelector('.price');
  var factPrice = parseInt(price.textContent)/amount;

  var conclusion = document.querySelector('.totalPrice');
  var pay = parseInt(conclusion.textContent)

  conclusion.innerHTML = (pay - factPrice) + " грн"
  if(amount>1){
      price.innerHTML = parseInt(price.textContent) - factPrice + "грн"
      amount--
      goods.innerHTML = amount;
  }else{
      list.removeChild(line.parentNode);
      boughtPizzasNames.splice(boughtPizzasNames.indexOf(name), 1);
  }
  document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length
  updateLocalStorage();
  addEventListener();
}


//cross
function removePizza(){
  var list = document.querySelector('.list');
  var line = this.closest('.line');
  var name = line.querySelector('h4').textContent;

  var price = line.querySelector('.price');
  var factPrice = parseInt(price.textContent);

  var conclusion = document.querySelector('.totalPrice');
  var pay = parseInt(conclusion.textContent)

  conclusion.innerHTML = (pay - factPrice) + " грн"
  list.removeChild(line.parentNode);
  boughtPizzasNames.splice(boughtPizzasNames.indexOf(name), 1);
  document.querySelector('.shoppingСart').innerHTML = boughtPizzasNames.length
  updateLocalStorage();
  addEventListener();
}
// event listeners
function addEventListener(){

  var removeButton = document.querySelectorAll('.red-minus');
  removeButton.forEach(function(removeButton) {
    removeButton.removeEventListener('click', decreaseAmount);
    removeButton.addEventListener('click', decreaseAmount);
  });
  
  var buySmallButton = document.querySelectorAll('.buyS');
  buySmallButton.forEach(function(buySmallButton) {
    buySmallButton.removeEventListener('click', buySmallPizza);
    buySmallButton.addEventListener('click', buySmallPizza);
  });
  
  var buyBigButton = document.querySelectorAll('.buyB');
  buyBigButton.forEach(function(buyBigButton) {
    buyBigButton.removeEventListener('click', buyBigPizza);
    buyBigButton.addEventListener('click', buyBigPizza);
  });
  
  var addButton = document.querySelectorAll('.green-plus');
  addButton.forEach(function(addButton) {
    addButton.removeEventListener('click', increaseAmount);
    addButton.addEventListener('click', increaseAmount);
  });
  
  var clearOrder = document.querySelectorAll('.clearOrder');
  clearOrder.forEach(function(clearOrder) {
    clearOrder.removeEventListener('click', clearTheOrder);
    clearOrder.addEventListener('click', clearTheOrder);
  });
  
  var deletePizza = document.querySelectorAll('.cross');
  deletePizza.forEach(function(deletePizza) {
    deletePizza.removeEventListener('click', removePizza);
    deletePizza.addEventListener('click', removePizza);
  });
  }
loadBoughtPizzasFromLocalStorage();
addEventListener();
