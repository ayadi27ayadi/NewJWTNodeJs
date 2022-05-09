const mongoose = require('mongoose')


const Schema = mongoose.Schema;
const userTokenSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    token:{
        type: String,
        required: true,
    },
    createAt:{
        type: Date,
        default: Date.now,
        expires: 30*86400, //30 days
    },
    expired:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("UserToken", userTokenSchema);