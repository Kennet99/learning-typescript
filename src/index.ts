// Dynamically generate the Product interface keys
let dynamicKeys: string[] = [];

const apiURL = "https://dummyjson.com/products";

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

async function fetchProductsByCategory(category: string) {
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

async function createCategoryOptions() {
  const categories = await fetchProductCategories();
  console.log("Categories for Dropdown:", categories);
  const dropdown = document.getElementById(
    "product-categories",
  ) as HTMLSelectElement;
  categories.forEach((category: Record<string, string>) => {
    const option = document.createElement("option");
    option.value = category.slug;
    option.textContent = category.name;
    dropdown.appendChild(option);
  });
}

async function fetchProducts() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    const { products } = data;

    const hasResults = data.products && data.products.length > 0;
    toggleEmptyState(hasResults);

    console.log(data);

    // const allKeys = new Set<string>();
    // products.forEach((product: any) => {
    //   Object.keys(product).forEach((key) => allKeys.add(key));
    // });
    // dynamicKeys = [...allKeys];
    // console.log("Dynamic Keys:", dynamicKeys);

    const productKeys = Object.keys(data.products[0]);
    // console.log(productKeys);

    const product = data.products[0];
    type ProductKeys = keyof typeof product;
    console.log("Product Keys:", productKeys);

    type Product = {
      [key in keyof typeof product]: (typeof product)[key];
    };

    const dropdown = document.getElementById(
      "product-categories",
    ) as HTMLSelectElement;
    const selectedCategory = dropdown.value;
    console.log("Selected Category:", selectedCategory);

    dropdown.addEventListener("change", async () => {
      const selectedCategory = dropdown.value;
      console.log("Selected Category:", selectedCategory);
      if (selectedCategory) {
        const categoryProducts = await fetchProductsByCategory(dropdown.value);
        showProducts(categoryProducts);
        console.log("Selected category products:", categoryProducts);
      }
    });

    const showProducts = (products: Product[]) => {
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      products.forEach((product) => {
        const galleryItem = document.createElement("gallery-item");
        const divider = document.createElement("div");
        divider.className = "divider";
        const nameElement = document.createElement("h2");
        nameElement.className = "name";
        nameElement.textContent = product.title;
        galleryItem?.appendChild(nameElement);
        gallery?.appendChild(galleryItem);
      });
    };
    showProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    toggleEmptyState(false);
  }
}

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
