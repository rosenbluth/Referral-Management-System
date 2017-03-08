var express = require('express');
var router = express.Router({
    mergeParams: true
});
var async = require('async');
var mongoose = require('mongoose');
var ReferralSchema = require('../backend/models/referral.js');
var PartnerSchema = require('../backend/models/partner.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Partner = mongoose.model('Partner', PartnerSchema);
const Referral = mongoose.model('Referral', ReferralSchema);
const moment = require('moment');



// ************** partners **************
router.get('/api/partners', function(req, res) {
    Partner.find().then(function(err, partners) {
        if (err) {
            res.send(err);
        } else {
            res.send(partners);
        }
    })
});



router.post('/api/partners', function(req, res) {
    let partner = req.body;
    let newPartner = new Partner(partner);
    newPartner.save(function(partnerInserted) {
        res.json(partnerInserted)
    })
});



//verify user's credentials and issue a token
router.post('/api/partners/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    let partnerFullName;
    if (!email || !password) {
        res.send('email or password cannot be empty');
    } else {
        Partner.find({
            "email": email
        }).then(function(partnerReturned) {
            if (partnerReturned) {
                partnerFullName = partnerReturned[0].firstName + ' ' + partnerReturned[0].lastName;
                bcrypt.compare(password, partnerReturned[0].password, function(err, response) {
                    if (response) {
                        var token = jwt.sign({
                            id: partnerReturned[0].id
                        }, (process.env.JWT_SECRET))
                        Referral.update({
                                leadEmail: req.body.leadEmail
                            }, {
                                $set: {
                                    referrerEmail: req.body.email,
                                    referrerName: partnerFullName
                                }
                            },
                            function(err, returned) {
                                res.json({
                                    email: req.body.email,
                                    token: token
                                })
                            })
                    } else {
                        res.send('wrong email or password')
                    }
                })
            } else {
                console.log('wrong email or password');
            }
        })
    }
});





//create a new user account and issue a token
router.post('/api/partners/signup', function(req, res) {
    let partner;
    let partnerFullName;
    let errors = [];
    if (!req.body.email) {
        errors.push("Email can't be blank")
    };
    if (!req.body.password) {
        errors.push("Password can't be blank")
    };
    if (errors.length) {
        console.log(errors);
        res.status(422).json({
            errors: errors
        })
    } else {
        Partner.findOne({
            email: req.body.email
        }, function(err, result) {
            if (!result) {
                var saltRounds = 4;
                var passwordHash = bcrypt.hashSync(req.body.password, saltRounds);
                const newPartner = new Partner({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    stripe: req.body.stripe,
                    venmo: req.body.venmo,
                    password: passwordHash
                });
                newPartner.save(function(err, partnerInserted) {
                    partner = partnerInserted;
                    partnerFullName = partnerInserted.firstName + ' ' + partner.lastName;
                    var token = jwt.sign({
                        id: partner.id
                    }, process.env.JWT_SECRET)
                    Referral.update({
                            leadEmail: req.body.leadEmail
                        }, {
                            $set: {
                                referrerEmail: partner.email,
                                referrerName: partnerFullName
                            }
                        },
                        function(err, returned) {
                            res.json({
                                email: partner.email,
                                token: token
                            })
                        })
                })
            } else {
                res.status(422).json()
            }
        })
    }
});





//get all partner info and that partner's referrals
router.get('/api/partners/:partner_email/referrals', function(req, res, next) {
    let partnerEmail = req.params.partner_email;
    let referrals = [];
    let allPartnerReferralInfo = [];
    Partner.find({
        email: partnerEmail
    }).then(function(returnedPartner) {
        allPartnerReferralInfo.push(returnedPartner[0])
            .then(Referral.find({
                referrerEmail: partnerEmail
            }).then(function(referralsReturned) {
                allPartnerReferralInfo.push(referralsReturned);
                res.send(allPartnerReferralInfo)
            }))
    })
})
// ************** end partners **************


// ************** referrals **************
//get all referrals--admin
router.get('/api/referrals', function(req, res) {
    Referral.find(function(err, referrals) {
        if (err) {
            res.send(err);
        } else {
            res.send(referrals);
        }
    })
});


router.post('/api/referrals', function(req, res) {
    let referral = req.body;
    let newReferral = new Referral(referral);
    newReferral.save(function(err, newReferral) {
        res.json(newReferral)
    });
});


router.post('/api/referrals/convert', function(req, res) {
    console.log('hitting convert route');
    let referralToConvert = req.body;
    let momentDate = moment(new Date()).format('YYYY-MM-DD')
    if (referralToConvert.starterConverted) {
        console.log(momentDate, 'momentDate');
        Referral.findByIdAndUpdate({
                _id: referralToConvert._id
            }, {
                $set: {
                    starterConverted: true,
                    growthConverted: false,
                    conversionDate: momentDate,
                    bonusAmount: 149,
                    totalAmountPaidForReferral: 149,
                    numMonthsPassedSinceConversion: 0,
                    activeReferral: true
                }
            }, {
                new: true
            },
            function(err, returned) {
                console.log(returned, 'callback returned referral after starter converted switched to true');
                // console.log(err, 'err switched');
                console.log(momentDate, 'momentDate');
                res.send(returned)
            });
    }
    if (referralToConvert.growthConverted) {
        Referral.findByIdAndUpdate({
                _id: referralToConvert._id
            }, {
                $set: {
                    starterConverted: false,
                    growthConverted: true,
                    conversionDate: momentDate,
                    bonusAmount: 399,
                    totalAmountPaidForReferral: 399,
                    numMonthsPassedSinceConversion: 0,
                    activeReferral: true
                }
            }, {
                new: true
            },
            function(err, returned) {
                console.log(returned, 'callback returned referral after growthConverted converted switched to true');
                res.send(returned)
            });
    }
})
// ************** end referrals **************



// ************** token auth **************
router.get('/api/verify', function(req, res) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, (process.env.JWT_SECRET));

        Partner.find({
            _id: payload.id
        }).then(function(returnedPartner) {
            if (returnedPartner[0]) {
                res.json({
                    id: returnedPartner[0]._id,
                    email: returnedPartner[0].email,
                })
            }
        })
    } else {
        res.status(403).json({
            error: "No token"
        })
    }
});
// ************** end token auth **************
module.exports = router;
