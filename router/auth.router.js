import express from "express"
import { authLogin, authLogout, authRegister, deleteUser, getOneUser, getUsers, Order, removeFromOrderList, updateAuth } from "../controller/auth.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"

const authRouter = express.Router()


authRouter.post("/register",authRegister)
authRouter.post("/login",authLogin)
authRouter.post("/logout",authLogout)
authRouter.put("/updateAuth/:id",updateAuth)
authRouter.delete("/deleteAuth/:id",deleteUser)
authRouter.get("/getAllUser",authMiddleware,getUsers)
authRouter.get("/getAUser/:id",getOneUser)
authRouter.put("/order",authMiddleware,Order)
authRouter.put("/removeOrder",authMiddleware,removeFromOrderList)

export default authRouter