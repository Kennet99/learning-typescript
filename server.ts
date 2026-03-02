import express from "express";
import ViteExpress from "vite-express";
import path from "path";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// app.get("src/product-page", (_req, _res, next) => {
//   next();
// });

// app.get("/product-page", (_req, _res, next) => {
//   next();
// });

app.get("/product-page.html", (_req, res) => {
  res.redirect("/src/product-page.html");
});

// app.get("/product-page", (_req, res) => {
//   res.sendFile(path.resolve(__dirname, "src", "product-page.html"));
// });

ViteExpress.listen(app, PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
