(function () {

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('requestInterceptor');
    })
  .factory('requestInterceptor', function ($q, $injector) {
      var notificationChannel;
      var $http;

      return {
          'request': function (config) {
              // get requestNotificationChannel via $injector because of circular dependency problem
              notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
              // send a notification requests are complete
              notificationChannel.requestStarted();
              return config || $q.when(config);
          },

          'requestError': function (rejection) {
              $http = $http || $injector.get('$http');
              // don't send notification until all requests are complete
              if ($http.pendingRequests.length < 1) {
                  // get requestNotificationChannel via $injector because of circular dependency problem
                  notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
                  // send a notification requests are complete
                  notificationChannel.requestEnded();
              }
              return $q.reject(response);
              return $q.reject(rejection);
          },

          'response': function (response) {
              // get $http via $injector because of circular dependency problem
              $http = $http || $injector.get('$http');
              // don't send notification until all requests are complete
              if ($http.pendingRequests.length < 1) {
                  // get requestNotificationChannel via $injector because of circular dependency problem
                  notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
                  // send a notification requests are complete
                  notificationChannel.requestEnded();
              }
              return response || $q.when(response);
          },

          'responseError': function (response) {
              // get $http via $injector because of circular dependency problem
              $http = $http || $injector.get('$http');
              // don't send notification until all requests are complete
              if ($http.pendingRequests.length < 1) {
                  // get requestNotificationChannel via $injector because of circular dependency problem
                  notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
                  // send a notification requests are complete
                  notificationChannel.requestEnded();
              }
              return $q.reject(response);
          }
      }
  });
    //    ng_iqApp.config(['$httpProvider', function ($httpProvider) {
    //        var $http,
    //        interceptorRequest = ['$q', '$injector', function ($q, $injector) {
    //            var notificationChannel;            

    //            return function (promise) {
    //                // get requestNotificationChannel via $injector because of circular dependency problem
    //                notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
    //                // send a notification requests are complete
    //                notificationChannel.requestStarted();
    //                return promise;
    //            }
    //        } ];

    //        $httpProvider.requestInterceptors.push(interceptorRequest);
    //    } ]);

    //app.config(['$httpProvider', function ($httpProvider) {
    //    var $http,
    //    interceptorResponse = ['$q', '$injector', function ($q, $injector) {
    //        var notificationChannel;

    //        function success(response) {
    //            // get $http via $injector because of circular dependency problem
    //            $http = $http || $injector.get('$http');
    //            // don't send notification until all requests are complete
    //            if ($http.pendingRequests.length < 1) {
    //                // get requestNotificationChannel via $injector because of circular dependency problem
    //                notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
    //                // send a notification requests are complete
    //                notificationChannel.requestEnded();
    //            }
    //            return response;
    //        }

    //        function error(response) {
    //            // get $http via $injector because of circular dependency problem
    //            $http = $http || $injector.get('$http');
    //            // don't send notification until all requests are complete
    //            if ($http.pendingRequests.length < 1) {
    //                // get requestNotificationChannel via $injector because of circular dependency problem
    //                notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
    //                // send a notification requests are complete
    //                notificationChannel.requestEnded();
    //            }
    //            return $q.reject(response);
    //        }

    //        return function (promise) {
    //            // get requestNotificationChannel via $injector because of circular dependency problem
    //            //notificationChannel = notificationChannel || $injector.get('ng_ajaxRequest_ChannelNotification');
    //            // send a notification requests are complete
    //            //notificationChannel.requestStarted();
    //            return promise.then(success, error);
    //        }
    //    } ];

    //    $httpProvider.responseInterceptors.push(interceptorResponse);
    //} ]);
}());