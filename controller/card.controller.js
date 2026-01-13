import User from "../model/auth.model.js";
import SareeModel from "../model/card.model.js";
import fileUpload from "../service/storage.service.js";
import {v4 as uuid} from "uuid"

const addCard = async (req, res) => {
  try {
    const { title, description, price,category } = req.body;

    const thumbFile = req.files?.thumbline?.[0];
    const imageFiles = req.files?.images;

    if (!title || !description || !price || !thumbFile || !imageFiles?.length || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(title,description,price,thumbFile,imageFiles)

    // Upload thumbnail
    const thumbResult = await fileUpload(
      thumbFile.buffer.toString("base64"),
      uuid()
    );

    // Upload multiple images
    const imageResults = await Promise.all(
      imageFiles.map((file, index) =>
        fileUpload(
          file.buffer.toString("base64"),
          uuid()
        )
      )
    );


   const addItem =  await SareeModel.create({
        thumbline: thumbResult.url,
      images: imageResults.map((img) => img.url),
      title,
      description,
      price,
      category
      })

      if(!addItem){
        return res.status(404).json({message:"Failed to addItem",success:false})
      }

    res.status(201).json({
      success: true,
      message:"File Upload successfully !",
      card:addItem
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};


const getAllCards = async (req, res) => {
  try {
    const allItems = await SareeModel.find();
    console.log(allItems)
     res.status(200).json({
      success: true,
      message: "All items fetched successfully",
      saree: allItems,
      total: allItems.length,
    });

  } catch (error) {
    console.error("Get All Sarees Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sarees",
    });
  }
};

const deleteItem = ( async (req,res)=>{
  try {
    const {id}=req.params
    if(!id){
      return res.status(501).json({message:"failed to get id"})
    }
    
    const deleteUser = await SareeModel.findByIdAndDelete(id)
    res.status(201).json({message:"Card Delete Successfully!",success:true
    })

  } catch (error) {
    res.status(404).json({message:"failed to delete Card",success:false})
  }
})

async function doLike(req, res) {
  try {
    const { sareeId } = req.body;

    if (!sareeId) {
      return res.status(400).json({
        message: "Failed to get product Id",
        success: false,
      });
    }

    const user = req.user;
    const existUser = await User.findById(user._id);

    if (!existUser) {
      return res.status(404).json({
        message: "Failed to get user",
        success: false,
      });
    }

    const sareeData = await SareeModel.findById(sareeId);

    if (!sareeData) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // 🔥 FIXED CHECK
    if (sareeData.like.includes(user._id)) {
      return res.status(200).json({
        message: "You have already liked this item",
        success: false,
      });
    }

    const sareeItem = await SareeModel.findByIdAndUpdate(
      sareeId,
      { $addToSet: { like: user._id } },
      { new: true }
    ).populate("like");

    return res.status(201).json({
      message: "Liked Successfully !",
      success: true,
      sareeItem,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error While Updating the Product Like",
      success: false,
    });
  }
}


const getACard = async (req, res) => {
  try {
    const { id } = req.params; 
  console.log(id)
    const getCard = await SareeModel.findById(id);

    if (!getCard) {
      return res.status(404).json({
        success: false,
        message: "Saree not found",
      });
    }

    res.status(200).json({
      success: true,
      saree: getCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export { addCard ,getAllCards,deleteItem,doLike ,getACard};
