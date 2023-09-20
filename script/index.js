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
  const answer = await fetch(`http://localhost:3030/delete-order`, {
    method: "POST",
    body: JSON.stringify({ orderId: orderId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
};

const findUserOrders = async (user) => {
  const answer = await fetch(`http://localhost:3030/user-orders`, {
    method: "POST",
    body: JSON.stringify({ userName: user }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
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

const iconAccount = document.querySelector(".header__account");
const windowAccount = document.querySelector(".windowAccount");
const windowContentAccount = document.querySelector(
  ".windowAccount__countentAccount"
);
const ordersBlock = document.querySelector(".contentAccount__yourOrder");
const accountTitle = document.querySelector(".contentAccount__title");
const orderArrow = document.querySelector(".yourOrder__img ");

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
  });
};

const renderProducts = (userName, id) => {
  findUserOrders(userName).then((orders) => {
    const currentOrder = orders.filter((order) => order._id === id)[0];
    currentOrder.products.forEach((product) => {
      ordersBlock.innerHTML = "";
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
  windowContentAccount.classList.add("active-content");
  windowAccount.classList.add("active-account");
  document.body.style.overflow = "hidden";

  const tokenData = parseJwt(localStorage.getItem("token"));
  const orderArrow = document.querySelector(".yourOrder__img");

  if (tokenData.role === "admin") {
    windowContentAccount.insertAdjacentHTML(
      "beforeend",
      `<button class="contentAccount__btnManage active-account-btn">Manage Products</button>
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
  if (
    e.target.classList.contains("contentAccount__imgClose") ||
    e.target.classList.contains("windowAccount")
  ) {
    windowContentAccount.classList.remove("active-content");
    windowAccount.classList.remove("active-account");
    document.body.style.overflow = "inherit";
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
    renderOrders(tokenData.name);
    orderArrow.classList.remove("active-order-arrow");

    managmentBtn.classList.add("active-account-btn");
    leaveBtn.classList.add("active-account-btn");
    addProductBtn.classList.remove("active-account-btn");
  }
  if (e.target.classList.contains("order__trash")) {
    const orderId = e.target.id;
    deleteUserOrder(orderId);
    const currentOrder = document.getElementById(`${orderId}`).parentNode;
    currentOrder.style.display = "none";
  }
  if (e.target.classList.contains("contentAccount__btnManage")) {
    ordersBlock.innerHTML = "";
    orderArrow.classList.add("active-order-arrow");
    managmentBtn.classList.remove("active-account-btn");
    leaveBtn.classList.remove("active-account-btn");
    addProductBtn.classList.add("active-account-btn");
  }
});
