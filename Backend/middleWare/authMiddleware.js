const jwt=require('jsonwebtoken')

const asyncHandler=require('express-async-handler')

const User = require("../Models/userModel");



// const protect = asyncHandler(async(req,res,next)=>{
//     let token;

//     if(req.headers.authorization && 
//         req.headers.authorization.startsWith("Bearer")
//     ){
//         try{
//             // here we split bearer from token and take only token 
//             token = req.headers.authorization.split(" ")[1];

//             // decodes token id

//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // find user and return without password

//             req.user= await User.findById(decoded.id).select("-password");

//             next();
//         }catch(error){
//             res.status(401);
//             throw new Error("Not authorized, token failed");
//         }
//     }
//     if(!token){
//         res.status(401);
//         throw new Error("Not authorized , no token")
//     }
// })

// module.exports = {protect} ;


// const protect = asyncHandler(async (req, res, next) => {
//     let token;
  
//     console.log('Authorization Header:', req.headers.authorization);  // Log header for debugging
  
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       try {
//         // Get token from header
//         token = req.headers.authorization.split(' ')[1];
  
//         console.log('Token:', token);  // Log token for debugging
  
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//         // Find user by decoded ID and attach to request object
//         req.user = await User.findById(decoded.id).select('-password');
  
//         next();
//       } catch (error) {
//         res.status(401);
//         throw new Error('Not authorized, token failed');
//       }
//     }
  
//     if (!token) {
//       res.status(401);
//       throw new Error('Not authorized, no token');
//     }
//   });

//   module.exports= {protect};


// const protect = asyncHandler(async (req, res, next) => {
//     // 1. Debug: Log incoming headers
//     console.log('[AUTH] Headers:', req.headers);
    
//     let token;

//     // 2. Check authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             // 3. Extract token
//             token = req.headers.authorization.split(" ")[1];
//             console.log('[AUTH] Extracted Token:', token);

//             // 4. Verify token exists
//             if (!token || token === 'null') {
//                 res.status(401);
//                 throw new Error("Not authorized, invalid token format");
//             }

//             // 5. Verify JWT_SECRET is configured
//             if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
//                 console.error('[AUTH] Invalid JWT_SECRET configured');
//                 throw new Error("Server configuration error");
//             }

//             // 6. Verify and decode token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log('[AUTH] Decoded Token:', decoded);

//             // 7. Find user in database
//             const user = await User.findById(decoded.id).select("-password");
            
//             if (!user) {
//                 console.error('[AUTH] User not found for ID:', decoded.id);
//                 res.status(401);
//                 throw new Error("User not found");
//             }

//             // 8. Attach user to request
//             req.user = user;
//             console.log('[AUTH] User authenticated:', user.email);
//             next();

//         } catch (error) {
//             console.error('[AUTH] Verification Error:', {
//                 name: error.name,
//                 message: error.message,
//                 expiredAt: error.expiredAt,
//                 currentTime: new Date()
//             });

//             // 9. Specific error messages
//             let message = "Not authorized";
//             if (error.name === 'TokenExpiredError') {
//                 message = "Session expired. Please login again";
//             } else if (error.name === 'JsonWebTokenError') {
//                 message = "Invalid token. Please login again";
//             }

//             res.status(401).json({ 
//                 message,
//                 error: error.name 
//             });
//         }
//     } else {
//         console.error('[AUTH] No Bearer token found');
//         res.status(401).json({ 
//             message: "Not authorized, no token provided" 
//         });
//     }
// });




//  CHATGPT


// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select('-password');

//       next();
//     } catch (error) {
//       console.error("JWT error:", error); // 👈 log the error
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// module.exports = { protect };



// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const User = require("../Models/userModel"); // ✅ Don't use .default

//  final authmiddleware

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("JWT error:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
