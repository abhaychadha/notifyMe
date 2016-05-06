angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/am.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/am.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/am.png'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/am.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/am.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Notifications',function(){
  /*var notifications = [{
    id: 0,
    name: 'Error Notification',
    lastText: 'This is an error',
    face: 'img/am.png '
  }, {
    id: 1,
    name: 'Warning Notification',
    lastText: 'this is warning',
    face: 'img/am.png'
  }, {
    id: 2,
    name: 'Error Notification',
    lastText: 'this is error',
    face: 'img/am.png'
  }];*/

  return {
    all: function(service) {
      var serviceName = service.serviceName;
       var notificationsObj
      if(window.localStorage["notifications"]){
         notificationsObj = JSON.parse(window.localStorage["notifications"]);
         return notificationsObj[serviceName].data;
      }   
      return [];   
    },    
    get: function(notificationId) {
      for (var i = 0; i < notifications.length; i++) {
        if (notifications[i].id === parseInt(chatId)) {
          return notifications[i];
        }
      }
      return null;
    }
  }
})

.factory('RequestsService', function($http, $q, $ionicLoading){

        var base_url = GLOBAL_VARIABLES.serverURL;

        function register(device_token){
            /*alert(device_token);*/
            var data = {device_token: device_token};
            var deferred = $q.defer();
            $ionicLoading.show();
            $http({
              url: base_url+'/registerDevice',
              method: "POST",
              data: data,
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              }
            })
            .then(function(response) {
                    $ionicLoading.hide();
                    deferred.resolve(response);
            }, 
            function(response) { // optional
                    //alert('error:'+response)
                    deferred.reject();
            });          

            return deferred.promise;

        };


        return {
            register: register
        };
    }
)
.factory('RegisterService', function($http, $q, $state, $ionicLoading, LoginService){

  var base_url = GLOBAL_VARIABLES.serverURL+'/notifyme/user/register';
    
    function registerUser(params){  
        params.deviceId = GLOBAL_VARIABLES.deviceId;
        params.platform = GLOBAL_VARIABLES.platform;
        window.localStorage["deviceId"] = params.deviceId;

        var deferred = $q.defer();
        $ionicLoading.show();
        $http({
          url: base_url,
          method: "POST",
          data: params,
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          }
        })
        .then(function(response) {
          $ionicLoading.hide();                    
          deferred.resolve(response);   
          if(response.data.success) {
            if(params.rememberMe){
              window.localStorage['userDetails'] = JSON.stringify({
                tokenId: response.data.token,
                emailAddress: params.emailAddress
              });

            }
            LoginService.loginUser(params);
            //UpdateService.UpdateUserDetails();
          }else{
            alert('registration failed!')
          }          
        }, 
        function(response) { // optional
                deferred.reject();
        });            

        return deferred.promise;
    };

    return {
        registerUser: registerUser
    };
  }
)
.factory('LoginService', function($http, $q, $state, $ionicLoading, $ionicHistory, UpdateService){

  var base_url = GLOBAL_VARIABLES.serverURL+'/notifyme/user/signin';
    
    function loginUser(params){  
        // params.deviceId = deviceParams.deviceId;

        var deferred = $q.defer();
        $ionicLoading.show();
        $http({
          url: base_url,
          method: "POST",
          data:{emailAddress: params.emailAddress, password: params.password},
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          }
        })
        .then(function(response) {
          $ionicLoading.hide();                    
          deferred.resolve(response);   
          if(response.data.success) { 
            if(response.data.data.authenticated){
             // alert(response.data)
              window.localStorage['userDetails'] = JSON.stringify({
                tokenId: response.data.data.token,
                emailAddress: params.emailAddress
              });          
              $ionicHistory.nextViewOptions({      
                disableBack: true
              });
              $state.go('tab.dash');
              UpdateService.UpdateUserDetails();
            }else{
              alert('authentication failed')
            }
          }             
        }, 
        function(response) { // optional
                deferred.reject();
        });            

        return deferred.promise;
    };

    return {
        loginUser: loginUser
    };
  }
)
.factory('UpdateService', function($http, $q, $state, $ionicLoading){

  var base_url = GLOBAL_VARIABLES.serverURL+'/notifyme/user/update';
    
    function UpdateUserDetails(){  
        // params.deviceId = deviceParams.deviceId;
        var userDetails = JSON.parse(window.localStorage['userDetails']);
        var deferred = $q.defer();
        //alert("tokenId: "+userDetails.tokenId+" deviceRegNo: "+GLOBAL_VARIABLES.registrationId) ;
        var params = {id: userDetails.tokenId, deviceRegNo: GLOBAL_VARIABLES.registrationId };
        $ionicLoading.show();
        $http({
          url: base_url,
          method: "POST",
          data: params,
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          }
        })
        .then(function(response) {
          $ionicLoading.hide();                    
          deferred.resolve(response);   
          /*if(response.data.success) {            
            pushNotification.register(successHandler, errorHandler, androidConfig);
          }             */
        }, 
        function(response) { // optional
                deferred.reject();
        });            

        return deferred.promise;
    };

    return {
        UpdateUserDetails: UpdateUserDetails
    };
  }
)
.factory('NotificationCountService', function($http, $q, $rootScope){
        
        var newNotificationCounts = {};

        function updateCount(){
          var notificationsObj = JSON.parse(window.localStorage['notifications']);
          Object.keys(notificationsObj).forEach(function(key){
            newNotificationCounts[key] = notificationsObj[key].newNotificationCount;                   
          })
          $rootScope.$broadcast("newNotificationCount:updated");
        };

        function getCount(){         
          return newNotificationCounts;
        };

        function clearCount(serviceName){
          if(window.localStorage['notifications']){
            var notificationsObj = JSON.parse(window.localStorage['notifications']);
            this.newNotificationCounts[serviceName] = null;
            notificationsObj[serviceName].newNotificationCount = null;
            window.localStorage['notifications'] = JSON.stringify(notificationsObj);
            $rootScope.$broadcast("newNotificationCount:updated");   
          }        
        };


        return {
          newNotificationCounts: newNotificationCounts,
          updateCount: updateCount,
          getCount: getCount,
          clearCount: clearCount
        };
    }
)
.service('NotificationDetailService', function($http, $q, $ionicLoading){

        this.notification ;

        function setNotification(notification){
          
              this.notification = notification;
            
        };

        function getNotification(){
           return this.notification;
        };

        return {
            getNotification: getNotification,
            setNotification: setNotification,            
        };
    }
);
