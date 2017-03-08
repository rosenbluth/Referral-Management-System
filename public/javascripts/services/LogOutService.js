app.service('LogOutService', ['$window', '$location', function($window, $location) {

    return  function(){
            $window.localStorage.clear();
            $location.path( '/' );
            console.log('hitting logout funct');
    }
}]);
