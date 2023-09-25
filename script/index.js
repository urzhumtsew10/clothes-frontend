// index.html

// check token

const checkToken = () => {
  const iconLog = document.querySelector(".header__log");
  const iconAccount = document.querySelector(".header__account");

  const isToken = localStorage.getItem("token");
  if (isToken === null) {
    iconLog.classList.add("active-icon");
  } else {
    iconAccount.classList.add("active-icon");
  }
};

checkToken();

// calculate products in cart

const calculateQuantityProducts = () => {
  const products = JSON.parse(localStorage.getItem("cartProducts"));
  const quantityProducts = products.reduce((acc, product) => {
    acc += product.count;
    return acc;
  }, 0);
  const cartTotal = document.querySelector(".circle__total");
  cartTotal.innerText = quantityProducts;
};

calculateQuantityProducts();

// Menu Burger

const navList = document.querySelector(".navigation__list");
const menuBurger = document.querySelector(".navigation__icon");
const listItems = document.querySelectorAll(".list__nav-item");

menuBurger.addEventListener("click", () => {
  navList.classList.toggle("active__menu");
  document.body.classList.toggle("_lock");
  menuBurger.classList.toggle("_active");
});

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    navList.classList.remove("active__menu");
    document.body.classList.remove("_lock");
    menuBurger.classList.remove("_active");
  });
});

// user office

