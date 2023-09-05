// cart

const getProductsFromStorage = () => {
  return JSON.parse(localStorage.getItem("cartProducts"));
};

const calculateSumPrice = () => {
  const total = document.querySelector(".total__price");
  const sum = getProductsFromStorage().reduce((acc, product) => {
    acc += product.count * product.price;
    return acc;
  }, 0);

  total.innerText = `${sum}$`;
};

const renderProductsInCart = () => {
  const cartBlockProducts = document.querySelector(".contentCart__products");
  const productsArray = JSON.parse(localStorage.getItem("cartProducts"));

  cartBlockProducts.innerHTML = "";

  productsArray.forEach((product) => {
    cartBlockProducts.insertAdjacentHTML(
      "beforeend",
      `
    <div class="products__product">
            <img class="product__img" src="./img/${product.img}" />
            <p class="product__title">${product.category} ${product.brand} ${product.color}</p>
            <div class="product__productCounter">
              <p id="${product._id}" class="productCounter__decrement">-</p>
              <input id="${product._id}" class="productCounter__input" type="number" value="${product.count}" />
              <p id="${product._id}" class="productCounter__increment">+</p>
            </div>
            <img id="${product._id}" class="product__trash" src="./img/icon-trash.svg" />
          </div>
    `
    );
  });
  calculateSumPrice();
};

const iconCart = document.querySelector(".header__cart");
const windowCart = document.querySelector(".windowCart");
const contentCart = document.querySelector(".windowCart__contentCart");
const iconCloseCart = document.querySelector(".contentCart__imgClose");

iconCart.addEventListener("click", () => {
  document.body.style.overflow = "hidden";
  windowCart.classList.add("active_cart");
  contentCart.classList.add("active-content-cart");

  renderProductsInCart();
});

windowCart.addEventListener("click", (e) => {
  const inputsCounter = document.querySelectorAll(".productCounter__input");
  inputsCounter.forEach((input) => {
    input.addEventListener("change", () => {
      const prevValue = input.value;
      if (input.value >= 1 && input.value <= 99) {
        const productsArray = getProductsFromStorage();
        const currentProduct = productsArray.filter(
          (product) => product._id === input.id
        )[0];
        currentProduct.count = +input.value;
        localStorage.setItem("cartProducts", JSON.stringify(productsArray));
        renderProductsInCart();
      } else {
        input.value = prevValue;
        renderProductsInCart();
      }
    });
  });

  if (
    e.target.classList.contains("contentCart__imgClose") ||
    e.target.classList.contains("windowCart")
  ) {
    windowCart.classList.remove("active_cart");
    contentCart.classList.remove("active-content-cart");
    document.body.style.overflow = "inherit";
  }
  if (e.target.classList.contains("product__trash")) {
    const updateProducts = getProductsFromStorage().filter(
      (product) => product._id !== e.target.id
    );
    localStorage.setItem("cartProducts", JSON.stringify(updateProducts));
    renderProductsInCart();
  }
  if (e.target.classList.contains("productCounter__decrement")) {
    const productsArray = getProductsFromStorage();
    const currentProduct = productsArray.filter(
      (product) => product._id === e.target.id
    )[0];
    if (currentProduct.count > 1 && currentProduct.count <= 99) {
      currentProduct.count -= 1;
      localStorage.setItem("cartProducts", JSON.stringify(productsArray));
      renderProductsInCart();
    }
  }
  if (e.target.classList.contains("productCounter__increment")) {
    const productsArray = getProductsFromStorage();
    const currentProduct = productsArray.filter(
      (product) => product._id === e.target.id
    )[0];
    if (currentProduct.count >= 1 && currentProduct.count < 99) {
      currentProduct.count += 1;
      localStorage.setItem("cartProducts", JSON.stringify(productsArray));
      renderProductsInCart();
    }
  }
});

if (localStorage.getItem("cartProducts") === null) {
  localStorage.setItem("cartProducts", JSON.stringify([]));
}
