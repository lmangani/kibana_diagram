import { uiModules } from 'ui/modules';
import { notify } from 'ui/notify';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';
import { AggTypesBucketsCreateFilterTermsProvider } from 'ui/agg_types/buckets/create_filter/terms';
import { AggTypesBucketsCreateFilterFiltersProvider } from 'ui/agg_types/buckets/create_filter/filters';
import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';

const module = uiModules.get('kibana/kibana_diagram', ['kibana']);

//import the npm modules
const mscgenjs = require("mscgenjs/dist/webpack-issue-5316-workaround");
//const mscgenjs = require('mscgenjs');

// add a controller to the module, which will transform the esResponse into a
// tabular format that we can pass to the table directive
module.controller('KbnDiagramController', function ($scope, $sce, $timeout, Private) {
    var network_id = "svg_" + $scope.$id;
    var loading_id = "loading_" + $scope.$parent.$id;

    const queryFilter = Private(FilterBarQueryFilterProvider);
    const createTermsFilter = Private(AggTypesBucketsCreateFilterTermsProvider);
    const createFilter = Private(AggTypesBucketsCreateFilterFiltersProvider);
    const tabifyAggResponse = Private(AggResponseTabifyProvider);

    $scope.errorCustom = function(message, hide){
      if(!message) message = "General Error. Please undo your changes.";
      if(hide) {
	$("#" + network_id).hide();
      	$("#" + loading_id).hide();
      }
      notify.error(message);
    }

    $scope.initialShows = function(){
      $("#net").show();
      $("#loading").show();
      $("#errorHtml").hide();
    }

    $scope.doneLoading = function(){
      $("#net").show();
      $("#loading").hide();
      $("#errorHtml").hide();
    }

    $scope.$parent.$watchMulti(['esResponse', 'vis.params.secondNodeColor'], function ([resp, secondNodeColor]) {
	if (resp && $scope.vis ) {
	  var rawResponse = $scope.vis.aggs.toDsl();
          $timeout(function () {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////NODE-NODE-RELATION Type///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if($scope.vis.aggs.bySchemaName['first'].length >= 1){

	        if (popupMenu !== undefined) {
		    popupMenu.parentNode.removeChild(popupMenu);
		    popupMenu = undefined;
		}

		try {
			$scope.tableGroups = resp;
			console.log('tableGroups ready! Scope is:',$scope);

		} catch(e) {
			$scope.errorCustom('tabifyAggResponse error! '+ e); 
		}

//////////////// BUCKET SCANNER ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		try {
			$scope.processTableGroups($scope.tableGroups);

		} catch(e) {
	                $scope.errorCustom('OOps! Aggs to Graph error: '+e);

		}
//////////////////////////////////////////////////////////Creation of Diagram Flows //////////////////////////////////////////////////////////

                // Creation of the network
                var container = document.getElementById(network_id);
                //Set the Height
                container.style.height = container.getBoundingClientRect().height;
                container.height = container.getBoundingClientRect().height;

                $scope.initialShows();
                $(".secondNode").hide();
		// START quence stuff!

		mscgenjs.renderMsc (
		  'msc { a,b; a=>>b[label="render this"; }',
		  {
		    elementId: network_id,
		    additionalTemplate: "lazy",
                    mirrorEntitiesOnBottom: true
		  },
		  handleRenderMscResult
		);

		function handleRenderMscResult(pError, pSuccess) {
		  if (Boolean(pError)){
		    if (pError) $scope.errorCustom('msc error: '+ pError);
		    else $scope.doneLoading();
		    return;
		  }
		}
		// END quence stuff

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }else{
		$scope.errorCustom('Error: Please select at least one Node',1);
            }

	  // $timeout tail
	  });
        }
    });
});
