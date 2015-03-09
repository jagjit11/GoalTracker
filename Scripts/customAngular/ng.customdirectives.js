(function () {
    app.directive('ngLoadingWidget', ['ng_ajaxRequest_ChannelNotification', function (ng_ajaxRequest_ChannelNotification) {
        return {
            restrict: "A",
            link: function (scope, element) {
                // hide the element initially
                element.hide();

                var startRequestHandler = function () {
                    // got the request start notification, show the element
                    element.show();
                };

                var endRequestHandler = function () {
                    // got the request start notification, show the element
                    element.hide();
                };

                ng_ajaxRequest_ChannelNotification.onRequestStarted(scope, startRequestHandler);

                ng_ajaxRequest_ChannelNotification.onRequestEnded(scope, endRequestHandler);
            }
        };
    } ]);
} ());