import express from "express"
import { isAdmin, requredSignIn } from "../middlewares/authMiddleware.js";
import { getAllOrders, getOrders, orderStatus } from "../controllers/productController.js";
const orderRoutes = express.Router();

//ROUTES

//GET ORDERS ROUTE
orderRoutes.get("/orders", getOrders)

//GET ALL ORDERS
orderRoutes.get("/all-orders", getAllOrders)

//ORDER STATUS UPDATE
orderRoutes.put("/order-status/:orderId", orderStatus)

export default orderRoutes