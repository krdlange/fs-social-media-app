import jwt from "jsonwebtoken";

export const verifyToken= async (req, res, next) => {
    try {
        // From the frontend we are grabbing the authorization header which is where our token will be stored
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }
        //we want the token to be starting with the word bearer, so we take the token and slice it
        if (token.startswith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft("");
        }
        
        //verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}