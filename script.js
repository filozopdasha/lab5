function addEventListeners() {
  var redMinusButtons = document.querySelectorAll('.red-minus');
  var greenPlusButtons = document.querySelectorAll('.green-plus');
  var nameField = document.querySelectorAll('.fieldBorder');

  nameField.forEach(function (fieldBorder) {
    fieldBorder.removeEventListener('input', handleNameFieldClick);
    fieldBorder.addEventListener('input', handleNameFieldClick);
  });

  redMinusButtons.forEach(function(button) {
    button.removeEventListener('click', handleRedMinusClick);
    button.addEventListener('click', handleRedMinusClick);
  });

  greenPlusButtons.forEach(function(button) {
    button.removeEventListener('click', handleGreenPlusClick);
    button.addEventListener('click', handleGreenPlusClick);
  });
}

// Function to handle red-minus button click
function handleRedMinusClick() {
  var amountElement = this.nextElementSibling;
  var currentAmount = parseInt(amountElement.innerText);
  if (currentAmount > 1) {
    currentAmount = currentAmount - 1;
    amountElement.innerText = currentAmount;

    var line = this.closest('.line');
    var fieldBorder = line.querySelector('.fieldBorder');
    var placeholderValue = fieldBorder.getAttribute('value');
    var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
    var amounts = document.querySelectorAll('.line-for-notbought-products .product-item .amount');

    productItems.forEach(function(productItem, index) {
      var productItemText = productItem.textContent.trim();
      if (productItemText.includes(placeholderValue)) {
        amounts[index].innerText = currentAmount;
      }
    });

    updateRedMinusButton(amountElement);
  }
}

// Function to handle green-plus button click
function handleGreenPlusClick() {
  var amountElement = this.previousElementSibling;
  var currentAmount = parseInt(amountElement.innerText);
  currentAmount = currentAmount + 1;
  amountElement.innerText = currentAmount;

  var line = this.closest('.line');
  var fieldBorder = line.querySelector('.fieldBorder');
  var placeholderValue = fieldBorder.getAttribute('value');
  var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
  var amounts = document.querySelectorAll('.line-for-notbought-products .product-item .amount');

  productItems.forEach(function(productItem, index) {
    var productItemText = productItem.textContent.trim();
    if (productItemText.includes(placeholderValue)) {
      amounts[index].innerText = currentAmount;
    }
  });

  updateRedMinusButton(amountElement);
}

// Function to update the red-minus button style based on the amount
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

// Add click event listener to red-minus and green-plus buttons
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('red-minus') || event.target.classList.contains('green-plus')) {
    var line = event.target.closest('.line');
    var amountElement = line.querySelector('.amount-gray');
    updateRedMinusButton(amountElement);
  }
});

// Add click event listener to remove buttons
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('cross')) {
    var line = event.target.closest('.line');
    line.remove();

    var fieldBorder = line.querySelector('.fieldBorder');
    var placeholderValue = fieldBorder.getAttribute('value');
    var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');

    productItems.forEach(function(productItem) {
      var productItemText = productItem.textContent.trim();
      if (productItemText.includes(placeholderValue)) {
        productItem.remove();
      }
    }); 
  }
});

