const { createHmac, randomBytes } = require('crypto')
const { Schema, model } = require('mongoose')
const { createTokenForUser } = require('../services/authentication')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type:String ,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }

}, {timestamps: true})

userSchema.pre('save', function (next) {
    const user = this

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword

    next()
})

userSchema.static('matchPasswordAndGenerateToken', async function (password, email) {
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;   // jo password db me store kiya hai

    const userProvidedhash = createHmac('sha256', salt).update(password).digest('hex'); // user ne jo password diya hai uska hash
    if(hashedPassword !== userProvidedhash ) throw new Error('Invalid password');
    // return {...user, password: undefined, salt: undefined}

     const token = createTokenForUser(user)
    return token;
})

const User = model('user', userSchema)


module.exports = User;

