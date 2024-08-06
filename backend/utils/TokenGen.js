import jwt from "jsonwebtoken";

const TokenGen = async (id) => {
 try {
     const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
       expiresIn: process.env.JWT_TOKEN_EXPIRY,
     });
     return token;
 } catch (error) {
        console.error("Token Gen Error: ",error);

 }
};

export default TokenGen
