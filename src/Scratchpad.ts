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

// Getting the keys:

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
