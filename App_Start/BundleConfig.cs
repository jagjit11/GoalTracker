using System.Web;
using System.Web.Optimization;

namespace GoalTracking
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",                     
                      "~/Scripts/respond.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/angularjs").Include(                     
                     "~/Scripts/angular.js",
                     "~/Scripts/roundProgress.js",
                     "~/Scripts/xeditable.js",
                     "~/Scripts/goalTracking.global.js",
                     "~/Scripts/customAngular/ng.customdirectives.js",
                     "~/Scripts/customAngular/ng.custominterceptor.js",
                      "~/Scripts/customAngular/ng.ajaxrequest.notificationchannel.js"));

            bundles.Add(new ScriptBundle("~/bundles/otherJs").Include(
                   "~/Scripts/moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularui").Include(
                      "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                      "~/Scripts/angular-ui/ui-bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/goalTrackingTaskJs").Include(
                     "~/Scripts/goalTracking.goals.js"));

            bundles.Add(new ScriptBundle("~/bundles/goalTrackingEmployeeDetailJs").Include(
                    "~/Scripts/goalTracking.employeeDetails.js"));

            bundles.Add(new ScriptBundle("~/bundles/goalTrackingModelPopupJs").Include(
                    "~/Scripts/goalTracking.modelPopup.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/bootstrap-theme.css",
                      "~/Content/xeditable.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/circularProgress").Include(
                      "~/Content/circularProgress.css"));

            var lessBundle = new Bundle("~/LessClasses/Less").IncludeDirectory("~/LessClasses", "*.less");
            lessBundle.Transforms.Add(new LessTransform());
            lessBundle.Transforms.Add(new CssMinify());
            bundles.Add(lessBundle);
        }
    }
}
