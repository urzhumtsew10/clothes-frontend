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

const sendNewOrder = async (data) => {
  const answer = await fetch(`https://clothes-api-eta.vercel.app/new-order`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
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

const total = document.querySelector(".total__price");
const iconCart = document.querySelector(".header__cart");
const windowCart = document.querySelector(".windowCart");
const contentCart = document.querySelector(".windowCart__contentCart");
const iconCloseCart = document.querySelector(".contentCart__imgClose");
const orderForm = document.querySelector(".windowCart__orderForm");
const formElement = document.querySelector(".orderForm__form");
const radioButtons = document.querySelectorAll(".payment__input");
const formNumberCard = document.querySelector(".numberCard");
const gratefulBlock = document.querySelector(".orderForm__gratefulBlock");

const errorName = document.querySelector(".error-name");
const errorSurname = document.querySelector(".error-surname");
const errorEmail = document.querySelector(".error-email");
const errorPayment = document.querySelector(".error-payment");
const errorCard = document.querySelector(".error-card");
const numberCardBlock = document.querySelector(".numberCard");

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
    calculateQuantityProducts();
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
      calculateQuantityProducts();
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
      calculateQuantityProducts();
    }
  }
  if (e.target.classList.contains("blockInfo__btn")) {
    const windowRegistration = document.querySelector(".windowRegistration");
    const contentReg = document.querySelector(
      ".windowRegistration__contentRegistr"
    );
    if (getProductsFromStorage().length !== 0) {
      if (localStorage.getItem("token") !== null) {
        orderForm.classList.toggle("active-order-form");
      } else {
        windowCart.classList.remove("active_cart");
        contentCart.classList.remove("active-content-cart");
        windowRegistration.classList.add("active-windowRegistr");
        contentReg.classList.add("active-contentRegistr");
      }
    }
  }
  if (e.target.classList.contains("orderForm__cancel")) {
    orderForm.classList.toggle("active-order-form");
    formElement.reset();
    errorName.classList.remove("active-error");
    errorSurname.classList.remove("active-error");
    errorEmail.classList.remove("active-error");
    errorPayment.classList.remove("active-error");
    errorCard.classList.remove("active-error");
    formNumberCard.classList.remove("active-numberCard-form");
  }
  if (e.target.classList.contains("orderForm__apply")) {
    e.preventDefault();
    const formData = new FormData(formElement);
    const entries = formData.entries();
    const data = Object.fromEntries(entries);

    const regEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

    if (data.name.trim("") === "" || !isNaN(Number(data.name))) {
      errorName.classList.add("active-error");
    } else {
      errorName.classList.remove("active-error");
    }

    if (data.surname.trim("") === "" || !isNaN(Number(data.surname))) {
      errorSurname.classList.add("active-error");
    } else {
      errorSurname.classList.remove("active-error");
    }

    if (!regEmail.test(data.email)) {
      errorEmail.classList.add("active-error");
      errorEmail.innerText = "email is invalid";
    } else {
      errorEmail.classList.remove("active-error");
    }

    if (data.payment === undefined) {
      errorPayment.classList.add("active-error");
    } else {
      errorPayment.classList.remove("active-error");
    }

    if (numberCardBlock.classList.contains("active-numberCard-form")) {
      if (
        isNaN(Number(data.numberCard)) ||
        (!isNaN(Number(data.numberCard)) && data.numberCard.length !== 16)
      ) {
        errorCard.classList.add("active-error");
      } else {
        errorCard.classList.remove("active-error");
      }
    }

    const isValidForm =
      !errorName.classList.contains("active-error") &&
      !errorSurname.classList.contains("active-error") &&
      !errorEmail.classList.contains("active-error") &&
      !errorPayment.classList.contains("active-error") &&
      !errorCard.classList.contains("active-error");

    if (isValidForm) {
      const tokenData = parseJwt(localStorage.getItem("token"));
      const orderData = {
        userName: tokenData.name,
        clientData: data,
        clientOrder: getProductsFromStorage(),
        total: total.innerText,
      };

      sendNewOrder(orderData);

      gratefulBlock.classList.add("active-gratefulBlock");

      setTimeout(() => {
        gratefulBlock.classList.remove("active-gratefulBlock");
        orderForm.classList.remove("active-order-form");
        windowCart.classList.remove("active_cart");
        contentCart.classList.remove("active-content-cart");
        document.body.style.overflow = "inherit";
        formElement.reset();
        calculateQuantityProducts();
      }, 5000);

      localStorage.setItem("cartProducts", JSON.stringify([]));
    }
  }
});

if (localStorage.getItem("cartProducts") === null) {
  localStorage.setItem("cartProducts", JSON.stringify([]));
}

radioButtons.forEach((radio) => {
  radio.addEventListener("click", (e) => {
    if (radio.value === "card") {
      formNumberCard.classList.add("active-numberCard-form");
    } else {
      formNumberCard.classList.remove("active-numberCard-form");
    }
  });
});
