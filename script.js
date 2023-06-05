var add = ['addTomatoes', 'addCookies', 'addCheese'];
var remove = ['removeTomatoes', 'removeCookies', 'removeCheese'];
var goodsAmount = document.querySelectorAll('.amount-gray');
var rightAmount = [document.getElementById('tomatoesAmount'), document.getElementById('cookiesAmount'), document.getElementById('cheeseAmount')]
var amount = [2, 2, 1];


for (var i = 0; i < add.length; i++) {
  check();
  document.getElementById(add[i]).addEventListener("click", addGoods);
  document.getElementById(remove[i]).addEventListener("click", removeGoods);
}

function check() {
  for (var i = 0; i < add.length; i++) {
    if (amount[i] === 1) {
      var paragraph = document.getElementById(remove[i]);
      paragraph.classList.add("red-minus2");
      paragraph.classList.remove("red-minus");
    } else if (amount[i] > 1) {
      var paragraph = document.getElementById(remove[i]);
      paragraph.classList.add("red-minus");
      paragraph.classList.remove("red-minus2");
    }
  }
}

function addGoods(event) {
  var buttonId = event.target.id;

  for (var i = 0; i < add.length; i++) {
    if (buttonId == add[i]) {
      ++amount[i];
      goodsAmount[i].innerHTML = amount[i];
      rightAmount[i].innerHTML = amount[i];
      break; 
    }
  }
  check();
}

function removeGoods(event) {
  var buttonId = event.target.id;

  for (var i = 0; i < remove.length; i++) {
    if (buttonId == remove[i]) {
      if (amount[i] !== 1) {
        --amount[i];
        goodsAmount[i].innerHTML = amount[i];
        rightAmount[i].innerHTML = amount[i];
      }
      break; 
    }
  }
  check();
}
var crosses = document.querySelectorAll('.cross');

for (var i = 0; i < crosses.length; i++) {
  crosses[i].addEventListener("click", removeLine);
}

function removeLine(event) {
  var line = event.target.closest('.line');
  var fieldBorder = line.querySelector('.fieldBorder');
  var placeholderValue = fieldBorder.getAttribute('placeholder');
  var productItems = document.querySelectorAll('.line-for-products .product-item');

  line.remove();

  productItems.forEach(function(productItem) {
    var productItemText = productItem.textContent.trim();
    if (productItemText.includes(placeholderValue)) {
      productItem.remove();
    }
  });
}


function toggleBuyStatus(event) {
  var buyButton = event.target;
  var currentStatus = buyButton.textContent.trim();
  var newStatus = currentStatus === "Куплено" ? "Не куплено" : "Куплено";
  buyButton.textContent = newStatus;

  var cross = buyButton.parentNode.querySelector('.cross');
  var fieldBorder = buyButton.closest('.line').querySelector('.fieldBorder');
  var productItem = buyButton.closest('.line').querySelector('.product-item');
  var boughtProductsLine = document.querySelector('.bought-products');

  if (newStatus === "Не куплено") {
    cross.style.display = "none";
    fieldBorder.style.textDecoration = "line-through";
    boughtProductsLine.appendChild(productItem);
  } else {
    cross.style.display = "inline-block";
    fieldBorder.style.textDecoration = "none";
    var rightPart = document.querySelector('.right-part');
    rightPart.insertBefore(productItem, boughtProductsLine.nextSibling);
  }
}

var buyButtons = document.querySelectorAll('.buy');
for (var i = 0; i < buyButtons.length; i++) {
  buyButtons[i].addEventListener("click", toggleBuyStatus);
}


var addButton = document.getElementById('add-button');
addButton.addEventListener('click', readTextField);

function readTextField() {
  var textField = document.querySelector('.name');
  var inputValue = textField.value;
  let newLine = document.createElement("section");
  newLine.classList.add("line");

  newLine.innerHTML = `
    <section class="lblock"> 
      <input type="text" class="fieldBorder" placeholder="${inputValue}">
    </section>
    <div class="block"> 
      <span class="tooltip red-minus" data-tooltip="remove product">-</span>
      <span class="amount-gray">2</span>
      <span class="tooltip green-plus" data-tooltip="add product">+</span>
    </div>
    <div class="buttonblock">
      <button class="buy tooltip" data-tooltip="not bought">Куплено</button>
      <span class="tooltip cross" data-tooltip="delete">x</span>
    </div>
  `;

  var leftPart = document.querySelector('.left-part');
  leftPart.appendChild(newLine);

  adjustLeftPartHeight();
}

function adjustLeftPartHeight() {
  var leftPart = document.querySelector('.left-part');
  var leftPartHeight = leftPart.offsetHeight;
  leftPart.style.height = leftPartHeight+56+'px';
}

