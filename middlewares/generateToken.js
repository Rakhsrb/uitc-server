import jwt from "jsonwebtoken";

export default function (param) {
    return jwt.sign(param, process.env.JWTSECRETKEY, { expiresIn: "7d", })
}