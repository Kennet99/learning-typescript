// === Nested ForEach ===:

const res = await fetch(url);
const data = await res.json();
console.log(data); // just look at it. expand it in devtools.

// Example output:
// data = {
//   results: [
//     { id: 1, tags: ["a", "b"] },
//     { id: 2, tags: ["c"] }
//   ]
// }


// Nested forEach to iterate over results and their tags
data.results.forEach((result) => {
  console.log(`Result ID: ${result.id}`);
  result.tags.forEach((tag) => {
    console.log(`Tag: ${tag}`);
  });
});

data.results.forEach(item => {
  item.tags.forEach(tag => {
    console.log(item.id, tag);
  });
});

// === ARRAY DESTRUCTURING WITH ARRAY METHODS ===

const pairs = [[1, 'a'], [2, 'b'], [3, 'c']];

pairs.forEach(([num, letter]) => {
  console.log(num, letter);
});

// This is the same as:
pairs.forEach((pair) => {
  const num = pair[0];
  const letter = pair[1];
  console.log(num, letter);
});


// Returns:
// 1 'a'
// 2 'b'
// 3 'c'


const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const names = users.map(({ name }) => name);
// ['Alice', 'Bob']

users.forEach(({ id, name }) => {
  console.log(`${id}: ${name}`);
});

// === Event Listeners ===

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

// Button visibility toggle experimentation:
const toggleButton = document.createElement("fluent-button") as HTMLButtonElement;
toggleButton.textContent = "Toggle badge";
app.appendChild(toggleButton);

const badge = document.createElement("fluent-badge") as HTMLDivElement;
badge.textContent = "Badge";
badge.style.marginLeft = "10px";
badge.className = "badgeVisibility";
app.appendChild(badge);

// OPTION 1: Manipulate the display property directly - doesn't require a CSS class
toggleButton.addEventListener("click", () => {
  badge.style.display =
    badge.style.display === "none" ? "inline-block" : "none";
});

// OPTION 2: Use a CSS class to toggle visibility - requires a CSS class to work
toggleButton.addEventListener("click", () => {
  badge.classList.toggle("badgeVisibility");
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

// Different approaches to the results label with pluralization logic:
const resultWord = productCount === 1 ? "result" : "results";
const resultWord = getResultWord(productCount);