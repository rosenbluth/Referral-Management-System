app.factory('Partner', ['$http', function($http) {

    return {

        get: function() {
            console.log('BOOYAH');
            return $http.get('/api/partners');
        },

        create: function(partnerData) {
            return $http.post('/api/partners', partnerData);
        },

        delete: function(id) {
            return $http.delete('/api/partners/' + id);
        }
    }

}]);;
