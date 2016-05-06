angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $ionicUser, $ionicPush, $state,$ionicHistory, NotificationCountService) {
  // Identifies a user with the Ionic User service

  if(!window.localStorage['userDetails']){
    $ionicHistory.nextViewOptions({      
      disableBack: true
    });
    $state.go('tab.register'); 
  }
  $scope.services = [{
    name:"am",
    img: "am.png",    
  }, {
    name:"twitter",
    img: "twitter.png",    
  }, {
    name:"jira",
    img: "jira.png",    
  }, {
    name:"sapient",
    img: "sapient.png",    
  }, {
    name:"servicenow",
    img: "servicenow.png",    
  }, {
    name:"pm",
    img: "pm.png",    
  }];
  /*$scope.openNotifications = function(){
    $state.go('tab.notifications');
  }*/
  $scope.newNotificationCount = NotificationCountService.newNotificationCounts;

  // $scope.countZero = true;
  $scope.$on('newNotificationCount:updated', function(event, data){
    $scope.$apply(function () {
        $scope.newNotificationCount = NotificationCountService.newNotificationCounts;
    });
    
  })
  // $scope.newNotificationCount = NotificationCountService.getCount();
  $scope.openNotifications = function(service){
      NotificationCountService.clearCount(service.name);
      $state.go('tab.notifications', {serviceName: service.name});    
  }
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });
  };
  
  // Registers a device for push notifications and stores its token
  $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    });
  };
  
  // Handles incoming device tokens
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.token = data.token;
  });
})

.controller('ChatsCtrl', function($scope, $state, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: false
  };
})

.controller('NotificationsCtrl', function($scope, $state, $stateParams, Notifications, NotificationDetailService) {
  $scope.notifications = Notifications.all($stateParams);

  if(!$scope.notifications.length){
    $scope.noContent = true;
  }else{
    $scope.noContent = false;
  }
  

  $scope.getTimeStamp = function(notification){
    var currDate = new Date();
    var notificationTS = new Date(notification.notificationTS);
    var hours = (notificationTS.getHours() < 10) ? ("0" + notificationTS.getHours()) :notificationTS.getHours();
    var minutes = (notificationTS.getMinutes() < 10) ? ("0" + notificationTS.getMinutes()) : notificationTS.getMinutes();
    var time = hours+":"+minutes;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var notificationDay = days[notificationTS.getDay()];
    if(notificationTS.setHours(0,0,0,0).valueOf() != currDate.setHours(0,0,0,0).valueOf()){
      return notificationDay;
    }else{
      return time;
    }
  }

 $scope.openNotifications = function(notification){
    notification.unread = false;
    NotificationDetailService.setNotification(notification);
    $state.go('tab.details');
  }

  $scope.showAlertIcon = function(notification){
    if(notification.notificationCategory == "ALERT"){   
      return true;
    }
    else{
      return false;
    }
  }

  $scope.applyClass = function(notification){    
    if(notification.unread){
      /*if(notification.notificationCategory == "ALERT"){        
        return 'unread-notification-alert';
      }else{*/
        return 'unread-notification-notify';
      //}
      
    }
  }
})

.controller('RegisterCtrl', function($scope, $http, $ionicPopup, RegisterService, LoginService) { 
  
  $scope.params ={};
  $scope.firstName ="";
  $scope.lastName="";
  $scope.email ="";
  $scope.password ="";
  $scope.phone ="";
  $scope.confirmPassword ="";
  $scope.params.rememberMe =true;  

 
 //registering the user
  $scope.registerUser = function(){
    if($scope.params.password != $scope.params.confirmPassword){
      alert("Passwords didn't match");
      return;
    } 

    var params = {
      firstName: $scope.params.firstName,
      lastName: $scope.params.lastName,
      emailAddress: $scope.params.email,
      password: $scope.params.password,
      mobileNo: $scope.params.phone,
      rememberMe: $scope.params.rememberMe
   }
   RegisterService.registerUser(params);
 }

 //signing user
 $scope.signInUser = function(){
    $scope.data ={};
    var myPopup = $ionicPopup.show({
      //templateUrl: 'templates/registeration-modal.html',
      template: "<input type='text' name='email'  ng-maxlength='20' ng-model='data.loginEmail' placeholder='Email' required><br/>"+
                 "<input type='password' name='password'  ng-maxlength='20' ng-model='data.loginPassword' placeholder='Password' required>",
      title: 'Sign In',
      //subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        {
          text: '<b>Submit</b>',
          type: 'button-positive',
          onTap: function(e) {
            if($scope.data.loginEmail && $scope.data.loginPassword){
              params = {
                emailAddress: $scope.data.loginEmail,
                password: $scope.data.loginPassword
              }
              //TODO: API to validate credential goes here
              LoginService.loginUser(params);  
            }
            else{
              alert('Credentials can not be empty')
              e.preventDefault();
            }
            
          }
        },
        { text: 'Cancel' },
      ]
    });

 }
})
.controller('DetailsCtrl', function($scope, $http, $ionicPopup, $stateParams, $state,RegisterService, LoginService, NotificationDetailService) { 
  $scope.notification = NotificationDetailService.getNotification();
});
