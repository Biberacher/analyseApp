// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','elastic.js.IO', 'elastic.js.directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
  .controller('MainCtrl', function($scope,$Atlas) {

    $Atlas.get("http://localhost:8080/").then(function(atlas) {
      var nhs = new NonHidingStyle();
      nhs.fillColor = "#87CEEB";
      var constantLayer = atlas.layerConfig("constant", "IS Layer");
      constantLayer.trueStyle = nhs;
      constantLayer.commit();

      var tableViewpoint = atlas.viewpointConfig("table", "Testtabelle");
      var st = atlas.metamodel.findStructuredType("InformationSystem");
      tableViewpoint.structuredType = st;
      var nameProperty = st.findFeature("name");
      var stateOfHealthProperty = st.findFeature("State_32_of_32_health");
      var statusProperty = st.findFeature("typeOfStatus");
      tableViewpoint.addColumn(nameProperty);
      tableViewpoint.addColumn(stateOfHealthProperty);
      tableViewpoint.addColumn(statusProperty);

      var layerEmbedding = new LayerEmbedding(tableViewpoint, constantLayer);

      tableViewpoint.commit();
      $scope.tableViewpoint = tableViewpoint;

      $scope.addCostCol = function(){
        var st = atlas.metamodel.findStructuredType("InformationSystem");
        var viewpoint =  atlas.getViewpointByName("Testtabelle");
        var costProperty = st.findFeature("Costs");
        viewpoint.addColumn(costProperty);
        viewpoint.commit();
      }

      $scope.removeCol = function(){
        var viewpoint =  atlas.getViewpointByName("Testtabelle");
        var lastCol = viewpoint.columns[viewpoint.columns.length - 1];
        viewpoint.removeColumn(lastCol);
        viewpoint.commit();
      }

      $scope.addLayer = function(){
        var nhs = new NonHidingStyle();
        nhs.fillColor = "#deb887";
        var constantLayer = atlas.layerConfig("constant", "New Layer");
        constantLayer.trueStyle = nhs;
        constantLayer.commit();

        var viewpoint =  atlas.getViewpointByName("Testtabelle");
        var layerEmbedding = new LayerEmbedding(viewpoint, constantLayer);
      }

      $scope.removeLayer = function(){
        var viewpoint =  atlas.getViewpointByName("Testtabelle");
        var le = viewpoint._layerEmbeddings[0];
        le.destroy();
      }


      var histogramViewpoint = atlas.viewpointConfig("histogram", "Processes");
      var st = atlas.metamodel.findStructuredType("BusinessProcess");
      histogramViewpoint.structuredType = st;
      var nameProp = st.findFeature("name");
      histogramViewpoint.displayProperty = nameProp;
      var strategicProp = st.findFeature("Strategic_32_value");
      histogramViewpoint.valueProperty = strategicProp;
      histogramViewpoint.commit();

      var histoStyle = new NonHidingStyle();
      histoStyle.fillColor = "#808000";
      var histoLayer = atlas.layerConfig("constant", "Histogram Layer");
      histoLayer.trueStyle = histoStyle;
      histoLayer.commit();

      var le = new LayerEmbedding(histogramViewpoint, histoLayer);

      $scope.histogramViewpoint = histogramViewpoint;
    });
  })
