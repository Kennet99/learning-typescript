// Old approach to search and filter with separate functions:
async function searchForProducts(query: string) {
  try {
    const response = await fetch(`${apiURL}/search?q=${query}`);
    const data = await response.json();
    console.log("Search Results:", data);
    const products = data.products;
    const hasResults = products && products.length > 0;
    toggleEmptyState(hasResults);
    showProducts(products);
  } catch (error) {
    console.error("Error searching for products:", error);
    toggleEmptyState(false);
  }
}

// Alternative approach with dynamic URL construction:
function getSelectedFilter(): string | null {
  const dropdown = document.getElementById(
    "product-categories",
  ) as HTMLSelectElement;
  return dropdown.value || null;
}

async function fetchProducts(query: string = "") {
  const resultsPerPage = 20;
  const skipCount = (currentPage - 1) * resultsPerPage;

  previousButton.disabled = currentPage === 1;
  // nextButton.disabled = products.length < resultsPerPage;

  let url = `${apiURL}`;
  const selectedFilter = getSelectedFilter();

  if (selectedFilter && query) {
    url = `${apiURL}/category/${selectedFilter}/search?q="$query"&limit=${resultsPerPage}&skip=${skipCount}`;
  } else if (selectedFilter) {
    url = `${apiURL}/category/${selectedFilter}?limit=${resultsPerPage}&skip=${skipCount}`;
  } else if (query) {
    url = `${apiURL}/search?q=${query}`;
  } else {
    url = `${apiURL}?limit=${resultsPerPage}&skip=${skipCount}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const { products } = data;

    const hasResults = data.products && data.products.length > 0;
    toggleEmptyState(hasResults);

    if (hasResults) {
      showProducts(products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

const searchInput = document.getElementById("search-input") as HTMLInputElement;
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  fetchProducts(query);
});

const dropdown = document.getElementById(
  "product-categories",
) as HTMLSelectElement;
dropdown.addEventListener("change", () => {
  const query = searchInput.value.trim();
  fetchProducts(query);
});

// Old approach with separate category filtering and search:
const renderProducts = (products: Record<string, any>[]) => {
  const gallery: HTMLElement | null = document.querySelector(".gallery");
  if (!gallery) return;
  gallery.innerHTML = "";

  products.forEach((product: Record<string, any>) => {
    const card = document.createElement("div");
    card.className = "card h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const img = document.createElement("img");
    img.className = "card-img";
    img.src = product.thumbnail;
    img.alt = product.title;
    img.width = 200;
    img.height = 200;

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = product.title;

    const price = document.createElement("p");
    price.className = "card-text";
    price.textContent = `$${product.price}`;

    cardBody.appendChild(title);
    cardBody.appendChild(price);
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

// Old approach for category dropdown filtering:
const categoryDropdown = document.getElementById(
  "product-categories",
) as HTMLSelectElement;
const selectedCategory = categoryDropdown.value;
console.log("Selected Category:", selectedCategory);

categoryDropdown.addEventListener("change", async () => {
  currentPage = 1;
  const selectedCategory = categoryDropdown.value;
  console.log("Selected Category:", selectedCategory);
  if (selectedCategory) {
    const categoryProducts = await fetchProductsByCategory(selectedCategory);
    renderProducts(categoryProducts);
    console.log("Selected category products:", categoryProducts);
  }
});

// Old approach to fetch products - event listener inside the function but would cause a new event to fire every time products are fetched, which is not ideal:
async function fetchProducts() {
  const resultsPerPage = 20;
  const skipCount = (currentPage - 1) * resultsPerPage;

  previousButton.disabled = currentPage === 1;
  // nextButton.disabled = products.length < resultsPerPage;

  try {
    const response = await fetch(
      `${apiURL}?limit=${resultsPerPage}&skip=${skipCount}`,
    );
    const data = await response.json();
    const { products } = data;

    const hasResults = data.products && data.products.length > 0;
    toggleEmptyState(hasResults);

    console.dir("Fetched Products Data:", data);
    console.log(data);
    console.dir(data);
    console.log(Object.entries(data));

    // const allKeys = new Set<string>();
    // products.forEach((product: any) => {
    //   Object.keys(product).forEach((key) => allKeys.add(key));
    // });
    // dynamicKeys = [...allKeys];
    // console.log("Dynamic Keys:", dynamicKeys);

    const product = data.products[0];
    type ProductKeys = keyof typeof product;

    type Product = {
      [key in keyof typeof product]: (typeof product)[key];
    };

    const productKeys = Object.keys(data.products[0]);
    console.log("Product Keys:", productKeys);

    const categoryDropdown = document.getElementById(
      "product-categories",
    ) as HTMLSelectElement;
    const selectedCategory = categoryDropdown.value;
    console.log("Selected Category:", selectedCategory);

    categoryDropdown.addEventListener("change", async () => {
      currentPage = 1;
      const selectedCategory = categoryDropdown.value;
      console.log("Selected Category:", selectedCategory);
      if (selectedCategory) {
        const categoryProducts =
          await fetchProductsByCategory(selectedCategory);
        renderProducts(categoryProducts);
        console.log("Selected category products:", categoryProducts);
      }
    });

    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    toggleEmptyState(false);
  }
}

// This is no longer needed now as we refactored to use a single fetchProducts function that handles both category filtering and search, but keeping it here for reference:
async function fetchProductsByCategory(category?: string) {
  try {
    const response = await fetch(`${apiURL}/category/${category}`);
    const products = await response.json();
    console.log(`Products in category "${category}":`, products);
    return products.products;
  } catch (error) {
    console.error(`Error fetching products for category "${category}":`, error);
    return [];
  }
}
