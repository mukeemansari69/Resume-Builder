const mongoose = require('mongoose');



const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in blacklist "],
        unique: [true, "Token already exists in blacklist"],
    }
},{
    timestamps: true,
});


const tokenBlacklistModel = mongoose.model('blacklistToken', blacklistTokenSchema);


module.exports = tokenBlacklistModel;