var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReferralSchema = require('./referral');

var PartnerSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    company: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    salt: String,
    chosenOptions: {
        type: Object,
        default: {}
    },
    stripeCustomer: {
        type: Object,
        default: {}
    },
    stripeSignupTimestamp: {
        type: Date,
        default: Date.now
    },
    stripeConnectAccountId: {
        type: String,
    },
    monthlyStripeAccountId: {
        type: String
    },
    hasLinkedStripe: {
        type: Boolean,
        default: false
    },
    venmoCustomer: {
        user_id: String,
    },
    hasLinkedVenmo: {
        type: Boolean,
        default: false
    },

    //--------********-------   how many  conversions have they made?
    starterConvertedCount: {
        type: Number,
        default: 0
    },

    growthConvertedCount: {
        type: Number,
        default: 0
    },
    nonConversionCourtesyBenefitCount: {
        type: Number,
        default: 0
    },
    //--------********-------

    //--------********------- money paid out per conversion
    starterBenefit: {
        type: Number,
        default: 49.90

    },

    starterBenefitBonus: {
        type: Number,
        default: 149.00
    },

    growthBenefit: {
        type: Number,
        default: 99.90
    },

    growthBenefitBonus: {
        type: Number,
        default: 399.00
    },

    nonConversionCourtesyBenefit: {
        type: Number,
        default: 25
    },
    //--------********-------
    //--------********------- total amount partner has earned in referrals

    //notes:
    //starter:
    //149 + ((499 * .1) * 12) = 747.80

    //growth:
    //399 + ((999 * .1) * 12) = 1597.80

    // referrals: [ReferralSchema]


});

module.exports = PartnerSchema;
