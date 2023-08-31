import { blockProducts } from "./service.js";

const arrowBack = document.querySelector(".aboutProduct__arrow");

arrowBack.addEventListener("click", () => {
  history.back();
});

console.log(blockProducts);
