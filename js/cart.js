(function () {
  var CART_KEY = "aguofarm_cart";

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {}
    if (typeof updateHeaderCartCount === "function") updateHeaderCartCount();
    if (typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  }

  window.getCart = getCart;
  window.setCart = setCart;

  window.addToCart = function (productId, name, price, image, quantity) {
    quantity = quantity == null ? 1 : Math.max(1, parseInt(quantity, 10));
    var cart = getCart();
    var found = cart.find(function (item) { return item.id === productId; });
    if (found) {
      found.qty = (found.qty || 1) + quantity;
    } else {
      cart.push({
        id: productId,
        name: name || "",
        price: parseFloat(price) || 0,
        image: image || "",
        qty: quantity
      });
    }
    setCart(cart);
  };

  window.removeFromCart = function (productId) {
    var cart = getCart().filter(function (item) { return item.id !== productId; });
    setCart(cart);
  };

  window.updateCartQty = function (productId, qty) {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === productId; });
    if (item) {
      item.qty = parseInt(qty, 10);
      setCart(cart);
    }
  };

  window.getCartTotalCount = function () {
    return getCart().reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
  };

  window.getCartTotalAmount = function () {
    return getCart().reduce(function (sum, item) {
      return sum + (item.price || 0) * (item.qty || 1);
    }, 0);
  };

  window.updateHeaderCartCount = function () {
    var el = document.getElementById("header-cart-count");
    if (el) {
      var n = getCartTotalCount();
      el.textContent = n;
      el.style.display = n ? "" : "none";
    }
  };
})();
