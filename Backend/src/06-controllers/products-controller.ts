import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../02-middleware/verify-admin";
import verifyLoggedIn from "../02-middleware/verify-logged-in";
import { ProductModel } from "../03-models/product-model";
import productsLogic from "../05-logic/products-logic";
import { sendEmailWithAttachment } from "../05-logic/send-email";
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { to, attachmentPath } = req.body;
  try {
    await sendEmailWithAttachment(to, attachmentPath);
    res.send({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//http://localhost:3001/api/categories/
router.get(
  "/categories",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories = await productsLogic.getAllCategories();
      response.json(categories);
    } catch (err: any) {
      next(err);
    }
  }
);

//http://localhost:3001/api/products/
router.get(
  "/products",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const products = await productsLogic.getAllProducts();
      response.json(products);
    } catch (err: any) {
      next(err);
    }
  }
);

// Count:  non-users have access to this information.
//http://localhost:3001/api/products-count/
router.get(
  "/products-count",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      //product וכך ערכו של משתנה זה יהיה מספר האובייקטים אשר נמצאים בתוך קולקשיין ה .countProducts() יוצר משתנה ומחיל עליו את פונ' ה
      const count = await productsLogic.countProducts();
      response.json(count);
    } catch (err: any) {
      next(err);
    }
  }
);

//http://localhost:3001/api/products/234343232432
// נותן לנו אובייקט לפי איידי שאנו מכניסים
router.get(
  "/products/:_id",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const _id = request.params._id;
      const product = await productsLogic.getOneProduct(_id);
      response.json(product);
    } catch (err: any) {
      next(err);
    }
  }
);

//http://localhost:3001/api/products/
// כך אנו מוסיפים מוצר לדאטה בייס
router.post(
  "/products",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body.image = request.files?.image;
      const product = request.body;
      console.log("product: ", product);
      const addedProduct = await productsLogic.addProduct(product);
      response.status(201).json(addedProduct);
    } catch (err: any) {
      next(err);
    }
  }
);

//http://localhost:3001/api/products/62969ee1c05d55310aba99b2
// כך אנו מעדכנים מוצר קיים, אנו מכניסים את האיידי של המוצר שאותו אנו רוצים לעדכן
router.put(
  "/products/:_id",
  verifyAdmin,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      // כאן אנו מכניסים את קובץ התמונה החדשה לבקשה
      request.body.image = request.files?.image;
      const _id = request.params._id;
      // כאן אנו מכניסים את האיידי של האובייקט הקיים לבקשה
      request.body._id = _id;
      // כאן אנו מכניסים את כל הבקשה כולל ההוספות למשתנה
      const product = new ProductModel(request.body);
      // כך אנו מעדכנים את האובייקט הקיים בחדש ומכניסים את האובייקט החדש לתוך המשתנה
      const updatedProduct = await productsLogic.updateProduct(product);
      // ומחזירים אותו כג'ייסון
      response.json(updatedProduct);
    } catch (err: any) {
      next(err);
    }
  }
);

router.post(
  "/productsdelete",
  verifyAdmin,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("vvv");

      const product = await new ProductModel(request.body);
      console.log("product in the server: ", product);
      console.log("product.name in the server: ", product.name);

      const deletedProduct = await productsLogic.deleteProduct(product.name);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
