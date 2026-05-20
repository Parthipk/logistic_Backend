const { comparePassword } = require("../../helper/bcryptCompare");
const { hashPassword } = require("../../helper/bcryptHash");
const { generateRefreshToken, generateAccessToken, generateUserToken } = require("../../helper/jwtToken");
const { errorResponse, successResponse } = require("../../helper/response");
const userSchema = require("../../model/user"); 
const jwt = require("jsonwebtoken");
const { emailSchema } = require("../../validators/userValidation");


//@desc user signUp
//@api POST /signUp
//@access public
exports.signup = async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            number,
            countryCode,
        } = req.body;

        const registeredCustomer = await userSchema.findOne({ email });
        if (registeredCustomer) {
            return errorResponse(res, 400, "emailAlreadyRegistered");
        }
        const hashedPassword = await hashPassword(password);
        const accountId = `USER${String((await userSchema.countDocuments()) + 1).padStart(4, "0")}`;
        const customer = new userSchema({
            name,
            email,
            number,
            countryCode,
            password: hashedPassword,
            accountId: accountId,
        });
        await customer.save();

        const tokenPayload = {
            userId: customer._id.toString(),
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);
        await customer.addRefreshToken(refreshToken);
        return successResponse(
            res,
            {
                name,
                email,
                number,
                countryCode,
                accessToken,
                refreshToken,
                accountId
            },
            "signupSuccess"
        );
    } catch (error) {
        console.log("Signup Error:", error);
        return errorResponse(res, 500, "internalServerError");
    }
};




//@desc user login
//@api POST /login
//@access public

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const validation = emailSchema.safeParse({ email });
        if (!validation.success) {
            return res.status(400).json({ message: "Invalid Email input" });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }

        const rightPassword = await comparePassword(password, user.password);
        if (!rightPassword) {
            return res.status(400).json({ message: "wrong password" });
        }
        user.lastLogin = new Date();
        await user.save();

        const tokenPayload = {
            userId: user._id.toString(),
        };

        const accessToken = generateAccessToken(tokenPayload);

        const refreshToken = generateRefreshToken(tokenPayload);

        await user.addRefreshToken(refreshToken);

        return res.status(200).json({
            data: {
                name: user.name,
                email: user.email,
                number: user.number,
                countryCode: user.countryCode,
                accessToken,
                lastLogin: user.lastLogin,
                refreshToken,
                message: "Login success"
            }
        });
    } catch (error) {
        console.log("Signup Error:", error);
        return errorResponse(res, 500, "internalServerError");
    }

};


//@desc user login
//@api POST /login
//@access private

exports.token = async(req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(res, 401, "missingRefreshToken");
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        } catch (err) {
            return errorResponse(res, 403, "invalidOrExpiredRefreshTokenss");
        }

        const customer = await userSchema.findById(decoded.userId)

        if (!customer || !(await customer.validateRefreshToken(refreshToken))) {
            return errorResponse(res, 403, "invalidOrRevokedRefreshTokens");
        }
        customer.refreshTokens = customer.refreshTokens.filter(
            (t) => t.token !== refreshToken && new Date(t.expiresAt) > new Date()
        );
        const newAccessToken = generateAccessToken({
            userId: customer._id.toString(),
        });

        const newRefreshToken = generateRefreshToken({
            userId: customer._id.toString(),
        });

        await customer.addRefreshToken(newRefreshToken);
        await customer.save();

        return successResponse(
            res,
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
            "tokenRefreshed"
        );
    } catch (error) {
        console.log("Signup Error:", error);
        return errorResponse(res, 500, "internalServerError");
    }
};




//@desc // Logout (Invalidate Refresh Token)
//@api GET /logout
//@access private
exports.logout = async(req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(res, 400, "missingRefreshToken");
        }

        let decoded;

        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                decoded = jwt.decode(refreshToken);
                if (!decoded || !decoded.userId) {
                    return errorResponse(res, 401, "sessionExpiredOrInvalid");
                }
            } else {
                return errorResponse(res, 400, "invalidRefreshToken");
            }
        }

        const customer = await userSchema.findById(decoded.userId);
        if (!customer) {
            return errorResponse(res, 404, "customerNotFound");
        }

        customer.refreshTokens = customer.refreshTokens.filter(
            (t) => t.token !== refreshToken
        );

        customer.pushToken = null;

        await customer.save();

        return successResponse(res, {}, "logoutSuccess");

    } catch (error) {
        console.log("Signup Error:", error);
        return errorResponse(res, 500, "internalServerError");
    }
}


