const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true},
});

UserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);