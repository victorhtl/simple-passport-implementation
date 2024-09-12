const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
	useFindAndModify: false
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
});


module.exports = mongoose.model('User', UserSchema);