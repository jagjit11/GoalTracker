(function () {
    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, data) {              

        $scope.data = data;
        $scope.accept = function () {
            $modalInstance.close($scope.data);
        };

        $scope.reject = function () {
            $modalInstance.dismiss('cancel');
        };
    });
}());