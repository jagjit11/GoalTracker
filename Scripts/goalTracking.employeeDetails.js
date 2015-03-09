(function () {
    app.controller("employeeDetailController", ['$scope', "$http", "$window", "$modal", function ($scope, $http, $window, $modal) {

        $scope.virtualDir = virtualDir;
        $scope.employeeDetails = [];
        $scope.editedRowForms = [];
        $scope.alerts = [];
        $scope.baseUrl = 'api/EmployeeDetails';
        $scope.employeeGoalUrl = $scope.virtualDir + 'Home/Tasks';
        $scope.deleteMessage = "Do you want to delete this record?";
        $scope.index = -1;


        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        //Add Employee.
        $scope.addEmployeeDetail = function () {

            var flag = false;
            $.each($scope.employeeDetails, function (index, value) {
                if (value.ID == 0) {
                    flag = true;
                    return;
                }
            });

            if (!flag)
                $scope.employeeDetails.push({
                    ID: 0,
                    EmployeeName: '',
                    EmployeeCode: '',
                    StartDate: new Date(),
                    EndDate: new Date(),
                    IsActive: true,
                    IsDeleted: false,
                    CreatedBy: 'Admin',
                    CreatedDate: new Date()
                });
        }

        //Get employee list.
        $scope.getAllEmployeeDetails = function () {
            $http.get($scope.baseUrl).success($scope.callbackGetAll).error($scope.callbackGetError);
        }
        //Callback for get all employee details.
        $scope.callbackGetAll = function (data) {
            var newEmpDetailRow = null;
            var updateInactiveRecord = [];
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    var startDate = new Date(value.StartDate);
                    var endDate = new Date(value.EndDate);

                    value.StartDate = startDate;
                    value.EndDate = endDate;

                    value.FilterStartDate = moment(startDate).format("DD/MM/YYYY");
                    value.FilterEndDate = moment(endDate).format("DD/MM/YYYY");

                    if ($scope.dateSubtract(value.EndDate) <= 0 && value.IsActive == true) {
                        value.IsActive = false;
                        updateInactiveRecord.push(value);
                    }
                });
                if ($scope.employeeDetails.length > data.length)
                    newEmpDetailRow = $scope.employeeDetails[$scope.employeeDetails.length - 1];
                $scope.employeeDetails = data;

                if (newEmpDetailRow != null)
                    $scope.employeeDetails.push(newEmpDetailRow);

                if (updateInactiveRecord.length > 0)
                    $scope.updateInactiveEmployeeDetail(updateInactiveRecord);
            }
            else
                $scope.employeeDetails = [];
            $scope.index = -1;
        }
        //Error
        $scope.callbackGetError = function (errorData) {
            $scope.employeeDetails = [];
        }

        //Save newly created employee detail.
        $scope.saveEmployeeDetail = function (index) {
            var employeeData = $scope.employeeDetails[index];

            if (parseInt(employeeData.ID, 10) > 0)
                $http.put($scope.baseUrl + "/" + employeeData.ID, employeeData).success($scope.callbackSave);
            else
                $http.post($scope.baseUrl, employeeData).success($scope.callbackSave);
        }
        //Callback for save
        $scope.callbackSave = function (data) {
            $scope.alerts = [];
            $scope.alerts.push({ type: 'success', msg: 'Member Detail saved successfully !!!' });
            $scope.getAllEmployeeDetails();
        }

        //Update inactive employee detail.
        $scope.updateInactiveEmployeeDetail = function (list) {

            $.each(list, function (index, value) {
                $http.put($scope.baseUrl + "/" + value.ID, value);
            });
        }     

        //Delete existing employee detail.
        $scope.deleteEmployee = function (index) {
            var employeeData = $scope.employeeDetails[index];

            if (parseInt(employeeData.ID, 10) > 0)
                $http.delete($scope.baseUrl + "/" + employeeData.ID).success($scope.callbackDelete);
            else
                $scope.employeeDetails.splice(index, 1);
        }
        //Callback for delete.
        $scope.callbackDelete = function (data) {
            $scope.employeeDetails = [];
            $scope.getAllEmployeeDetails();
        }

        //Call Goal List of Employee.
        $scope.getTaskList = function (index) {
            var employeeData = $scope.employeeDetails[index];
            $window.location.href = $scope.employeeGoalUrl + "/" + employeeData.ID;
        }

        //Show or hide editable row.
        $scope.editRow = function (rowform, index) {

            if ($scope.index > -1)
                return $scope.Validation($scope.index);

            $window.onclick = null;
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
                $scope.getAllEmployeeDetails();
                $scope.editedRowForms[0].$cancel();
                $scope.editedRowForms = [];
            }
        }

        $scope.saveMethod = function (index) {
            $scope.editedRowForms[0].$save();
            if ($scope.Validation(index))
                return;
            $scope.editedRowForms = [];
            $window.onclick = null;
            $scope.saveEmployeeDetail(index);
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
            var empDetail = $scope.employeeDetails[index];
            $scope.alerts = [];

            if (empDetail.EmployeeCode == undefined || empDetail.EmployeeCode.trim() == '') {
                $scope.alerts.push({ type: 'danger', msg: 'Member Code is Required Field.' });
                flag = true;
            }
            else if (empDetail.EmployeeCode.length > 20) {
                $scope.alerts.push({ type: 'danger', msg: 'Length of Member Code must be less than or equal to 20.' });
                flag = true;
            }

            if (empDetail.EmployeeName == undefined || empDetail.EmployeeName.trim() == '') {
                $scope.alerts.push({ type: 'danger', msg: 'Member Name is Required Field.' });
                flag = true;
            }
            else if (empDetail.EmployeeName.length > 100) {
                $scope.alerts.push({ type: 'danger', msg: 'Length of Member Name must be less than or equal to 100.' });
                flag = true;
            }

            if (empDetail.StartDate == '' || empDetail.StartDate == undefined) {
                $scope.alerts.push({ type: 'danger', msg: 'Goal Start Date is Required Field.' });
                flag = true;
            }

            if (empDetail.EndDate == '' || empDetail.EndDate == undefined) {
                $scope.alerts.push({ type: 'danger', msg: 'Goal End Date is Required Field.' });
                flag = true;
            }

            if (empDetail.StartDate > empDetail.EndDate) {
                $scope.alerts.push({ type: 'danger', msg: 'Goal Start Date must be less than Goal End Date.' });
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
                    $scope.deleteEmployee(data.index);
                }
            }, function () {
                //$scope.alerts.push({ type: 'warning', msg: 'Modal dismissed at: ' + new Date() });
            });
        }

        $scope.dateSubtract = function (date1) {
            var timestamp1 = new Date(date1).getTime();
            var timestamp2 = new Date().getTime();

            return parseInt((timestamp1 - timestamp2) / (1000 * 60 * 60 * 24), 10) + 1;
        }

        //Call functions initially.
        $scope.getAllEmployeeDetails();
    }]);
}());