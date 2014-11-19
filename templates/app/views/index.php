<!DOCTYPE doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
    <head>
        <meta charset="utf-8">
            <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
                <meta content="width=device-width, initial-scale=1.0" name="viewport">
                    <title>
                        Api/v1
                    </title>
                    <link href="css/app.css" rel="stylesheet"/>
                    <link href="css/vendor.css" rel="stylesheet"/>
                </meta>
            </meta>
        </meta>
    </head>
    <body data-custom-background="" data-off-canvas-nav="" id="app" ng-app="<%= baseName %>">
        <!--[if lt IE 9]><p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p><![endif]-->
        <div data-ng-controller="AppCtrl">
            <div class="no-print" data-ng-cloak="" data-ng-hide="isHide()">
                <section class="top-header" data-ng-include="'views/header.html'" id="header">
                </section>
                <aside data-ng-include="'views/nav.html'" id="nav-container">
                </aside>
            </div>
            <div ng-include="'views/flash.html'">
            </div>
            <div class="view-container">
                <section class="animate-fade-up" data-ng-view="" id="content">
                </section>
            </div>
        </div>
    </body>
    <script src="js/vendor.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/app.js"></script>
    <script>angular.module("<%= baseName %>").constant("CSRF_TOKEN", "<?php echo csrf_token(); ?>");</script>
</html>