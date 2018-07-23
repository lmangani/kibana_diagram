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
    var network_id = "diagram_" + $scope.$id;
    var svg_id = "svg_" + $scope.$id;
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

		try {
			$scope.tableGroups = resp;
			console.log('tableGroups ready! Scope is:',$scope);
			$scope.mscScript = '';
			if (!$scope.tableGroups.tables && !$scope.tableGroups.tables[0].rows) return false;
			$scope.tableGroups.tables[0].rows.forEach(function(row){
				var tmp;
				var columns = $scope.tableGroups.tables[0].columns.length;
				for(t=0;t<columns;t++){
					if(t % 2 === 0) {
					  if (row[t+2] tmp+=row[t].value+'=>>';
					  else tmp+=row[t]+':'+row[t+1].value+';';
					}
				}
				$scope.mscScript+=tmp;
			});
			console.log('mscgenny ready! script is:', $scope.mscScript);

		} catch(e) {
			$scope.errorCustom('tabifyAggResponse error! '+ e);
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
		  $scope.mscScript || 'a=>>b:render this;',
		  {
		    elementId: svg_id,
		    inputType: "msgenny",
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
