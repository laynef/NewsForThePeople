const express =require('express')
const app =express()
const db = require('../database/db')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const session = require('express-session')
const nodemailer = require('nodemailer')
const async = require('async')
const crypto = require('crypto')

// routes
router.get('/login', (req, res, next) => {
  db.User.findById(req.cookies.userId)
      .exec((error, user) => {
            if (error) {
                return next(error)
            } else {
                res.status(200).send(user)
            }
      })
})

router.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
    db.User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        let err = new Error('Wrong email or password.')
        err.status = 401
        return next(err)
      }  else {
        req.cookies.userId = user._id
        req.cookies.email = user.email
        res.sendStatus(201)
      }
    })
  } else {
    let err = new Error('Email and password are required.')
    err.status = 401
    return next(err)
  }
})

router.get('/change/password', (req, res, next) => {
  db.User.findById(req.cookies.userId)
      .exec((error, user) => {
            if (error) {
                return next(error)
            } else {
                res.status(200).send(user)
            }
      })
})

router.post('/change/password', (req, res, next) => {
  let emails = req.cookies.email || req.body.email
    if (emails && req.body.password) {
    db.User.authenticate(emails, req.body.oldPassword, (error, user) => {
      if (error || !user) {
        let err = new Error('Wrong email or password.')
        err.status = 401
        return next(err)
      }  else {
          bcrypt.genSalt(7, (rong, salt) => {
              if (rong) return next(rong)

            bcrypt.hash(req.body.password, salt, null, (wrong, hash) => {
              if (wrong) {
                  return next(wrong)
              }
            db.User.findByIdAndUpdate({_id: user._id}, { $set: {password: hash} }, null, (er, usr) => {
              if (!er) {
                req.cookies.userId = user._id
                res.sendStatus(201)
              }
            })
          })
        })
      }
    })
  } else {
    let err = new Error('Email and password are required.')
    err.status = 401
    return next(err)
  }
})

router.get('/reset/password', (req, res, next) => {
  db.User.findById(req.cookies.userId)
      .exec((error, user) => {
            if (error) {
                return next(error)
            } else {
                res.status(200).send(user)
            }
      })
})

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.')
    }
    res.sendFile('index.html')
  })
})

router.post('/reset/:token', (req, res) => {
    async.waterfall([
      (done) => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.')
          }

          user.password = req.body.password
          user.resetPasswordToken = undefined
          user.resetPasswordExpires = undefined

          user.save((err) => {
            req.logIn(user, (err) => {
              done(err, user)
            })
          })
        })
      },
      (user, done) => {
        let smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: {
            user: 'lfaler',
            pass: 'WhyY0uL00k1ng'
          }
        })
        let mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        }
        smtpTransport.sendMail(mailOptions, (err) => {
          req.flash('success', 'Success! Your password has been changed.')
          done(err)
        })
      }
    ], (err) => {
      // res.redirect('/')
    })
  })

router.post('/reset/password/', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex')
        done(err, token)
      })
    },
    (token, done) => {
      db.User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email address exists.')
        }

        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        req.cookies.email = user.email

        user.save((err) => {
          done(err, token, user)
        })
      })
    },
    (token, user, done)=> {
      let smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: 'lfaler',
          pass: 'WhyY0uL00k1ng'
        }
      })
      let mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.')
        done(err, 'done')
      })
    }
  ], (err) => {
    if (err) return next(err)
    res.sendStatus(201)
  })
})

router.get('/logout', (req, res, next) => {
      if (req.cookies) {
        // delete cookies object
        res.clearCookie('userId')
        res.clearCookie('email')
        res.sendStatus(200)
    }
})

router.get('/register', (req, res, next) => {
  db.User.findById(req.cookies.userId)
      .exec((error, user) => {
            if (error) {
                return next(error)
            } else {
                // redirect react router
                res.status(200).send(user)
            }
      })
})

router.post('/register', (req, res, next) => {
     if (req.body.email &&
          req.body.password &&
          req.body.rePassword) {

      // double check that user typed same password twice
      if (req.body.password !== req.body.rePassword) {
        let err = new Error('Passwords do not match.')
        err.status = 400
        return next(err)
      }

    bcrypt.genSalt(7, (rong, salt) => {
              if (rong) return next(rong)

      bcrypt.hash(req.body.password, salt, null, (wrong, hash) => {
          if (wrong) {
              return next(wrong)
          }

          let userData = {
              email: req.body.email,
              password: hash
          }

          db.User.create(userData,  (error, user) => {
              if (error) {
                  return next(error)
              } else {
                  req.cookies.userId = user._id
                  req.cookies.email = user.email
                  res.sendStatus(201)
              }
          })
      })
    })

    } else {
      let err = new Error('All fields required.')
      err.status = 400
      return next(err)
    }
})

module.exports = router