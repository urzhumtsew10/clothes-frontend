// index.html

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
