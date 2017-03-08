var app = angular.module('sbc', ['ngRoute', 'ngMessages']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeController',
        })

        .when('/confirmation', {
            templateUrl: 'partials/loggedOutReferralConfirm.html',
            controller: 'loggedOutReferralConfirmController'
        })

        .when('/partnersignup', {
            templateUrl: 'partials/partnerSignup.html',
            controller: 'partnerSignupController'
        })

        .when('/loginerror', {
            templateUrl: 'partials/loginError.html',
            controller: 'loginErrorController'
        })

        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginController'
        })

        .when('/table', {
            templateUrl: 'partials/historyTable.html',
            controller: 'tableController',
            resolve: {
                data: function(CurrentPartner) {
                    console.log(CurrentPartner(), 'CurrentPartner invoked');
                    return CurrentPartner();
                }
            }
        })

        .when('/admin', {
            templateUrl: 'partials/tableAdminConverted.html',
            controller: 'tableController',
            resolve: {
                data: function(CurrentPartner) {
                    console.log(CurrentPartner(), 'CurrentPartner invoked');
                    return CurrentPartner();
                }
            }
        })

        .when('/admin/leads', {
            templateUrl: 'partials/tableAdminNonConverted.html',
            controller: 'tableController',
            resolve: {
                data: function(CurrentPartner) {
                    console.log(CurrentPartner(), 'CurrentPartner invoked');
                    return CurrentPartner();
                }
            }
        })



        .when('/submitreferral', {
            templateUrl: 'partials/loggedInForm.html',
            controller: 'loggedInFormController',
            resolve: {
                data: function(CurrentPartner) {
                    return CurrentPartner();
                }
            }
        })

        .when('/referralconfirm', {
            templateUrl: 'partials/loggedInReferralConfirm.html',
            controller: 'loggedInReferralConfirmController',
            resolve: {
                data: function(CurrentPartner) {
                    return CurrentPartner();
                }
            }
        })
        .when('/navbar', {
            templateUrl: 'partials/navbar.html',
            controller: 'loggedInReferralConfirmController'
        });
});
