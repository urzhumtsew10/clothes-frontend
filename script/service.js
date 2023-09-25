// output products

// check token

const checkUserToken = () => {
  const iconLog = document.querySelector(".header__log");
  const iconAccount = document.querySelector(".header__account");

  const isToken = localStorage.getItem("token");
  if (isToken === null) {
    iconLog.classList.add("active-icon");
  } else {
    iconAccount.classList.add("active-icon");
  }
};

checkUserToken();

const blockProducts = document.querySelector(".product__container");

const getProducts = async () => {
  const products = await fetch("https://clothes-api-eta.vercel.app/service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await products.json();
};

getProducts().then((products) => {
  for (let i = 0; i < 30; i++) {
    blockProducts.insertAdjacentHTML(
      "beforeend",
      `<div class="product__card card">
             <img id="${products[i]._id}" class="card__img card" src="./img/${products[i].img}"/>
             <div class="card__params">
               <h2 id="${products[i]._id}" class="params__title card">${products[i].category} ${products[i].brand}</h2>
               <div class="params__cost flex">
                 <p class="cost__price card">${products[i].price}<span class="price__span">$</span></p>
                 <button id="${products[i]._id}" class="cost__btn">Buy</button>
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

const sendFilterData = async (data, nameFilter) => {
  const products = await fetch(
    `https://clothes-api-eta.vercel.app/${nameFilter}`,
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

filterSeasonalBtn.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    const blockProductsCoordinates =
      blockProducts.getBoundingClientRect().top + pageYOffset - 50;
    window.scrollTo({
      top: blockProductsCoordinates,
      behavior: "smooth",
    });
    let seasonalFilter;
    switch (e.target.id) {
      case "summer":
        seasonalFilter = ["T-shirt", "Short"];
        break;
      case "winter":
        seasonalFilter = ["Sweater", "Trousers"];
        break;
      case "headdress":
        seasonalFilter = ["Cap", "Hat"];
        break;
      case "shoes":
        seasonalFilter = ["Flip flops", "Sneakers"];
        break;
    }
    sendFilterData(seasonalFilter, "sort").then((products) => {
      blockProducts.innerHTML = "";

      products.forEach((product) => {
        blockProducts.insertAdjacentHTML(
          "beforeend",
          `<div class="product__card card">
             <img id="${product._id}" class="card__img card" src="./img/${product.img}" alt="tshirt" />
             <div class="card__params">
               <h2 id="${product._id}" class="params__title card">${product.category} ${product.brand}</h2>
               <div class="params__cost flex">
                 <p class="cost__price card">${product.price}<span class="price__span">$</span></p>
                 <button id="${product._id}" class="cost__btn">Buy</button>
               </div>
             </div>
        </div>`
        );
      });
    });
  });
});

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

    sendFilterData(filter, "sort").then((products) => {
      loadingBlock.forEach((loading) => {
        loading.classList.remove("active-loading");
      });

      blockProducts.innerHTML = "";

      products.forEach((product) => {
        const imgSource =
          product.img.length > 50 ? product.img : `./img/${product.img}`;
        blockProducts.insertAdjacentHTML(
          "beforeend",
          `<div class="product__card card">
             <img id="${product._id}" class="card__img card" src="${imgSource}" alt="tshirt" />
             <div class="card__params">
               <h2 id="${product._id}" class="params__title card">${product.category} ${product.brand}</h2>
               <div class="params__cost flex">
                 <p class="cost__price card">${product.price}<span class="price__span">$</span></p>
                 <button id="${product._id}" class="cost__btn">Buy</button>
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

      const imgSource =
        currentCard.img.length > 50
          ? currentCard.img
          : `./img/${currentCard.img}`;

      aboutProductImg.src = imgSource;
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

// add product to cart

const addToStorageCart = (value) => {
  const productsArray = JSON.parse(localStorage.getItem("cartProducts"));
  const hasProduct = productsArray.filter(
    (product) => product._id === value._id
  )[0];
  if (hasProduct) {
    hasProduct.count += 1;
  } else {
    productsArray.push({ ...value, count: 1 });
  }
  localStorage.setItem("cartProducts", JSON.stringify(productsArray));
};

blockProducts.addEventListener("click", (e) => {
  if (e.target.classList.contains("cost__btn")) {
    const productId = e.target.id;

    getProducts().then((products) => {
      const currentProduct = products.filter(
        (product) => product._id === productId
      )[0];
      addToStorageCart(currentProduct);
      calculateQuantityProducts();
    });
  }
});
