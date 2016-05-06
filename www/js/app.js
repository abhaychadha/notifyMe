// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ionic.service.push','ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $cordovaPush, $cordovaSQLite, $state, $cordovaDevice, RequestsService, UpdateService, NotificationCountService) {
  $ionicPlatform.ready(function() {
   window.localStorage.clear();

   // storing app ids'
    window.supported_applications = ["am", "pm", "twitter", "jira", "service_now"];
    /*window.pushNotification = function(){
      var notificationContent = {
        unread: true,
        message: "sample msg",
        title: "Notification",
        appId: "pm",
        image: "img/pm.png",
        notificationEventType: "Product_Update",
        notificationCategory: "ALERT",
        notificationTS: new Date()
      },
      notificationCountService = NotificationCountService;
      if(!window.localStorage["notifications"]){
        var notificationObj = {};
        //notificationObj[notificationContent.appId] = {data: []};
        //notificationObj.pm = {data: []};
        supported_applications.forEach(function(application){
          notificationObj[application] = {data: []};
        });
        notificationObj[notificationContent.appId].data.push(notificationContent);
        notificationObj[notificationContent.appId].newNotificationCount = 1;      
        window.localStorage['notifications']= JSON.stringify(notificationObj);
        notificationCountService.updateCount();
      }else{
        var notificationObj = JSON.parse(window.localStorage["notifications"]);
        notificationObj[notificationContent.appId].data.push(notificationContent);
        
        notificationObj[notificationContent.appId].newNotificationCount = notificationObj[notificationContent.appID] ? 
          notificationObj[notificationContent.appId].newNotificationCount + 1 : 1;     

        window.localStorage["notifications"] = JSON.stringify(notificationObj);
        notificationCountService.updateCount();
      }
    }*/
    
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }    

  });
  
  pushNotification = window.plugins.pushNotification;
  window.successHandler =  function(result) {
   
  },

  window.onNotification = function(e){    

    switch(e.event){
      case 'registered':
        if(e.regid.length > 0){

          window.device_token = e.regid;
          GLOBAL_VARIABLES.registrationId = e.regid;
          if(window.localStorage['userDetails']){
            UpdateService.UpdateUserDetails(); 
          }
          /*RequestsService.register(device_token).then(function(response){
            //alert('registered!');
          });*/
        }
      break;

      case 'message':
        alert('Notification: ' + e.message);
        
          var notificationContent = {
            unread: true,
            message: e.payload.message,
            title: e.payload.title,
            appId: e.payload.appId.toLowerCase(),
            image: "img/"+e.payload.appId.toLowerCase()+".png",
            notificationEventType: e.payload.notificationEventType,
            notificationCategory: e.payload.notificationCategory,
            notificationTS: new Date()
          };
          if(!window.localStorage["notifications"]){
            var notificationObj = {};
            notificationObj.am = {data: []};
            notificationObj.pm = {data: []};
            notificationObj.sapient = {data: []};
            notificationObj.twitter = {data: []};
            /*supported_applications.forEach(function(application){
              notificationObj[application] = {data: []};
            });*/
            notificationObj[notificationContent.appId].data.push(notificationContent);
            notificationObj[notificationContent.appId].newNotificationCount = 1;      
            window.localStorage['notifications']= JSON.stringify(notificationObj);
            NotificationCountService.updateCount();
          }else{
            var notificationObj = JSON.parse(window.localStorage["notifications"]);
            notificationObj[notificationContent.appId].data.push(notificationContent);
            
            notificationObj[notificationContent.appId].newNotificationCount = notificationObj[notificationContent.appId] ? 
              notificationObj[notificationContent.appId].newNotificationCount + 1 : 1;     

            window.localStorage["notifications"] = JSON.stringify(notificationObj);
            NotificationCountService.updateCount();
          }
                    
        
          /*{
              "message": "Hello this is a push notification",
              "payload": {
                  "message": "Hello this is a push notification",
                  "sound": "notification",
                  "title": "New Message",
                  "from": "813xxxxxxx",
                  "collapse_key": "do_not_collapse",
                  "foreground": true,
                  "event": "message"
              }
          }*/
        
      break;

      case 'error':
        alert('error occured');
      break;

      default:
      alert(e.event);

    }
  };

  window.errorHandler = function(error){
    alert('an error occured');
  };



  window.androidConfig = {
    "senderID": "62940241272",
    'badge': 'true',
    'sound': 'true',
    'alert': 'true',
    'ecb': 'onNotification',
  };

  document.addEventListener("deviceready", function(){
    //getting device params
     GLOBAL_VARIABLES.deviceId = $cordovaDevice.getUUID();
     GLOBAL_VARIABLES.platform = $cordovaDevice.getPlatform();
    //$state.go('tab.register');    
    cordova.plugins.backgroundMode.configure({
      silent: true
    })
    cordova.plugins.backgroundMode.enable();
    pushNotification.register(successHandler, errorHandler, androidConfig);


  }, false);

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.notifications', {
    url: '/notifications?serviceName',
    views: {
      'tab-dash': {
        templateUrl: 'templates/notifications.html',
        params: ['serviceName'],
        controller: 'NotificationsCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.register', {
    url: '/register',
    views: {
      'tab-dash': {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      }
    }
  })

  .state('tab.details', {
    url: '/details',
    views: {
      'tab-dash': {
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl',
        params:['face']
      }
    }
  })
/*  .state('tab.notifications', {
    url: '/notifications',
    views: {
      'tab-dash': {
        templateUrl: 'templates/notifications.html',
        controller: 'NotificationsCtrl'
      }
    }
  });*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
