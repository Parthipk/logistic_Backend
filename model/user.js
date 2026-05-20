const mongoose = require('mongoose')

const user = new mongoose.Schema({

    
    name: {
        type: String,
    },
    number: {
        type: String,
    },
    accountId: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    refreshTokens: [
        {
            token: { type: String },
            expiresAt: { type: Date },
        },
    ],
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true })


user.methods.addRefreshToken = async function (token) {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    this.refreshTokens = this.refreshTokens.filter(
        (t) => new Date(t.expiresAt) > new Date()
    );

    if (this.refreshTokens.length >= 5) {
        this.refreshTokens = this.refreshTokens.slice(-4);
    }
    this.refreshTokens.push({ token, expiresAt });
    await this.save();
};

// Validate refresh token
user.methods.validateRefreshToken = function (token) {
    const storedToken = this.refreshTokens.find((t) => t.token === token);
    if (!storedToken) return false;
    return new Date() < storedToken.expiresAt;
};


const userSchema = new mongoose.model("userSchema", user)
module.exports = userSchema