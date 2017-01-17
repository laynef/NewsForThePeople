// MongoDB database
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = require('bluebird')

// schemas
const UserSchema = new Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
})

// authenticate input against database documents
UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ email: email })
      .exec((error, user) => {
        if (error) {
          return callback(error)
        } else if ( !user ) {
          let err = new Error('User not found.')
          err.status = 401
          return callback(err)
        }
        bcrypt.compare(password, user.password , (error, result) => {
          if (result) {
            return callback(null, user)
          } else {
            return callback()
          }
        })
      })
}

// Models
let User = mongoose.model('User', UserSchema)

//exports
module.exports = {
    User: User
}