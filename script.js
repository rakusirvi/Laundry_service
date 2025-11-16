$(document).ready(function () {
  let cart = [];
  let total = 0;

  // Initialize EmailJS with your public key
  emailjs.init("4qvOEQW2WiL1CEC2P"); // Replace with your actual public key

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
      cart.push({ name: serviceText, price: price, units: 1 });
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

  // Handle form submission with EmailJS for order confirmation
  $("#laundryForm").submit(function (e) {
    e.preventDefault();

    // Validation
    if ($("#price").text() === "₹0.00") {
      alert("Please add items to your cart before placing an order.");
      return;
    }

    if (
      $("#name").val().trim() === "" ||
      $("#phone").val().trim() === "" ||
      $("#email").val().trim() === ""
    ) {
      alert("Please fill in all required fields before placing an order.");
      return;
    }

    // Calculate costs based on your template structure
    const shippingCost = 50; // Fixed shipping cost
    const taxRate = 0.18; // 18% tax
    const taxAmount = total * taxRate;
    const orderTotal = total + shippingCost + taxAmount;

    // Generate unique order ID
    const orderId = "FW" + Date.now() + Math.floor(Math.random() * 1000);

    // Prepare email template parameters matching your ORDER template structure
    const templateParams = {
      order_id: orderId,
      orders: cart.map((item) => ({
        name: item.name,
        price: item.price.toFixed(2),
        units: item.units,
      })),
      cost: {
        shipping: shippingCost.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: orderTotal.toFixed(2),
      },
      user_name: $("#name").val().trim(),
      user_email: $("#email").val().trim(),
      user_phone: $("#phone").val().trim(),
    };

    // Send order confirmation email using EmailJS
    emailjs.send("service_p91sk6t", "template_ddpc705", templateParams).then(
      function (response) {
        console.log(
          "ORDER CONFIRMATION SUCCESS!",
          response.status,
          response.text
        );

        // Show success message with order ID
        alert(
          `Your order has been placed successfully! Order #${orderId}\nWe've sent a confirmation email.`
        );

        // Reset form and cart
        $("#laundryForm")[0].reset();
        cart = [];
        total = 0;
        updateCart();
        resetCartButtons();
      },
      function (error) {
        console.log("ORDER CONFIRMATION FAILED...", error);
        alert(
          "There was an error processing your order. Please try again or contact us directly."
        );
      }
    );
  });

  // Function to reset cart buttons
  function resetCartButtons() {
    $(".cart-btn").text("Add Item").css("background-color", "#9999992d");
  }
});
