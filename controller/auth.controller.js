import User from "../model/auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import SareeModel from "../model/card.model.js";
import mongoose  from "mongoose";

async function authRegister(req, res) {
  try {
    const { fullName, email, password, role, gender } = req.body;


    if (!fullName || !email || !password || !role || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(fullName,email,password,gender,role)
    if (password.length < 6) {
      return res
        .status(401)
        .json({ message: "Password length must be greater then 6" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    var randowImage;
    if (gender === "Male") {
      randowImage =
        randowImage = `https://avatar.iran.liara.run/public/boy?username=${fullName}`;
    } else {
      randowImage =
        randowImage = `https://avatar.iran.liara.run/public/girl?username=${fullName}`;
    }

    const hasPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hasPassword,
      ProfilePic: randowImage,
      role,
      gender,
    });

    if (!newUser) {
      return res.status(404).json({ message: "Failed to create user" });
    }

    res
      .status(201)
      .json({ message: "Register successfully !", newUser, success: true });
  } catch (error) {
    res.status(404).json({ message: "Auth Register error", success: false });
  }
}

async function authLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        fullName: existingUser.fullName,
      },
      process.env.JWT_SECRET,
    );

    
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // REQUIRED (https)
  sameSite: "none",    // REQUIRED (cross-site)
  maxAge: 24 * 60 * 60 * 1000,
});




    return res.status(200).json({
      message: "Login successful!",
      user: {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        ProfilePic: existingUser.ProfilePic,
        gender: existingUser.gender,
      },
      token,
      success: true,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

async function authLogout(req, res) {
  try {
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    res.status(200).json({ message: "Logout Successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout", success: false });
  }
}

async function getUsers(req, res) {
  try {
    const allUser = await User.find();
    if (!allUser) {
      return res.status(409).json({ message: "User not Found !" });
    }
    res
      .status(201)
      .json({ message: "All user get successfully !", success: true, users:allUser });
  } catch (error) {
    res.status(404).json({ message: "Failed to get all user", success: false });
  }
}

async function deleteUser(req,res) {
  try {
    const {id}=req.params
    if(!id){
      return res.status(501).json({message:"failed to get id"})
    }
    
    const deleteUser = await User.findByIdAndDelete({_id:id})
    res.status(201).json({message:"User Delete Successfully!",success:true
    })

  } catch (error) {
    res.status(404).json({message:"failed to delete user",success:true})
  }
}

async function updateAuth(req, res) {
  try {
    const { id } = req.params;
    const { email, fullName, gender } = req.body;

    // Check email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({
        message: "Email already in use by another user",
        success: false,
      });
    }

    // Generate avatar
    const profilePic =
      gender === "Male"
        ? `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(fullName)}`
        : `https://avatar.iran.liara.run/public/girl?username=${encodeURIComponent(fullName)}`;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email: email.trim(),
        fullName: fullName.trim(),
        gender,
        profilePic,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Update successful!",
      success: true,
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        gender: updatedUser.gender,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (error) {
    console.error("Update Auth Error:", error);
    return res.status(500).json({
      message: "Failed to update user",
      success: false,
    });
  }
}

async function getOneUser(req,res) {
     try {
      const {id}=req.params
      const getOneUser =await User.findOne({_id:id}).populate("addToCard")
      res.status(201).json({message:"One user get Successfully !",success:true,userDet:getOneUser})
     } catch (error) {
      res.status(404).json({message:"Failed to get one User",success:false})
     }
     
}



async function Order(req, res) {
  try {
    const { sareeId } = req.body;
    const user = req.user;

    console.log("sareeId", sareeId, user);

    if (!sareeId || !user?._id) {
      return res
        .status(400)
        .json({ message: "Invalid Saree Id or User Id" });
    }

    // Optional but recommended
    if (!mongoose.Types.ObjectId.isValid(sareeId)) {
      return res.status(400).json({ message: "Invalid Saree ObjectId" });
    }

    const saree = await SareeModel.findById(sareeId);
    if (!saree) {
      return res.status(404).json({ message: "Saree not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { addToCard: sareeId } // ✅ ONLY ObjectId
      },
      { new: true }
    ).populate("addToCard");

    res.status(200).json({
      success: true,
      message: "Saree added to cart successfully",
      cart: updatedUser.addToCard,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}



export {
    authRegister,
    authLogin,
    authLogout,
    getUsers,
    deleteUser,
    updateAuth,
    getOneUser,
    Order
}