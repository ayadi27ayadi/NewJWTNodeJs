const jwt = require('jsonwebtoken');
const { Promise } = require('mongoose');
const UserToken = require('../Models/UserToken');



const generateTokens = async(user) => {
    try {
        const payload = {_id: user._id, roles: user.roles}
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            {expiresIn: "14m"}
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {expiresIn: "30d"}
        );
        const userToken = await UserToken.findOne({userId: user._id});
        if(userToken)
        await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken}).save();
        return Promise.resolve({accessToken, refreshToken})
    } catch (error) {
        return Promise.reject(error)
    }


};

module.exports =  generateTokens;

