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
