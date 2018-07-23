import { uiModules } from 'ui/modules';
import { notify } from 'ui/notify';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';
import { AggTypesBucketsCreateFilterTermsProvider } from 'ui/agg_types/buckets/create_filter/terms';
import { AggTypesBucketsCreateFilterFiltersProvider } from 'ui/agg_types/buckets/create_filter/filters';
import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';

const module = uiModules.get('kibana/kibana_diagram', ['kibana']);

const mscgenjs = require("mscgenjs/dist/webpack-issue-5316-workaround");

module.controller('KbnDiagramController', function ($scope, $sce, $timeout, Private) {
    var network_id = "diagram_" + $scope.$id;
    var svg_id = "mscgenjsdiagram_" + $scope.$id;

    const queryFilter = Private(FilterBarQueryFilterProvider);
    const createTermsFilter = Private(AggTypesBucketsCreateFilterTermsProvider);
    const createFilter = Private(AggTypesBucketsCreateFilterFiltersProvider);
    const tabifyAggResponse = Private(AggResponseTabifyProvider);

    $scope.errorCustom = function(message, hide){
      if(!message) message = "General Error. Please undo your changes.";
      if(hide) {
	$("#" + network_id).hide();
      }
      notify.error(message);
    }

    $scope.initialShows = function(){
      $("#net").show();
      $("#errorHtml").hide();
    }

    $scope.doneLoading = function(){
      $("#net").show();
      $("#errorHtml").hide();
    }

    $scope.$parent.$watchMulti(['esResponse', 'vis.params.secondNodeColor'], function ([resp, secondNodeColor]) {
	if (resp && $scope.vis ) {
	  var rawResponse = $scope.vis.aggs.toDsl();
          $timeout(function () {

            if($scope.vis.aggs.bySchemaName['first'].length >= 1){

		try {
			$scope.tableGroups = resp;
			$scope.mscScript = '';
			console.log('tableGroups ready! Scope is:',$scope);
			if (!$scope.tableGroups.tables && !$scope.tableGroups.tables[0].rows) return;
			$scope.tableGroups.tables[0].rows.forEach(function(row){
				var tmp = '';
				var t = 0;
				var columns = $scope.tableGroups.tables[0].columns.length;
				for(t=0;t<columns;t++){
					if(t % 2 === 0) {
					  if (row[t+2]) tmp+=row[t].value+'=>>';
					  else tmp+=row[t]+':'+row[t+1].value+';';
					}
				}
				$scope.mscScript+=tmp;
			});
			console.log('mscgenny ready! script is:', $scope.mscScript);

		} catch(e) {
			$scope.errorCustom('tabifyAggResponse error! '+ e);
		}

                // Prep containers
                var container = document.getElementById(network_id);
                container.style.height = container.getBoundingClientRect().height;
                container.height = container.getBoundingClientRect().height;
		// Cleanup any existing diagram
                var svg = document.getElementById(svg_id);
		if (svg) svg.remove();

                $scope.initialShows();
                $(".secondNode").hide();

		mscgenjs.renderMsc (
		  $scope.mscScript || 'null;',
		  {
		    elementId: network_id,
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

            }else{
		$scope.errorCustom('Error: Please select at least one Node',1);
            }

	  // $timeout tail
	  });
        }
    });
});
