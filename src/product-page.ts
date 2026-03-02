import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";

async function fetchProductById(productId: string): Promise<void> {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await response.json();
    const { reviews } = product;

    console.log("Title:", product.title);
    console.log("Reviews:", reviews);

    const productDetailContainer = document.getElementById("product-detail");
    const thumbnailElement = document.getElementById(
      "product-thumbnail",
    ) as HTMLImageElement;
    const titleElement = document.getElementById(
      "product-title",
    ) as HTMLHeadingElement;
    const priceElement = document.getElementById(
      "product-price",
    ) as HTMLParagraphElement;
    const descriptionElement = document.getElementById(
      "product-description",
    ) as HTMLParagraphElement;
    const shippingElement = document.getElementById(
      "product-shipping",
    ) as HTMLParagraphElement;

    productDetailContainer?.append(
      thumbnailElement,
      titleElement,
      priceElement,
      descriptionElement,
      shippingElement,
    );

    if (thumbnailElement) {
      thumbnailElement.src = product.thumbnail;
      thumbnailElement.alt = product.title;
    }
    if (titleElement) {
      titleElement.textContent = product.title;
    }
    if (priceElement) {
      priceElement.textContent = `Price: $${product.price}`;
    }
    if (descriptionElement) {
      descriptionElement.textContent = product.description;
    }
    if (shippingElement) {
      shippingElement.textContent = `Shipping: ${product.shippingInformation}`;
    }

    // Display review with map method
    /*reviews.map((review: Record<string, any>) => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "card mb-3 p-3";
      reviewElement.textContent = `${review.reviewerName} (${review.rating} stars): "${review.comment}"`;
      productDetailContainer?.appendChild(reviewElement);
    });*/

    reviews.forEach((review: Record<string, any>) => {
      // const reviewElement = document.createElement("div");
      const listItem = document.createElement("li");
      const reviewsList = document.getElementById("reviews-list");
      listItem.className = "list-group-item";
      listItem.textContent = `${review.reviewerName} (${review.rating} stars): "${review.comment}"`;
      // productDetailContainer?.appendChild(reviewElement);
      reviewsList?.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Take in the params of the URL from the query string and fetch the product details based on the ID
const urlParams = new URLSearchParams(window.location.search);
console.log("URL Parameters:", urlParams.toString());
console.log("Window location:", window.location.search);
const id = urlParams.get("id");

if (id) {
  fetchProductById(id);
} else {
  console.error("No product ID found in URL");
}

// Single product JSON payload example:
/*{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
  "category": "beauty",
  "price": 9.99,
  "discountPercentage": 7.17,
  "rating": 4.94,
  "stock": 5,
  "tags": [
    "beauty",
    "mascara"
  ],
  "brand": "Essence",
  "sku": "RCH45Q1A",
  "weight": 2,
  "dimensions": {
    "width": 23.17,
    "height": 14.43,
    "depth": 28.01
  },
  "warrantyInformation": "1 month warranty",
  "shippingInformation": "Ships in 1 month",
  "availabilityStatus": "Low Stock",
  "reviews": [
    {
      "rating": 2,
      "comment": "Very unhappy with my purchase!",
      "date": "2024-05-23T08:56:21.618Z",
      "reviewerName": "John Doe",
      "reviewerEmail": "john.doe@x.dummyjson.com"
    },
    {
      "rating": 2,
      "comment": "Not as described!",
      "date": "2024-05-23T08:56:21.618Z",
      "reviewerName": "Nolan Gonzalez",
      "reviewerEmail": "nolan.gonzalez@x.dummyjson.com"
    },
    {
      "rating": 5,
      "comment": "Very satisfied!",
      "date": "2024-05-23T08:56:21.618Z",
      "reviewerName": "Scarlett Wright",
      "reviewerEmail": "scarlett.wright@x.dummyjson.com"
    }
  ],
  "returnPolicy": "30 days return policy",
  "minimumOrderQuantity": 24,
  "meta": {
    "createdAt": "2024-05-23T08:56:21.618Z",
    "updatedAt": "2024-05-23T08:56:21.618Z",
    "barcode": "9164035109868",
    "qrCode": "..."
  },
  "thumbnail": "...",
  "images": ["...", "...", "..."]
}*/
