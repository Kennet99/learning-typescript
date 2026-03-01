import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const apiURL = "https://dummyjson.com/products";

// const skipCount = resultsPerPage * (currentPage - 1);
// fetch('https://dummyjson.com/products?limit=10&skip=10&select=title,price')

// Initialise DOM elements
const searchInput = document.getElementById("search-input") as HTMLInputElement;
searchInput.style.minWidth = "400px";

const categoryDropdown = document.getElementById(
  "product-categories",
) as HTMLSelectElement;
categoryDropdown.style.minWidth = "300px";
categoryDropdown.style.maxWidth = "400px";
// categoryDropdown.className = "w-25";

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

// Declare event listeners
// Inline approach for search input event listener
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    query ? searchProducts(query) : fetchProducts();
    // return query;
  }
});

// Category dropdown with event listener for selection
categoryDropdown.addEventListener("change", () => {
  currentPage = 1;
  fetchProducts();
});

const resultsLabel = document.getElementById(
  "results-label",
) as HTMLParagraphElement;
const emptyState = document.getElementById(
  "empty-state",
) as HTMLParagraphElement;
const gallery = document.querySelector(".gallery") as HTMLElement;

// Helper function to get product categories and populate the dropdown
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

type ProductElements = {
  brand?: string;
  description: string;
  price: number;
  shippingInformation: string;
  stock?: number;
  thumbnail: string;
  tags: string[];
  title: string;
};

// before specify: const renderProducts = (products: Record<string, any>[]) => {
const renderProducts = (products: ProductElements[]) => {
  // Removed redundant gallery check since it's already typed as HTMLElement
  // const gallery: HTMLElement | null = document.querySelector(".gallery");
  // if (!gallery) return;

  gallery.innerHTML = "";
  // gallery.className = "d-flex flex-wrap gap-4 justify-content-center";

  // Before: specify: products.forEach((product: Record<string, any>) => {
  products.forEach((product: ProductElements) => {
    // Destructure product properties to get only what we need
    const {
      brand,
      description,
      price,
      shippingInformation,
      stock,
      thumbnail,
      tags,
      title,
    }: ProductElements = product;

    const card = document.createElement("div");
    card.className = "row g-0 p-3 border rounded shadow-sm";
    card.style.minWidth = "300px";
    // card.style.width = "400px";
    card.style.maxWidth = "400px";
    card.style.flex = "0 1 360px";

    const textWrapper = document.createElement("div");
    textWrapper.className = "card-body";

    const img = document.createElement("img");
    img.className = "card-img";
    img.src = thumbnail;
    img.alt = title;
    img.style.maxWidth = "120px";
    img.style.maxHeight = "120px";

    const titleElement = document.createElement("h5");
    titleElement.className = "text-primary";
    titleElement.textContent = title;
    titleElement.style.fontWeight = "bold";

    const priceElement = document.createElement("p");
    priceElement.className = "card-text mb-2";
    // priceElement.textContent = `$${price} • ${shippingInformation}`;
    priceElement.innerHTML = `<span class="fw-bold">$${price}</span> • <span class="text-body fw-normal">${shippingInformation}</span>`;
    priceElement.style.fontWeight = "bold";

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "text-secondary mb-0";
    descriptionElement.textContent = description;

    // const shippingElement = document.createElement("p");
    // shippingElement.className = "card-text";
    // shippingElement.textContent = `${shippingInformation}`;

    const tagsWrapper = document.createElement("div");
    tagsWrapper.className = "d-flex gap-1 flex-wrap mb-3 mt-3";
    tags?.forEach((tag: string) => {
      const badge = document.createElement("span");
      badge.className = "badge bg-secondary";
      badge.textContent = tag;
      tagsWrapper.appendChild(badge);
    });

    textWrapper.appendChild(tagsWrapper);
    textWrapper.appendChild(titleElement);
    textWrapper.appendChild(priceElement);
    textWrapper.appendChild(descriptionElement);
    // textWrapper.appendChild(shippingElement);
    card.appendChild(img);
    card.appendChild(textWrapper);
    gallery.appendChild(card);
    // gallery?.appendChild(col);
  });
};

async function createCategoryOptions() {
  const categories: Record<string, any>[] = await fetchProductCategories();
  console.log("Categories for Dropdown:", categories);

  // Need to initialise a default category (all categories) to show all products on initial load
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Categories";
  categoryDropdown.appendChild(defaultOption);

  categories.forEach((category: Record<string, any>) => {
    const option = document.createElement("option");
    option.value = category.slug;
    option.textContent = category.name;
    categoryDropdown.appendChild(option);
  });
}

let currentPage = 1;

async function fetchProducts() {
  // Initialise pagination
  const resultsPerPage = 20;
  const skipCount = (currentPage - 1) * resultsPerPage;
  previousButton.disabled = currentPage === 1;

  const selectedCategory = categoryDropdown.value;

  // Dynamically construct the API URL based on whether a category is selected or not
  const url = selectedCategory
    ? `${apiURL}/category/${selectedCategory}?limit=${resultsPerPage}&skip=${skipCount}`
    : `${apiURL}?limit=${resultsPerPage}&skip=${skipCount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const { products, total } = data;

    console.log("Fetched Products Data:", Object.entries(data));
    console.log(data);
    console.log(total);

    const hasResults = products && products.length > 0;
    const productCount = total || products.length;

    resultsLabel.className = "text-body mb-3";
    resultsLabel.innerHTML = `Showing ${productCount} results for <span class="text-body fw-bold">${selectedCategory || "All Products"}</span>`;

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
    const { products, total } = data;

    console.log("Search Results Data:", Object.keys(data));
    console.log("Products", products);
    console.log("Total results:", products.length);

    const hasResults = products && products.length > 0;
    const productCount = total || products.length;
    resultsLabel.innerHTML = `Showing ${productCount} results for <span class="text-body fw-bold">"${query || "All Products"}"</span>`;
    toggleEmptyState(hasResults);

    if (hasResults) {
      renderProducts(products);
    }
  } catch (error) {
    console.error("Error searching for products:", error);
    toggleEmptyState(false);
  }
}

// Helper function to toggle empty state message when no products are found
function toggleEmptyState(hasResults: boolean) {
  emptyState.id = "empty-state";
  emptyState.textContent = "No products found.";
  emptyState.style.display = "none";
  gallery.style.display = hasResults ? "flex" : "none";
  emptyState.style.display = hasResults ? "none" : "block";
  return hasResults;
}

fetchProducts();
fetchProductCategories();
createCategoryOptions();
