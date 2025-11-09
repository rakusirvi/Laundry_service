$(document).ready(function () {
  let cart = [];
  let total = 0;

  $(".cart-btn").click(function () {
    const $btn = $(this);
    const serviceText = $btn
      .siblings("span")
      .contents()
      .get(0)
      .nodeValue.trim();
    const priceText = $btn
      .siblings("span")
      .find("span")
      .text()
      .replace(/[^\d.]/g, "");
    const price = parseFloat(priceText);

    const index = cart.findIndex((item) => item.name === serviceText);

    if (index === -1) {
      // Add item
      cart.push({ name: serviceText, price: price });
      total += price;
      $btn.text("Remove Item");
      $btn.css("background-color", "#ff4d4d");
    } else {
      // Remove item
      cart.splice(index, 1);
      total -= price;
      $btn.text("Add Item");
      $btn.css("background-color", "#9999992d");
    }

    updateCart();
  });

  function updateCart() {
    const $cartContainer = $(".cart");
    $cartContainer.empty();

    if (cart.length === 0) {
      $cartContainer.html(`
      <div><ion-icon class="alert" name="alert-circle-outline"></ion-icon></div>
      <h2>No Item Added</h2>
      <p>Add Item to the cart from the service bar</p>
    `);
    } else {
      let cartHTML = "";
      cart.forEach((item, index) => {
        cartHTML += `
        <div class="cart-row styled-cart-row">
          <span>${index + 1}</span>
          <span>${item.name}</span>
          <span>₹${item.price.toFixed(2)}</span>
        </div>`;
      });
      $cartContainer.html(cartHTML);
    }

    $("#price").text(`₹${total.toFixed(2)}`);
  }
});

$(".frm-btn").click(function () {
  if ($("#price").text() === "₹0.00") {
    alert("Please add items to your cart before placing an order.");
    return;
  }

  if ($("#name").val().trim() === "" || $("#phone").val().trim() === "") {
    alert("Please fill in all required fields before placing an order.");
    return;
  } else {
    alert("Your Order has been Placed Successfully!");
  }
});



