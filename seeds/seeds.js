var async = require('async');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var ReferralSchema = require('../backend/models/referral.js');
var PartnerSchema = require('../backend/models/partner.js');
const Partner = mongoose.model('Partner', PartnerSchema);
const Referral = mongoose.model('Referral', ReferralSchema);


mongoose.Promise = global.Promise;

// module.exports = function seedPartners(){
//     Partner.find({}).exec(function(err, collection){
//         if (collection.length === 0){
//         Partner.create({
//                     email: 'test@test.com',
//                     firstName: 'testFirst',
//                     lastName: 'testLast',
//                     company: 'galvanize',
//                     phone: 555-555-5555,
//                     password: 'asdfasdf'
//                             })
//         }
//     })
// }


// module.exports =  function(done) {
//             var partners = [];
//             var testPartnerCount = 20;
//             for (i = 0; i < testPartnerCount; i++) {
//                 var newPerson = {
//                     email: i + '@' + i + '.com',
//                     firstName: i,
//                     lastName: i,
//                     company: i + 'galvanize',
//                     phone: i + i + i + i + i + i + i,
//                     password: 'asdfasdf',
//                     nonConversionCourtesyBenefitCount: i,
//                     starterConvertedCount: i,
//                     growthConvertedCount: i
//                 };
//                 partners.push(newPerson);
//             }
//             console.log(partners);
//             partners.forEach(function(person){
//                 let newbie = new Partner(person)
//                 // console.log(newbie, 'newbie');
//                 newbie.save()
//             // .then(function(){
//             //     console.log("Populating database with" + i + "partners");
//             //     done()
//             // })
//
//             })
//         }()





module.exports =
function(done) {
  var referrals = [];
  var testReferralCount = 5;
  for (i = 0; i < testReferralCount; i++) {
      var referral = new Referral({
                          email: i + '@' + i + '.com',
                          leadName: i + 'leadName',
                          leadCompanyName: i+'leadCompanyName',
                          leadEmail: i+ '@leadEmail.com',
                          phone: i + i + i + i + i + i + i,
                          password: 'asdfasdf',
                          referrerEmail: i + '@' + i + '.com'
                      });
                      referrals.push(referral);
                  }
console.log(referrals);

  referrals.forEach(function(person){
                  let newbie = new Referral(person)
                  // console.log(newbie, 'newbie');
                  newbie.save()
              // .then(function(){
              //     console.log("Populating database with" + i + "partners");
              //     done()
              // })

              })
          }()
