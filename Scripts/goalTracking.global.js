var app = angular.module('goalTrackingApp', ['angular-svg-round-progress', 'xeditable', 'ui.bootstrap', 'ui.bootstrap.tpls']);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});