app.controller('tableController', [
    '$scope',
    '$http',
    '$location',
    '$window',
    'CurrentPartner',
    'LogOutService',
    '$anchorScroll',
    function($scope, $http, $location, $window, CurrentPartner, LogOutService, $anchorScroll) {


        $scope.logout = LogOutService;

        $scope.view = {};
        $scope.view.booyah = 'booyah from table controller';
        $scope.currentUser = {};
        $scope.view.conversionTypes = ['starter', 'growth'];
        $scope.monthlyStarter = 49.9
        $scope.monthlyGrowth = 99.9

        $scope.view.nonConvertedClick = function() {
            $location.path('/admin/leads');
        }

        $scope.view.convertedViewClick = function() {
            $location.path('/admin');
        }

        $scope.convertClicked = function(referral) {
            var referralIndex = this.$index;
            $('select').material_select();
            $http.post('/api/referrals/convert', $scope.currentUser.data[referralIndex]).then((response) => {
                $scope.currentUser.data[referralIndex] = response.data;
            })
        }

        CurrentPartner().then(function(partnerReturned) {
            $scope.currentUser = partnerReturned;
            if ($scope.currentUser.email === "g33ks@galvanize.com") {
                $scope.currentUser.admin = true
                $http.get('/api/referrals').then(function(response) {
                    $scope.currentUser.data = response.data;
                    $scope.currentUser.data.forEach(makeCalculations);
                })
            } else {
                $http.get('/api/partners/' + $scope.currentUser.email + '/referrals').then(function(response) {
                    $scope.currentUser.data = response.data[1]; //array of referrals for this partner
                    $scope.currentUser.data.forEach(makeCalculations);                 });
            }
        })

        //Date information and view for payout date
        $scope.date = new Date().getMonth() + 1;
        $scope.payoutDate = function() {

            if (1 <= $scope.date <= 3) {
                $scope.date = 'April 1';
            } else if (4 <= $scope.date <= 6) {
                $scope.date = 'July 1';
            } else if (7 <= $scope.date <= 9) {
                $scope.date = 'October 1';
            } else {
                $scope.date = 'January 1';
            }
        }();
        $scope.year = new Date().getFullYear();

        function makeCalculations(ref) {
            var todaysDate = moment(new Date()).format('YYYY-MM-DD');
            if (!ref.conversionDate) {
                ref.numMonthsPassedSinceConversion = 0;
            } else {
                ref.numMonthsPassedSinceConversion = moment(todaysDate).diff(moment(ref.conversionDate));
                ref.totalNumOfQuarterlyPayouts = 0;
                var monthlyCalc = (ref.numMonthsPassedSinceConversion - (ref.totalNumOfQuarterlyPayouts * 3));
                if (ref.activeReferral && (ref.numMonthsPassedSinceConversion = 0)) {
                    ref.amountMadeTowardNextPayout = ref.bonusAmount;
                    ref.totalAmountPaidForReferral = ref.bonusAmount;
                } else if (ref.activeReferral && 1 >= ref.numMonthsPassedSinceConversion <= 3) {
                    if (ref.starterConverted) {
                        ref.amountMadeTowardNextPayout = (ref.numMonthsPassedSinceConversion * $scope.monthlyStarter) + ref.bonusAmount;
                        ref.totalAmountPaidForReferral = ref.amountMadeTowardNextPayout;
                    } else if (ref.growthConverted) {
                        ref.amountMadeTowardNextPayout = (ref.numMonthsPassedSinceConversion * $scope.monthlyGrowth) + ref.bonusAmount;
                        ref.totalAmountPaidForReferral = ref.amountMadeTowardNextPayout;
                    }
                } else if (ref.activeReferral && 4 <= ref.numMonthsPassedSinceConversion <= 6) {
                    ref.totalNumOfQuarterlyPayouts = 1;
                    if (ref.starterConverted) {
                        ref.amountMadeTowardNextPayout = monthlyCalc * $scope.monthlyStarter;
                        ref.totalAmountPaidForReferral += ref.amountMadeTowardNextPayout;
                    } else if (ref.growthConverted) {
                        ref.amountMadeTowardNextPayout = monthlyCalc * $scope.monthlyGrowth;
                        ref.totalAmountPaidForReferral += ref.amountMadeTowardNextPayout;
                    }
                } else if (7 <= ref.numMonthsPassedSinceConversion <= 9) {
                    ref.totalNumOfQuarterlyPayouts = 2;
                    if (ref.starterConverted) {
                        ref.amountMadeTowardNextPayout = monthlyCalc * $scope.monthlyStarter;
                        ref.totalAmountPaidForReferral += ref.amountMadeTowardNextPayout;
                    } else if (ref.growthConverted) {
                        ref.amountMadeTowardNextPayout = monthlyCalc * $scope.monthlyGrowth;
                        ref.totalAmountPaidForReferral += ref.amountMadeTowardNextPayout;
                    }
                } else if (10 <= ref.numMonthsPassedSinceConversion <= 12) {
                    ref.totalNumOfQuarterlyPayouts = 3;
                    if (ref.starterConverted) {
                        ref.amountMadeTowardNextPayout = monthlyCalc * $scope.monthlyStarter;
                        ref.totalAmountPaidForReferral += ref.amountMadeTowardNextPayout;
                    } else if (ref.growthConverted) {
                        ref.amountMadeTowardNextPayout = monthlyCalc * $scope.monthlyGrowth;
                        ref.totalAmountPaidForReferral += ref.amountMadeTowardNextPayout;
                    }
                } else {
                    ref.activeReferral = false
                }
            }
            return ref;
        }
    }
]);
