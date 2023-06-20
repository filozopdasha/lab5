

function addEventListeners() {
  var redMinusButtons = document.querySelectorAll('.red-minus');
  var greenPlusButtons = document.querySelectorAll('.green-plus');
  var nameFields = document.querySelectorAll('.fieldBorder');

  nameFields.forEach(function (field) {
    field.removeEventListener('input', handleNameFieldClick);
    field.addEventListener('input', handleNameFieldClick);
    field.removeEventListener('keydown', handleKeyPress);
    field.addEventListener('keydown', handleKeyPress);
  });

  redMinusButtons.forEach(function (button) {
    button.removeEventListener('click', handleRedMinusClick);
    button.addEventListener('click', handleRedMinusClick);
  });

  greenPlusButtons.forEach(function (button) {
    button.removeEventListener('click', handleGreenPlusClick);
    button.addEventListener('click', handleGreenPlusClick);
  });
}

// red-minus
function handleRedMinusClick() {
  var amountElement = this.nextElementSibling;
  var currentAmount = parseInt(amountElement.innerText);
  if (currentAmount > 1) {
    currentAmount = currentAmount - 1;
    amountElement.innerText = currentAmount;

    var line = this.closest('.line');
    var fieldBorder = line.querySelector('.fieldBorder');
    var placeholderValue = fieldBorder.value;
    var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
    var amounts = document.querySelectorAll('.line-for-notbought-products .product-item .amount');

    productItems.forEach(function (productItem, index) {
      var productItemText = productItem.querySelector('.nameLeft').innerText.trim().split(" ");
      if (productItemText[0] === placeholderValue) {
        amounts[index].innerText = currentAmount;
      }
    });

    updateRedMinusButton(amountElement);
  }
}

// green-plus
function handleGreenPlusClick() {
  var amountElement = this.previousElementSibling;
  var currentAmount = parseInt(amountElement.innerText);
  currentAmount = currentAmount + 1;
  amountElement.innerText = currentAmount;

  var line = this.closest('.line');
  var fieldBorder = line.querySelector('.fieldBorder');
  var placeholderValue = fieldBorder.value;
  var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
  var amounts = document.querySelectorAll('.line-for-notbought-products .product-item .amount');

  productItems.forEach(function (productItem, index) {
    var productItemText = productItem.querySelector('.nameLeft').innerText.trim().split(" ");
    if (productItemText[0] === placeholderValue) {
      amounts[index].innerText = currentAmount;
    }
  });

  updateRedMinusButton(amountElement);
}

// red-minus if 1
function updateRedMinusButton(amountElement) {
  var currentAmount = parseInt(amountElement.innerText);
  var redMinusButton = amountElement.previousElementSibling;

  if (currentAmount <= 1) {
    redMinusButton.style.backgroundColor = 'rgb(236, 179, 179)';
    redMinusButton.style.borderBottom = '0.2rem solid rgb(236, 179, 179)';
  } else {
    redMinusButton.style.backgroundColor = 'red';
    redMinusButton.style.borderBottom = '0.2rem solid rgb(197, 22, 22)';
  }
}

// add click event listener to red-minus and green-plus buttons
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('red-minus') || event.target.classList.contains('green-plus')) {
    var line = event.target.closest('.line');
    var amountElement = line.querySelector('.amount-gray');
    updateRedMinusButton(amountElement);
  }
});

//remove button
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('cross')) {
    var line = event.target.closest('.line');
    line.remove();

    var leftPart = document.querySelector('.left-part'); 

      // reduce left-part while deleting
      leftPart.style.height = (leftPart.offsetHeight - 77) + 'px';


    var fieldBorder = line.querySelector('.fieldBorder');
    var placeholderValue = fieldBorder.value;
    var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');

    productItems.forEach(function (productItem) {
      var productItemText = productItem.querySelector('.nameLeft').innerText.trim().split(" ");
      if (productItemText[0] === placeholderValue) {
        productItem.remove();
      }
    });
  }
});

