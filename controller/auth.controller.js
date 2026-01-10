import User from "../model/auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import SareeModel from "../model/card.model.js";

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
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,    // REQUIRED (cross-site)
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
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
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

async function updateAuth(req,res) {
   try {
      const {id}=req.params
      const {email,fullName,gender} =req.body
       const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ message: "Email already in use by another user", success: false });
    }
    const profilePic =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${fullName}`
        : `https://avatar.iran.liara.run/public/girl?username=${fullName}`;
      const updateUser = await User.findByIdAndUpdate(id,{email,username,gender,profilePic},{new:true})
      if(!updateUser){
        return res.status(501).json({message:"Auth Update Error"})
      }
      res.status(201).json({message:"Update successfully !",success:true,user:{
        fullName:updateUser.fullName,
        email:updateUser.email,
        ProfilePic:updateUser.ProfilePic,
        gender:updateUser.gender,
        role:updateUser.role,
        _id:updateUser._id
      }})
   } catch (error) {
       res.status(404).json({message:"failed to update user"})
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
    const data= req.body; 
    const {id,userId}=data.id
    console.log(id,userId)
    if (!id || !userId) {
      return res.status(400).json({ message: "Invalid Saree Id or User Id" });
    }
    const saree = await SareeModel.findById(id);
    if (!saree) {
      return res.status(404).json({ message: "Saree not found" });
    }

   
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { addToCard: id } }, 
      { new: true }
    ).populate("addToCard")

    res.status(200).json({
      message: "Saree added to cart successfully",
      cart: user.addToCard,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
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