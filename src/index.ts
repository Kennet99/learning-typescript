import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const apiURL = "https://dummyjson.com/products";

// Get dynamic product keys and create a Product interface
// async function getProductKeys() {
//   const response = await fetch(apiURL);
//   const data = await response.json();

//   const productKeys = Object.keys(data.products[0]);
//   console.log(productKeys);

//   const product = data.products[0];
//   type ProductKeys = keyof typeof product;
//   console.log("Product Keys as Type:", productKeys);

//   // Define the Product interface dynamically based on the fetched keys
//   // type Product = {
//   //   [key in (typeof dynamicKeys)[number]]: any;
//   // };
//   type Product = {
//     [key in keyof typeof product]: (typeof product)[key];
//   };
// }

// getProductKeys();

// const skipCount = resultsPerPage * (currentPage - 1);
// fetch('https://dummyjson.com/products?limit=10&skip=10&select=title,price')

const previousButton = document.getElementById(
  "previous-button",
) as HTMLButtonElement;
previousButton.addEventListener("click", () => {
  currentPage--;
  fetchProducts();
});

const nextButton = document.getElementById("next-button") as HTMLButtonElement;
nextButton.addEventListener("click", () => {
  currentPage++;
  fetchProducts();
});

async function fetchProductCategories(): Promise<
  undefined | Record<string, any>[]
> {
  try {
    const response = await fetch(`${apiURL}/categories`);
    const categories = await response.json();
    console.log("Product Categories:", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching product categories:", error);
  }
}

const renderProducts = (products: Record<string, any>[]) => {
  const gallery: HTMLElement | null = document.querySelector(".gallery");
  if (!gallery) return;
  gallery.innerHTML = "";

  products.forEach((product: Record<string, any>) => {
    const {
      brand,
      description,
      price,
      shippingInformation,
      stock,
      thumbnail,
      tags,
      title,
    } = product;

    const card = document.createElement("div");
    card.className = "card h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const img = document.createElement("img");
    img.className = "card-img";
    img.src = thumbnail;
    img.alt = title;
    img.width = 200;
    img.height = 200;

    const titleElement = document.createElement("h5");
    titleElement.className = "name";
    titleElement.textContent = title;

    const priceElement = document.createElement("p");
    priceElement.className = "card-text";
    priceElement.textContent = `$${price}`;
    priceElement.style.fontWeight = "bold";

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "card-text";
    descriptionElement.textContent = description;
    descriptionElement.style.color = "#424242";

    const shippingElement = document.createElement("p");
    shippingElement.className = "card-text";
    shippingElement.textContent = `${shippingInformation}`;

    const tagsWrapper = document.createElement("div");
    tagsWrapper.className = "d-flex gap-1 flex-wrap mb-3";
    tags?.forEach((tag: string) => {
      const badge = document.createElement("span");
      badge.className = "badge bg-secondary";
      badge.textContent = tag;
      tagsWrapper.appendChild(badge);
    });

    cardBody.appendChild(tagsWrapper);
    cardBody.appendChild(titleElement);
    cardBody.appendChild(priceElement);
    cardBody.appendChild(descriptionElement);
    cardBody.appendChild(shippingElement);
    card.appendChild(img);
    card.appendChild(cardBody);
    gallery.appendChild(card);
    // gallery?.appendChild(col);

    // Old approach with just labels
    // const galleryItem = document.createElement("gallery-item");
    // const divider = document.createElement("div");
    // divider.className = "divider";
    // const nameElement = document.createElement("h2");
    // nameElement.className = "name";
    // nameElement.textContent = product.title;
    // galleryItem?.appendChild(nameElement);
    // gallery?.appendChild(galleryItem);
  });
};

async function createCategoryOptions() {
  const categories: Record<string, any>[] = await fetchProductCategories();
  console.log("Categories for Dropdown:", categories);
  const dropdown = document.getElementById(
    "product-categories",
  ) as HTMLSelectElement;

  // Need to initialise a default category (all categories) to show all products on initial load
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Categories";
  dropdown.appendChild(defaultOption);

  categories.forEach((category: Record<string, any>) => {
    const option = document.createElement("option");
    option.value = category.slug;
    option.textContent = category.name;
    dropdown.appendChild(option);
  });
}

let currentPage = 1;

async function fetchProducts() {
  const resultsPerPage = 20;
  const skipCount = (currentPage - 1) * resultsPerPage;
  previousButton.disabled = currentPage === 1;

  const categoryDropdown = document.getElementById(
    "product-categories",
  ) as HTMLSelectElement;
  const selectedCategory = categoryDropdown.value;

  const url = selectedCategory
    ? `${apiURL}/category/${selectedCategory}?limit=${resultsPerPage}&skip=${skipCount}`
    : `${apiURL}?limit=${resultsPerPage}&skip=${skipCount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const { products } = data;

    console.log("Fetched Products Data:", Object.entries(data));
    console.log(data);

    const hasResults = products && products.length > 0;
    toggleEmptyState(hasResults);

    nextButton.disabled = products.length < resultsPerPage;
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

async function searchProducts(query: string) {
  try {
    const response = await fetch(`${apiURL}/search?q=${query}`);
    const data = await response.json();
    const { products } = data;

    const hasResults = products && products.length > 0;
    toggleEmptyState(hasResults);

    if (hasResults) {
      renderProducts(products);
    }
  } catch (error) {
    console.error("Error searching for products:", error);
    toggleEmptyState(false);
  }
}

const searchInput = document.getElementById("search-input") as HTMLInputElement;
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchProducts(query);
  } else {
    fetchProducts();
  }
});

const categoryDropdown = document.getElementById(
  "product-categories",
) as HTMLSelectElement;
categoryDropdown.addEventListener("change", () => {
  currentPage = 1;
  fetchProducts();
});

function toggleEmptyState(hasResults: boolean) {
  const emptyState = document.createElement("p");
  emptyState.id = "empty-state";
  emptyState.textContent = "No products found.";
  emptyState.style.display = "none";
  document.body.appendChild(emptyState);
  emptyState.style.display = hasResults ? "none" : "block";
  return hasResults;
}

fetchProducts();
fetchProductCategories();
createCategoryOptions();
