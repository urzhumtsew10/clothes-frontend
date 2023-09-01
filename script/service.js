// output products

const blockProducts = document.querySelector(".product__container");

const getProducts = async () => {
  const products = await fetch(
    "https://clothes-shop-hpfxb7z2w-urzhumtsew10.vercel.app/service",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await products.json();
};

getProducts().then((products) => {
  for (let i = 0; i < 30; i++) {
    blockProducts.insertAdjacentHTML(
      "beforeend",
      `<div class="product__card card">
             <img id="${products[i]._id}" class="card__img card" src="./img/${products[i].img}"/>
             <div class="card__params">
               <h3 id="${products[i]._id}" class="params__title card">${products[i].category} ${products[i].brand}</h3>
               <div class="params__cost flex">
                 <p class="cost__price card">${products[i].price}<span class="price__span">$</span></p>
                 <button class="cost__btn">Buy</button>
               </div>
             </div>
        </div>`
    );
  }
});

/// filter

const filterSeasonalBtn = document.querySelectorAll(".seasonal-block");
const filterBlock = document.querySelector(".product__blockFilter");
const filterCategoryBtn = document.querySelectorAll(".category__item");

const inputBrand = document.querySelectorAll("[data-category='brand']");
const inputFor = document.querySelectorAll("[data-category='for']");
const inputSize = document.querySelectorAll("[data-category='size']");

filterSeasonalBtn.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    const blockProductsCoordinates =
      blockProducts.getBoundingClientRect().top + pageYOffset - 50;
    window.scrollTo({
      top: blockProductsCoordinates,
      behavior: "smooth",
    });
  });
});

const sendFilterData = async (data) => {
  const products = await fetch(
    "https://clothes-shop-hpfxb7z2w-urzhumtsew10.vercel.app/sort",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await products.json();
};

filterBlock.addEventListener("click", (e) => {
  const filter = {
    category: "All",
    brand: [],
    size: [],
    for: [],
  };

  if (e.target.nodeName === "BUTTON") {
    filterCategoryBtn.forEach((btn) => {
      btn.classList.remove("active-category");
    });
    e.target.classList.add("active-category");
  }
  const loadingBlock = document.querySelectorAll(".loadingBlock");
  if (e.target.nodeName === "INPUT" || e.target.nodeName === "BUTTON") {
    loadingBlock.forEach((loading) => {
      loading.classList.add("active-loading");
    });
    filterCategoryBtn.forEach((btn) => {
      if (btn.classList.contains("active-category")) {
        filter.category = btn.innerText;
      }
    });

    inputBrand.forEach((input) => {
      if (input.checked) {
        filter.brand.push(input.value);
      }
    });

    inputFor.forEach((input) => {
      if (input.checked) {
        filter.for.push(input.value);
      }
    });

    inputSize.forEach((input) => {
      if (input.checked) {
        filter.size.push(input.value);
      }
    });

    sendFilterData(filter).then((products) => {
      loadingBlock.forEach((loading) => {
        loading.classList.remove("active-loading");
      });

      blockProducts.innerHTML = "";

      products.forEach((product) => {
        blockProducts.insertAdjacentHTML(
          "beforeend",
          `<div class="product__card card">
             <img id="${product._id}" class="card__img card" src="./img/${product.img}" alt="tshirt" />
             <div class="card__params">
               <h3 id="${product._id}" class="params__title card">${product.category} ${product.brand}</h3>
               <div class="params__cost flex">
                 <p class="cost__price card">${product.price}<span class="price__span">$</span></p>
                 <button class="cost__btn">Buy</button>
               </div>
             </div>
        </div>`
        );
      });
    });
  }
});

// view-product

const contentPage = document.querySelector(".content_page");
const aboutProductBlock = document.querySelector(".aboutProduct");
const arrowBack = document.querySelector(".aboutProduct__arrow");

const aboutProductImg = document.querySelector(".imgProduct");
const aboutProductTitle = document.querySelector(
  ".description__categoryProduct"
);
const aboutProductBrand = document.querySelector(".brand");
const aboutProductColor = document.querySelector(".color");
const aboutProductSize = document.querySelector(".size");
const aboutProductPrice = document.querySelector(".price");

blockProducts.addEventListener("click", (e) => {
  if (e.target.nodeName === "IMG" || e.target.nodeName === "H2") {
    const productId = e.target.id;
    getProducts().then((products) => {
      const currentCard = products.filter(
        (product) => product._id === productId
      )[0];

      contentPage.style.display = "none";

      aboutProductImg.src = `./img/${currentCard.img}`;
      aboutProductTitle.innerText = `${currentCard.for}'s ${currentCard.category}`;
      aboutProductBrand.innerText = `${currentCard.brand}`;
      aboutProductColor.innerText = `${currentCard.color}`;
      aboutProductSize.innerText = `${currentCard.size}`;
      aboutProductPrice.innerText = `${currentCard.price}`;

      aboutProductBlock.style.display = "flex";

      window.scrollTo({
        top: 0,
      });

      arrowBack.addEventListener("click", () => {
        aboutProductBlock.style.display = "none";
        contentPage.style.display = "block";

        window.scrollTo({
          top: e.target.getBoundingClientRect().top + pageYOffset - 50,
        });
      });
    });
  }
});

// adeptive filter

const filterArrow = document.querySelectorAll(".blockFilter__img");
const filterBlocks = document.querySelectorAll(".mobile-filter");

filterArrow.forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    filterBlocks.forEach((block) => {
      if (block.dataset.id === arrow.dataset.id) {
        block.classList.toggle("active-filter-block");
        arrow.classList.toggle("active-filter-arrow");
      } else {
        // arrow.classList.toggle("inactive-filter-arrow");
      }
    });
  });
});
