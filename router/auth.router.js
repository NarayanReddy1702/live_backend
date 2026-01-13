import express from "express"
import multer from "multer"
import { authLogin, authLogout, authRegister, deleteUser, getOneUser, getUsers, Order, removeFromOrderList, updateAuth, uploadProfile } from "../controller/auth.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"

const authRouter = express.Router()

const storage = multer.memoryStorage()
const upload = multer({storage})

authRouter.post("/register",authRegister)
authRouter.post("/login",authLogin)
authRouter.post("/logout",authLogout)
authRouter.put("/updateAuth/:id",updateAuth)
authRouter.delete("/deleteAuth/:id",deleteUser)
authRouter.get("/getAllUser",authMiddleware,getUsers)
authRouter.get("/getAUser/:id",getOneUser)
authRouter.put("/order",authMiddleware,Order)
authRouter.put("/removeOrder",authMiddleware,removeFromOrderList)
authRouter.put("/uploadProfile",authMiddleware,upload.single("ProfilePic"),uploadProfile)

export default authRouter