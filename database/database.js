// MongoDB database
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// schemas
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String
}, {collection: 'userSchema'})

// Models
let User = mongoose.model('User', userSchema)

//exports
module.exports = {
    User: User
}