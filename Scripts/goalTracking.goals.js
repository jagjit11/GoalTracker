(function () {
    app.controller("goalController", ['$scope', '$http', '$location', '$modal', '$window', function ($scope, $http, $location, $modal, $window) {

        $scope.virtualDir = virtualDir;
        $scope.goals = [];
        $scope.alerts = [];
        $scope.rawUrl = $scope.virtualDir +'api/EmployeeGoals';
        $scope.EmployeeDetail = jsonEmployee
        $scope.editedRowForms = [];
        $scope.totalWeightage = 0;
        $scope.totalPercentage = 0;
        $scope.progressBarSuccess = 'progress-bar-success';
        $scope.progressBarError = 'progress-bar-danger';
        $scope.foreColor = "#2b689c";
        $scope.index = -1;
        $scope.deleteMessage = "Do you want to delete this record?";        

        $scope.EmployeeDetail.startDate = moment($scope.EmployeeDetail.startDate, ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"])._d;
        $scope.EmployeeDetail.endDate = moment($scope.EmployeeDetail.endDate, ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"])._d;

        //Constant Value
        $scope.constPercentage = 100;

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        //Get Domain Url
        $scope.domain = function () {
            var protocol = $location.protocol();
            var host = $location.host();
            var port = $location.port();

            return protocol + "://" + host + ":" + port + "/";
        }

        //Get requested Url
        $scope.requestUrl = function (method, url, jsonData) {
            return {
                method: method,
                url: $scope.domain() + "/" + url,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: jsonData
            };
        }

        //Used to add new Goal.
        $scope.addGoal = function () {

            var flag = false;
            $.each($scope.goals, function (index, value) {
                if (value.Id == 0) {
                    flag = true;
                    return;
                }
            });

            if (!flag)
                $scope.goals.push({
                    Id: 0,
                    Task: '',
                    Weightage: 0,
                    Finished: 0,
                    IsFinished: false,
                    EmployeeDetailID: $scope.EmployeeDetail.employeeDetailID,
                    IsActive: true,
                    IsDeleted: false,
                    CreatedBy: 'Admin',
                    CreatedDate: new Date(),
                    ProgressBarType: ''
                });
        }

        //Get Goals by employee
        $scope.getGoalsByEmployee = function (id) {

            var protocol = $location.protocol();
            var host = $location.host();
            var port = $location.port();
            var req = {
                method: 'Get',
                url: $scope.domain() + "/" + $scope.rawUrl + "/" + id,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            };

            $http(req).success($scope.callbackGetEmployeeGoal).error($scope.callbackGetErrorEmployeeGoal);
        }
        //Callback for get employee Goals.
        $scope.callbackGetEmployeeGoal = function (data) {
            var newGoalRow = null;
            var updateInactiveRecord = [];
            if (data.length > 0) {
                if ($scope.goals.length > data.length)
                    newGoalRow = $scope.goals[$scope.goals.length - 1];
                $.each(data, function (index, value) {
                    if ($scope.EmployeeDetail.remainingDays <= 0 && value.IsActive == true) {
                        value.IsActive = false;
                        updateInactiveRecord.push(value);
                    }
                });
               
                $scope.goals = data;

                if (newGoalRow != null)
                    $scope.goals.push(newGoalRow);
            }
            else
                $scope.goals = [];
            $scope.calculateTotalWeightage();

            if (parseInt($scope.totalPercentage, 10) == 100)
                $scope.foreColor = "#4ca64c";
            else
                $scope.foreColor = "#2b689c";

            if (updateInactiveRecord.length > 0)
                $scope.updateInactiveGoal(updateInactiveRecord);

            $scope.index = -1;           
        }
        //Error
        $scope.callbackGetErrorEmployeeGoal = function (data) {

            $scope.goals = [];
        }

        //Get Goals by employee
        $scope.saveGoalPeriod = function (index) {

            var req = '';
            var goal = $scope.goals[index];


            if (parseInt(goal.Finished, 10) == 100)
                goal.IsFinished = true;

            if (goal.IsFinished == true)
                goal.Finished = 100;

            if (goal.Id > 0)
                req = $scope.requestUrl("Put", $scope.rawUrl + "/" + goal.Id, goal);
            else
                req = $scope.requestUrl("Post", $scope.rawUrl, goal);

            $http(req).success($scope.callbackSaveEmployeeAndGoals);
        }
        //Callback for save employee period.
        $scope.callbackSaveEmployeeAndGoals = function (data) {
            $scope.alerts = [];
            $scope.alerts.push({ type: 'success', msg: 'Goal saved successfully !!!' });
            $scope.getGoalsByEmployee($scope.EmployeeDetail.employeeDetailID);
        }
        //Callback for save employee Goals.
        $scope.callbackSaveGoals = function (data) {
            $scope.getGoalsByEmployee($scope.EmployeeDetail.employeeDetailID);
        }

        //Update inactive Goals.
        $scope.updateInactiveGoal = function (list) {

            $.each(list, function (index, value) {
                var req = '';
                req = $scope.requestUrl("Put", $scope.rawUrl + "/" + value.Id, value);
                $http(req);
            });
        }

        //Delete existing employee detail.
        $scope.deleteGoal = function (index) {
            var goalData = $scope.goals[index];
            var req = {
                method: 'Delete',
                url: $scope.domain() + "/" + $scope.rawUrl + "/" + goalData.Id,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            };

            if (parseInt(goalData.Id, 10) > 0)
                $http(req).success($scope.callbackDelete);
            else
                $scope.goals.splice(index, 1);
        }
        //Callback for delete.
        $scope.callbackDelete = function (data) {
            $scope.goals = [];
            $scope.getGoalsByEmployee($scope.EmployeeDetail.employeeDetailID);
        }

        //Calculate Total Weightage and Percentage
        $scope.calculateTotalWeightage = function () {
            $scope.totalWeightage = 0;
            $scope.totalPercentage = 0;
            $.each($scope.goals, function (index, value) {

                $scope.totalPercentage += parseFloat(value.Finished) * (parseFloat(value.Weightage) / $scope.constPercentage);
                $scope.totalWeightage += parseFloat(value.Weightage);

                if (parseFloat(value.Finished) == $scope.constPercentage)
                    value.ProgressBarType = $scope.progressBarSuccess;
                else if (parseFloat(value.Finished) < $scope.constPercentage && $scope.EmployeeDetail.remainingDays <= 0)
                    value.ProgressBarType = $scope.progressBarError;
                else
                    value.ProgressBarType = '';
            });

            $scope.totalPercentage = parseFloat($scope.totalPercentage.toFixed(1));
            $scope.totalWeightage = parseFloat($scope.totalWeightage.toFixed(1));
        }

        //Show or hide editable row.
        $scope.editRow = function (rowform, index) {

            if ($scope.index > -1)
                return $scope.Validation($scope.index);

            $.each($scope.editedRowForms, function (index, value) {

                value.$cancel();
            });

            $scope.editedRowForms = [];
            if (!rowform.$visible) {
                rowform.$show();
                $scope.editedRowForms.push(rowform);
                $scope.index = index;
                $scope.alerts = [];

                $window.onclick = function (event) {
                    var tag = event.target.tagName;
                    if (tag.toLowerCase() == 'span')
                        if (event.target.parentElement.tagName.toLowerCase() == 'button')
                            tag = event.target.parentElement.tagName.toLowerCase();

                    if (tag.toLowerCase() != "input" && tag.toLowerCase() != "i" && tag.toLowerCase() != "button")
                        $scope.focusOutFromRow();
                }
            }
        }

        $scope.saveRow = function (keyEvent, index) {

            var keyCode = (window.event ? keyEvent.keyCode : keyEvent.which);
            if (keyCode == 13) {
                $scope.saveMethod(index);
            }
            else if (keyCode == 27) {
                $scope.alerts = [];
                $scope.getGoalsByEmployee($scope.EmployeeDetail.employeeDetailID);
                $scope.editedRowForms[0].$cancel();
                $scope.editedRowForms = [];
            }
        }

        $scope.saveMethod = function (index) {
            $scope.editedRowForms[0].$save();
            $scope.calculateTotalWeightage();
            //Validation
            if ($scope.Validation(index))
                return;
            $scope.editedRowForms = [];
            $window.onclick = null;
            $scope.saveGoalPeriod(index);
        }

        $scope.focusOutFromRow = function () {

            if ($scope.editedRowForms.length > 0 && $scope.index > -1) {
                $scope.saveMethod($scope.index);
            }
            else {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }

        $scope.Validation = function (index) {
            var flag = false;
            var goal = $scope.goals[index];
            $scope.alerts = [];

            if (goal.Task == undefined || goal.Task.trim() == '') {
                $scope.alerts.push({ type: 'danger', msg: 'Goal is Required Field.' });
                flag = true;
            }

            if (goal.Weightage == undefined || goal.Weightage == null) {
                $scope.alerts.push({ type: 'danger', msg: 'Weightage (%) is Required Field.' });
                flag = true;
            }

            if (goal.Weightage < 0) {
                $scope.alerts.push({ type: 'danger', msg: 'Weightage (%) should be positive value.' });
                flag = true;
            }

            if ($scope.totalWeightage > $scope.constPercentage) {
                $scope.alerts.push({ type: 'danger', msg: 'Total weightage is incorrect. It should be less or equal to 100%.' });
                flag = true;
            }

            if (flag)
                $scope.editedRowForms[0].$show();
            return flag;
        }

        $scope.openDeleteModalPopup = function (index, size) {

            var modalInstance = $modal.open({
                templateUrl: 'modalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    data: function () {
                        return { message: $scope.deleteMessage, index: index };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data.index > -1) {
                    $scope.deleteGoal(data.index);
                }
            }, function () {
                //$scope.alerts.push({ type: 'warning', msg: 'Modal dismissed at: ' + new Date() });
                console.log('');
            });
        }

        $scope.dateSubtract = function (date1) {
            var timestamp1 = new Date(date1).getTime();
            var timestamp2 = new Date().getTime();

            $scope.EmployeeDetail.remainingDays = parseInt((timestamp1 - timestamp2) / (1000 * 60 * 60 * 24), 10) + 1;
        }
       
        //Call functions initially.
        $scope.dateSubtract($scope.EmployeeDetail.endDate);
        $scope.getGoalsByEmployee($scope.EmployeeDetail.employeeDetailID);
    }]);
}());