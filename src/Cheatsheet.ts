// Declare event listeners

// Event listener for search input - triggers on every input change
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  query;
  if (query) {
    searchProducts(query);
  } else {
    fetchProducts();
  }
});

// Inline approach for search input event listener with ternary operator
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    query ? searchProducts(query) : fetchProducts();
  }
});

// Alternative approach with a separate handler function with ternary operator
const handleSearch = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    query ? searchProducts(query) : fetchProducts();
  }
};
searchInput.addEventListener("keydown", handleSearch);

// Category dropdown with event listener for selection
categoryDropdown.addEventListener("change", () => {
  currentPage = 1;
  fetchProducts();
});


// Interpolated string approach with price & shipping info examples:

// Inner HTML approach:
const priceElement = document.createElement("p");
priceElement.className = "card-text mb-2";
priceElement.innerHTML = `<span class="fw-bold">$${price}</span> • <span class="text-secondary fw-normal">${shippingInformation}</span>`;

// Alternative approach with separate spans for price and shipping info:
const priceElement = document.createElement("p");
priceElement.className = "card-text mb-2";

const priceSpan = document.createElement("span");
priceSpan.className = "fw-bold";
priceSpan.textContent = `$${price} •`;

const shippingSpan = document.createElement("span");
shippingSpan.className = "text-secondary fw-normal";
shippingSpan.textContent = ` ${shippingInformation}`;

priceElement.appendChild(priceSpan);
priceElement.appendChild(shippingSpan);

// === CSS Flexbox Shorthand ===
.card {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 300px;
}

is equivalent to:
.card {
  flex: 1 1 300px;
}

The shorthand order is always: flex: [grow] [shrink] [basis]

// === ===
