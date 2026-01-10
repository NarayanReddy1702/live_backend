
import jwt from "jsonwebtoken"

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "Token not found in cookies" });
  }

  const decode =  jwt.verify(token,process.env.JWT_SECRET)
  req.user = decode
  next();
}

export default authMiddleware;