const deleteUserOrder = async (orderId) => {
  const answer = await fetch(
    `https://clothes-api-eta.vercel.app/delete-order`,
    {
      method: "POST",
      body: JSON.stringify({ orderId: orderId }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await answer.json();
};

const addNewProduct = async (data) => {
  const answer = await fetch(`https://clothes-api-eta.vercel.app/add-product`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
};

const setProduct = async (data) => {
  const answer = await fetch(
    `https://clothes-api-eta.vercel.app/redact-product`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await answer.json();
};

const deleteProduct = async (productId) => {
  const answer = await fetch(
    `https://clothes-api-eta.vercel.app/delete-product`,
    {
      method: "POST",
      body: JSON.stringify({ productId: productId }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await answer.json();
};

const findUserOrders = async (user) => {
  const answer = await fetch(`https://clothes-api-eta.vercel.app/user-orders`, {
    method: "POST",
    body: JSON.stringify({ userName: user }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
};

const correctionData = (data) => {
  data.category =
    data.category[0].toUpperCase() +
    data.category.slice(1, data.category.length).toLowerCase();
  data.brand = data.brand =
    data.brand[0].toUpperCase() +
    data.brand.slice(1, data.brand.length).toLowerCase();
  data.color = data.color.toLocaleLowerCase();
  data.size = data.size.toUpperCase();
  data.for = data.for.toLowerCase();
};

const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const resetInutsStyle = () => {
  const inputs = document.querySelectorAll(".input_product");
  inputs.forEach((input) => {
    input.classList.remove("active-input-error");
  });
};

const iconAccount = document.querySelector(".header__account");
const windowAccount = document.querySelector(".windowAccount");
const windowContentAccount = document.querySelector(
  ".windowAccount__countentAccount"
);
const ordersBlock = document.querySelector(".contentAccount__yourOrder");
const accountTitle = document.querySelector(".contentAccount__title");
const orderArrow = document.querySelector(".yourOrder__img ");
const loader = document.querySelector(".loader");

const renderOrders = (userName) => {
  ordersBlock.innerHTML = "";
  findUserOrders(userName).then((orders) => {
    let countOrders = 1;
    orders.forEach((order) => {
      ordersBlock.insertAdjacentHTML(
        "beforeend",
        `<div class="yourOrder__order">
          <div id="${order._id}" class="order__title">Your Order №${countOrders}
           <p id="${order._id}" class="order__total">${order.total}</p>
           <img id="${order._id}" class="order__trash" src="./img/icon-trash.svg"/>
          </div>
        </div>`
      );
      countOrders += 1;
    });
    loader.classList.remove("active-loader");
  });
};

const renderProducts = (userName, id) => {
  ordersBlock.innerHTML = "";
  findUserOrders(userName).then((orders) => {
    const currentOrder = orders.filter((order) => order._id === id)[0];
    currentOrder.products.forEach((product) => {
      ordersBlock.insertAdjacentHTML(
        "beforeend",
        ` <div class="yourOrder__orderBox">
            <img class="orderBox__img" src="./img/${product.img}" />
            <p class="orderBox__title">${product.category} ${product.brand} ${product.color}</p>
            <p class="orderBox__count">${product.count}</p>
            <p class="orderBox__price">${product.price}$</p>
          </div>`
      );
    });
    orderArrow.classList.add("active-order-arrow");
  });
};

iconAccount.addEventListener("click", () => {
  loader.classList.add("active-loader");
  windowContentAccount.classList.add("active-content");
  windowAccount.classList.add("active-account");
  document.body.style.overflow = "hidden";
  const tokenData = parseJwt(localStorage.getItem("token"));

  if (tokenData.role === "admin") {
    windowContentAccount.insertAdjacentHTML(
      "beforeend",
      `<div class="contentAccount__adminPart">'
        <input class="adminPart__search" type="text" placeholder="search product..."/>
        <div class="adminPart__managmentBlock"></div>
       </div>
       <div class="newProductForm__windowError">
        <div class="windowError__contenrError">
          <div class="contentError__title">
            <p class="title__text">Error</p>
            <img class="title__img" src="./img/error-icon.svg"/>
          </div>
          <p class="contentError__descriptionError">
            Your image weighs a lot <br/>
            Maximum image weight 70kb
          </p>
          <button class="contentError__button">Ok</button>
        </div>
       </div>
       <form class="managmentBlock__newProductForm">
        <input name="img" class="newProductForm__file" type="file" accept=".jpg, .jpeg, .png"/>
        <div class="newProductForm__preview"></div>
        <input name="category" class="newProductForm__category input_product" placeholder="category" type="text"/>
        <input name="brand" class="newProductForm__brand input_product" placeholder="brand" type="text"/>
        <input name="color" class="newProductForm__color input_product" placeholder="color" type="text"/>
        <input name="size" class="newProductForm__size input_product" placeholder="size" type="text"/>
        <input name="for" class="newProductForm__for input_product" placeholder="for" type="text"/>
        <input name="price" class="newProductForm__price input_product" placeholder="price" type="text"/>
        <button class="newProductForm__addImg">Add File</button>
        <button class="newProductForm__submit">Submit</button>
      </form>
      <form class="managmentBlock__redactProductForm">
        <input name="img" class="redactProductForm__file" type="file" accept=".jpg, .jpeg, .png"/>
        <div class="redactProductForm__preview redact__img"></div>
        <input name="category" class="newProductForm__category redact__category input_product" placeholder="category" type="text"/>
        <input name="brand" class="newProductForm__brand redact__brand input_product" placeholder="brand" type="text"/>
        <input name="color" class="newProductForm__color redact__color input_product" placeholder="color" type="text"/>
        <input name="size" class="newProductForm__size redact__size input_product" placeholder="size" type="text"/>
        <input name="for" class="newProductForm__for redact__for input_product" placeholder="for" type="text"/>
        <input name="price" class="newProductForm__price redact__price input_product" placeholder="price" type="text"/>
        <input name="id" class="redact__id" type="text"/>
        <button class="redactProductForm__addImg">Set File</button>
        <button class="newProductForm__setForm">Safe</button>
      </form>
      <button class="contentAccount__btnManage active-account-btn">Manage Products</button>
      <button class="contentAccount__btnAdd">Add Product</button>`
    );
  }
  renderOrders(tokenData.name);
});

windowAccount.addEventListener("click", (e) => {
  const managmentBtn = document.querySelector(".contentAccount__btnManage");
  const leaveBtn = document.querySelector(".contentAccount__btnExit");
  const addProductBtn = document.querySelector(".contentAccount__btnAdd");
  const tokenData = parseJwt(localStorage.getItem("token"));
  const managmentBlock = document.querySelector(".contentAccount__adminPart");
  const seacrhProduct = document.querySelector(".adminPart__managmentBlock");
  const searchInput = document.querySelector(".adminPart__search");
  const newProductForm = document.querySelector(
    ".managmentBlock__newProductForm"
  );
  const redactProductForm = document.querySelector(
    ".managmentBlock__redactProductForm"
  );
  const divPreview = document.querySelector(".newProductForm__preview");
  const errorWindow = document.querySelector(".newProductForm__windowError");
  if (
    e.target.classList.contains("contentAccount__imgClose") ||
    e.target.classList.contains("windowAccount")
  ) {
    windowContentAccount.classList.remove("active-content");
    windowAccount.classList.remove("active-account");
    managmentBlock.classList.remove("active-managment");
    orderArrow.classList.remove("active-order-arrow");
    redactProductForm.classList.remove("active-redactProductForm");
    addProductBtn.classList.remove("active-account-btn");
    leaveBtn.classList.add("active-account-btn");
    addProductBtn.classList.remove("active-account-btn");
    newProductForm.classList.remove("active-newProductForm");
    divPreview.innerHTML = "";
    newProductForm.reset();
    resetInutsStyle();
    accountTitle.innerText = "Your Account";
    document.body.style.overflow = "inherit";
    const blockProductsCoordinates =
      blockProducts.getBoundingClientRect().top + pageYOffset - 100;
    window.scrollTo({
      top: blockProductsCoordinates,
    });
    location.reload();
  }
  if (e.target.classList.contains("contentAccount__btnExit")) {
    localStorage.removeItem("token");

    windowContentAccount.classList.remove("active-content");
    windowAccount.classList.remove("active-account");
    document.body.style.overflow = "inherit";

    location.reload();
  }
  if (
    e.target.classList.contains("order__title") ||
    e.target.classList.contains("order__total")
  ) {
    const orderId = e.target.id;
    renderProducts(tokenData.name, orderId);
  }
  if (e.target.classList.contains("yourOrder__img")) {
    newProductForm.classList.remove("active-newProductForm");
    redactProductForm.classList.remove("active-redactProductForm");
    addProductBtn.classList.remove("active-account-btn");
    loader.classList.add("active-loader");
    accountTitle.innerText = "Your Account";
    renderOrders(tokenData.name);
    orderArrow.classList.remove("active-order-arrow");
    divPreview.innerHTML = "";
    newProductForm.reset();
    resetInutsStyle();

    managmentBtn.classList.add("active-account-btn");
    leaveBtn.classList.add("active-account-btn");
    managmentBlock.classList.remove("active-managment");
    addProductBtn.classList.remove("active-account-btn");
  }
  if (e.target.classList.contains("order__trash")) {
    const orderId = e.target.id;
    deleteUserOrder(orderId);
    const currentOrder = document.getElementById(`${orderId}`).parentNode;
    currentOrder.style.display = "none";
  }
  if (e.target.classList.contains("contentAccount__btnManage")) {
    accountTitle.innerText = "Managment Product";
    getProducts().then((products) => {
      searchInput.oninput = () => {
        const searchReg = new RegExp(`${searchInput.value.toLowerCase()}`);
        const filteredProducts = products.filter((product) => {
          const titleProduct = `${product.for} ${product.category} ${product.brand} ${product.color}`;

          return searchReg.test(titleProduct.toLowerCase());
        });
        seacrhProduct.innerHTML = "";
        filteredProducts.forEach((product) => {
          const imgSource =
            product.img.length > 50 ? product.img : `./img/${product.img}`;
          seacrhProduct.insertAdjacentHTML(
            "beforeend",
            `
           <div id="${product._id}" class="managmentBlock__searchProduct">
            <img id="${product._id}-img" class="searchProduct__img" src="${imgSource}"/>
            <p class="searchProduct__title">${product.for}'s ${product.category} ${product.brand} ${product.color}</p>
            <p class="searchProduct__price">price: ${product.price}$</p>
            <img id="${product._id}" class="searchProduct__redact" src="./img/icon-pencil.svg"/>
            <img id="${product._id}" class="searchProduct__trash" src="./img/icon-trash.svg"/>
          </div>`
          );
        });
      };
    });

    ordersBlock.innerHTML = "";
    orderArrow.classList.add("active-order-arrow");
    managmentBtn.classList.remove("active-account-btn");
    leaveBtn.classList.remove("active-account-btn");
    addProductBtn.classList.add("active-account-btn");
  }
  if (e.target.classList.contains("contentAccount__btnManage")) {
    managmentBlock.classList.add("active-managment");
  }
  if (e.target.classList.contains("searchProduct__trash")) {
    const trashId = e.target.id;
    deleteProduct(trashId);
    const currentProduct = document.getElementById(`${trashId}`);
    currentProduct.style.display = "none";
  }
  if (e.target.classList.contains("contentAccount__btnAdd")) {
    addProductBtn.classList.remove("active-account-btn");
    managmentBlock.classList.remove("active-managment");
    newProductForm.classList.add("active-newProductForm");
  }
  const inputFile = document.querySelector(".newProductForm__file");
  if (e.target.classList.contains("newProductForm__addImg")) {
    e.preventDefault();
    inputFile.click();
    inputFile.addEventListener("change", (e) => {
      const img = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        divPreview.innerHTML = `<img class="product_img" src="${e.target.result}"/>`;
      };
      reader.readAsDataURL(img);
    });
  }
  const redactPreview = document.querySelector(".redactProductForm__preview");
  if (e.target.classList.contains("redactProductForm__addImg")) {
    const inputFile = document.querySelector(".redactProductForm__file");

    e.preventDefault();
    inputFile.click();
    inputFile.addEventListener("change", (e) => {
      const img = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        redactPreview.innerHTML = `<img class="product_img" src="${e.target.result}"/>`;
      };
      reader.readAsDataURL(img);
    });
  }
  if (e.target.classList.contains("newProductForm__submit")) {
    const priceInput = document.querySelector(".newProductForm__price");

    e.preventDefault();
    const formData = new FormData(newProductForm);
    const entries = formData.entries();
    const data = Object.fromEntries(entries);

    const img = inputFile.files[0];
    const isValidImg = img && img.size <= 70729 ? true : false;
    if (img) {
      divPreview.classList.remove("active-previewBlock-error");
      if (!isValidImg) {
        errorWindow.classList.add("active-error-window");
      } else {
        errorWindow.classList.remove("active-error-window");
      }
    } else {
      divPreview.classList.add("active-previewBlock-error");
    }

    if (isNaN(+data.price) || data.price === "") {
      priceInput.value = "";
      priceInput.classList.add("active-input-error");
    } else {
      priceInput.classList.remove("active-input-error");
    }

    const inputs = document.querySelectorAll(".input_product");
    inputs.forEach((input) => {
      if (input.value === "") {
        input.classList.add("active-input-error");
      } else {
        input.classList.remove("active-input-error");
      }
    });

    const isValid =
      !priceInput.classList.contains("active-input-error") &&
      !divPreview.classList.contains("active-previewBlock-error") &&
      isValidImg &&
      Boolean(data.category) &&
      Boolean(data.brand) &&
      Boolean(data.for) &&
      Boolean(data.size) &&
      Boolean(data.color);
    if (isValid) {
      correctionData(data);
      const reader = new FileReader();
      reader.onload = (e) => {
        data.img = e.target.result;
        addNewProduct(data);
      };
      reader.readAsDataURL(img);
      divPreview.innerHTML = "";
      newProductForm.reset();
    }
  }
  if (
    e.target.classList.contains("contentError__button") ||
    e.target.classList.contains("newProductForm__windowError")
  ) {
    errorWindow.classList.remove("active-error-window");
  }
  if (e.target.classList.contains("searchProduct__redact")) {
    const id = document.querySelector(".redact__id");
    const img = document.querySelector(".redact__img");
    const category = document.querySelector(".redact__category");
    const brand = document.querySelector(".redact__brand");
    const color = document.querySelector(".redact__color");
    const size = document.querySelector(".redact__size");
    const gender = document.querySelector(".redact__for");
    const price = document.querySelector(".redact__price");

    const productId = e.target.id;
    id.value = e.target.id;
    getProducts().then((products) => {
      const currentProduct = products.filter(
        (product) => product._id === productId
      )[0];
      addProductBtn.classList.remove("active-account-btn");
      managmentBlock.classList.remove("active-managment");
      redactProductForm.classList.add("active-redactProductForm");
      const imgSource =
        currentProduct.img.length > 50
          ? currentProduct.img
          : `./img/${currentProduct.img}`;
      img.innerHTML = `<img class="product_img" src="${imgSource}" />`;
      category.value = currentProduct.category;
      brand.value = currentProduct.brand;
      size.value = currentProduct.size;
      color.value = currentProduct.color;
      gender.value = currentProduct.for;
      price.value = currentProduct.price;
    });
  }
  if (e.target.classList.contains("newProductForm__setForm")) {
    const id = document.querySelector(".redact__id");
    e.preventDefault();
    const formData = new FormData(redactProductForm);
    const entries = formData.entries();
    const data = Object.fromEntries(entries);

    getProducts().then((products) => {
      const currentProduct = products.filter(
        (product) => product._id === id.value
      )[0];

      const isChanged = !(
        data.id === currentProduct._id &&
        data.category === currentProduct.category &&
        data.brand === currentProduct.brand &&
        data.color === currentProduct.color &&
        data.size === currentProduct.size &&
        data.price === currentProduct.price &&
        data.for === currentProduct.for &&
        data.img.name === ""
      );
      if (isChanged) {
        const isValidImg = data.img && data.img.size <= 70729 ? true : false;
        if (!isValidImg) {
          errorWindow.classList.add("active-error-window");
        } else {
          errorWindow.classList.remove("active-error-window");

          const reader = new FileReader();
          reader.onload = (e) => {
            if (data.img.name === "") {
              const tagImg = document.getElementById(
                `${currentProduct._id}-img`
              );
              data.img = tagImg.src;
            } else {
              data.img = e.target.result;
            }
            correctionData(data);
            setProduct(data);
            redactProductForm.reset();
            redactPreview.innerHTML = "";
          };
          reader.readAsDataURL(data.img);
        }
      }
    });
  }
});