// buy button
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('buy')) {
    var button = event.target;
    var currentStatus = button.textContent.trim();
    var newStatus = currentStatus === "Куплено" ? "Не куплено" : "Куплено";
    var line = button.closest('.line');
    var fieldBorder = line.querySelector('.fieldBorder');
    var value = fieldBorder.value;
    button.textContent = newStatus;

    if (newStatus === "Не куплено") {
      line.querySelector('.cross').style.display = "none";
      line.querySelector('.green-plus').style.visibility = "hidden";
      line.querySelector('.red-minus').style.visibility = "hidden";
      fieldBorder.style.textDecoration = "line-through";
      var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
      var amounts = document.querySelectorAll('.line-for-notbought-products .product-item .amount');
      fieldBorder.readOnly = true;
      button.setAttribute("data-tooltip", "not-bought");

      productItems.forEach(function (productItem, index) {
        var productItemText = productItem.querySelector('.nameLeft').innerText.trim().split(" ");
        if (productItemText[0] === value) {
          productItem.remove();
          var boughtPart = document.querySelector('.line-for-bought-products');
          boughtPart.appendChild(productItem);
          productItem.style.textDecoration = "line-through"; 
          amounts[index].style.textDecoration = "line-through";
        }
      });
    } else {
      line.querySelector('.cross').style.display = "inline-block";
      line.querySelector('.green-plus').style.visibility = "visible";
      line.querySelector('.red-minus').style.visibility = "visible";
      fieldBorder.style.textDecoration = "none";
      var productItems = document.querySelectorAll('.line-for-bought-products .product-item');
      var amounts = document.querySelectorAll('.line-for-bought-products .product-item .amount');
      fieldBorder.readOnly = false;
      button.setAttribute("data-tooltip", "bought");

      productItems.forEach(function (productItem, index) {
        var productItemText = productItem.querySelector('.nameLeft').innerText.trim().split(" ");
        if (productItemText[0] === value) {
          productItem.remove();
          var leftPart = document.querySelector('.line-for-notbought-products');
          leftPart.appendChild(productItem);
          productItem.style.textDecoration = "none"; 
          amounts[index].style.textDecoration = "none"; 
        }
      });
    }

    // adding gaps between product-items
    var productItemsWithGaps = document.querySelectorAll('.product-item');
    productItemsWithGaps.forEach(function (productItem, index) {
      productItem.style.marginBottom = '10px'; 
      productItem.style.marginRight = '10px'; 
    });
  }
});

// add button
var addButton = document.getElementById('add-button');
addButton.addEventListener('click', function () {
  var textField = document.querySelector('.name');
  var inputValue = textField.value;

  if (inputValue.trim() !== "") {
    var existingPlaceholders = Array.from(document.querySelectorAll('.fieldBorder')).map(function (fieldBorder) {
      return fieldBorder.value.toLowerCase();
    });

    if (existingPlaceholders.includes(inputValue.toLowerCase())) {
      alert("This product isn't unique");
    } else {
      var newLine = document.createElement("section");
      newLine.classList.add("line");

      newLine.innerHTML = `
        <section class="lblock"> 
          <input type="text" class="fieldBorder" value="${inputValue}">
        </section>
        <div class="block"> 
          <span class="red-minus" style="background-color: rgb(236, 179, 179); border-bottom: 0.2rem solid rgb(236, 179, 179)">-</span>
          <span class="amount-gray">1</span>
          <span class="tooltip green-plus" data-tooltip="add product">+</span>
        </div>
        <div class="buttonblock">
          <button class="buy tooltip" data-tooltip="not bought">Куплено</button>
          <span class="tooltip cross" data-tooltip="delete">x</span>
        </div>
      `;
      var newItem = document.createElement("span");
      newItem.classList.add("product-item");

      var productName = document.createElement("span");
      productName.classList.add("nameLeft");
      productName.textContent = inputValue + " ";

      var productAmount = document.createElement("span");
      productAmount.classList.add("amount");
      productAmount.style.color = "white";
      productAmount.textContent = "1";

      newItem.appendChild(productName);
      newItem.appendChild(productAmount);

      var rightPart = document.querySelector('.line-for-notbought-products');
      var leftPart = document.querySelector('.left-part');

      leftPart.appendChild(newLine);
      rightPart.appendChild(newItem);
      textField.value = ""; 

      // increase left-part while adding
      leftPart.style.height = (leftPart.offsetHeight + 57) + 'px';

      

      addEventListeners(); 
      textField.focus();
    }
  }
}
);
//add by clicking enter
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    var addButton = document.getElementById('add-button');
    addButton.click(); 
  }
}


document.addEventListener('keydown', handleKeyPress);

addEventListeners();


function handleNameFieldClick() {
  var line = this.closest('.line');
  var fieldBorder = line.querySelector('.fieldBorder');
  var value = fieldBorder.value;
  var placeholderValue = fieldBorder.getAttribute('value');
  var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
  if (value.length === 0) {
    fieldBorder.value = 'Name';
    value = 'Name';
  }
  productItems.forEach(function (productItem) {
    var nameLeft = productItem.querySelector('.nameLeft');
    if (nameLeft.innerText.trim() === placeholderValue) {
      nameLeft.innerText = value;
    }
  });
  


  fieldBorder.setAttribute('value', value);
}



addEventListeners();