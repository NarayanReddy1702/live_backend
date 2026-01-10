import express from "express"
import { addCard, deleteItem, doLike, getAllCards } from "../controller/card.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"
import multer from "multer"



const cardRouter = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});


cardRouter.post("/addCard",authMiddleware, upload.fields([
    { name: "thumbline", maxCount: 1 }, 
    { name: "images", maxCount: 6 },   
  ]),addCard)
cardRouter.get("/getAllCards",authMiddleware ,getAllCards)
cardRouter.delete("/deleteCard/:id",authMiddleware,deleteItem)
cardRouter.put("/doLike",authMiddleware,doLike)


export default cardRouter