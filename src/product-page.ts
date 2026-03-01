import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";

async function fetchProductById(productId: string): Promise<void> {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await response.json();
    const { title, price, shippingInformation } = product;
    console.log("Product Details:");
    console.log("Title:", title);
    console.log("Price:", price);
    console.log("Shipping Information:", shippingInformation);

    const container = document.getElementById("gallery");
    if (container) {
      container.innerHTML = `
        <h1>${title}</h1>
        <p>Price: ${price}</p>
        <p>Shipping: ${shippingInformation}</p>
      `;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (id) {
  fetchProductById(id);
} else {
  console.error("No product ID found in URL");
}