// Add click event listener to buy buttons
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('buy')) {
    var button = event.target;
    var currentStatus = button.textContent.trim();
    var newStatus = currentStatus === "Куплено" ? "Не куплено" : "Куплено";
    var line = button.closest('.line');
    var fieldBorder = line.querySelector('.fieldBorder');
    var value = fieldBorder.getAttribute('value');
    button.textContent = newStatus;


    if (newStatus === "Не куплено") {
      line.querySelector('.cross').style.display = "none";
      line.querySelector('.green-plus').style.visibility = "hidden"
      line.querySelector('.red-minus').style.visibility = "hidden"
      fieldBorder.style.textDecoration = "line-through";
      var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
      var amounts = document.querySelectorAll('.line-for-notbought-products .product-item .amount');
      fieldBorder.readOnly = true;

      productItems.forEach(function(productItem, index) {
        var productItemText = productItem.textContent.trim();
        if (productItemText.includes(value)) {
          productItem.remove();
          var boughtPart = document.querySelector('.line-for-bought-products');
          boughtPart.appendChild(productItem);
          productItem.style.textDecoration = "line-through"; // Apply line-through text decoration
          amounts[index].style.textDecoration = "line-through"; // Apply line-through text decoration to amount element
        }
      });

    } else {
      line.querySelector('.cross').style.display = "inline-block";
      line.querySelector('.green-plus').style.visibility = "visible"
      line.querySelector('.red-minus').style.visibility = "visible"
      fieldBorder.style.textDecoration = "none";
      var productItems = document.querySelectorAll('.line-for-bought-products .product-item');
      var amounts = document.querySelectorAll('.line-for-bought-products .product-item .amount');
      fieldBorder.readOnly = false;

      productItems.forEach(function(productItem, index) {
        var productItemText = productItem.textContent.trim();
        if (productItemText.includes(value)) {
          productItem.remove();
          var leftPart = document.querySelector('.line-for-notbought-products');
          leftPart.appendChild(productItem);
          productItem.style.textDecoration = "none"; // Remove line-through text decoration
          amounts[index].style.textDecoration = "none"; // Remove line-through text decoration from amount element
        }
      });

    }

    // Add gaps between product-items
    var productItemsWithGaps = document.querySelectorAll('.product-item');
    productItemsWithGaps.forEach(function(productItem, index) {
      productItem.style.marginBottom = '10px'; // Adjust the desired gap size here
      productItem.style.marginRight = '10px'; // Adjust the desired gap size here

    });
  }
});

// Add click event listener to add button
var addButton = document.getElementById('add-button');
addButton.addEventListener('click', function() {
  var textField = document.querySelector('.name');
  var inputValue = textField.value;

  if (inputValue.trim() !== "") {
    var existingPlaceholders = Array.from(document.querySelectorAll('.fieldBorder')).map(function(fieldBorder) {
      return fieldBorder.getAttribute('value').toLowerCase();
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
          <span class="red-minus"  style = "background-color: rgb(236, 179, 179); border-bottom: 0.2rem solid rgb(236, 179, 179)" >-</span>
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
      productName.classList.add("nameLeft")
      productName.textContent = inputValue;
      
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
      textField.value = ""; // Clear the input field

      // Increase the height of the left-part element
      leftPart.style.height = (leftPart.offsetHeight + 56) + 'px';

      addEventListeners(); // Attach event listeners to the new line
      textField.focus();
    }
  }
});


function handleNameFieldClick() {
  var line = this.closest('.line');
  var fieldBorder = line.querySelector('.fieldBorder');
  var value = fieldBorder.value;
  var placeholderValue = fieldBorder.getAttribute('value');
  var productItems = document.querySelectorAll('.line-for-notbought-products .product-item');
  var nameLeft = document.querySelectorAll('.line-for-notbought-products .product-item .nameLeft');
  var nameField = document.querySelectorAll('.fieldBorder');

  // Check if the field is not empty
  if (value.trim() !== "") {
    productItems.forEach(function(productItem, index) {
      var productItemText = productItem.textContent.trim();
      if (productItemText.includes(placeholderValue)) {
        if (value.length === 1 && fieldBorder.selectionStart === 0 && fieldBorder.selectionEnd === 1) {
          alert("A product name should have at least one character");
          fieldBorder.setSelectionRange(0, 1); // Keep the cursor at the first position
        } else {
          nameLeft[index].innerText = value;
          nameField[index].value = value;
          fieldBorder.setAttribute('value', value); // Update the value attribute of the field border
        }
      }
    });
  } else {
    alert("A product name should have at least one character");
    nameLeft.forEach(function(name, index) {
      var productItem = productItems[index];
      var productItemText = productItem.textContent.trim();
      if (productItemText.includes(placeholderValue)) {
        name.innerText = placeholderValue;
      }
    });
  }
}



// Initial setup
addEventListeners();