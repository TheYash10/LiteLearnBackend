const jwt = require('jsonwebtoken')

const validateToken = (req,res,next)=>{
    let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  console.log(authHeader);

  if(authHeader && authHeader.startsWith("Bearer"))
  {
    token = authHeader.split(" ")[1];
    // console.log(token);
    jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(error,decoded)=>{
        if(error)
        {
            res.json({
                status:false,
                message:"User is not Authorized"
            })
        }
        console.log(decoded)
        req.user = decoded.user
        next();
    });

    if(!token)
    {
        res.json({
            status:false,
            message:"User is not Authorized or token is missing"
        })
    }
  }
}

module.exports = validateToken;