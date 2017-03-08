app.service('CurrentPartner', ['$http', '$location', function($http, $location) {

    return  function() {
          if (localStorage.getItem('token')) {
            const config = {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(
                  'token')
              }
            };
            return $http.get('/api/verify', config)
              .then(function(response) {
                return response.data;
              })

            .catch(function(error) {
              console.log(error, 'resolve error');
              localStorage.clear();
              return null;
            });
        }else{
                $location.path('/login')
        }
        }

}]);;
