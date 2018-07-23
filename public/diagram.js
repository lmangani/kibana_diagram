import 'plugins/kibana_diagram/diagram.less'
import 'plugins/kibana_diagram/diagram_controller'

import 'ui/agg_table'
import 'ui/agg_table/agg_table_group'

import { CATEGORY } from 'ui/vis/vis_category'
import { VisFactoryProvider } from 'ui/vis/vis_factory'
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas'
import { VisTypesRegistryProvider } from 'ui/registry/vis_types'
import image from './images/icon-network.svg'
import networkVisTemplate from 'plugins/kibana_diagram/diagram.html'
import networkVisParamsTemplate from 'plugins/kibana_diagram/diagram_params.html'

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(NetworkVisTypeProvider)

// define the TableVisType
function NetworkVisTypeProvider (Private) {
  const VisFactory = Private(VisFactoryProvider)
  const Schemas = Private(VisSchemasProvider)

  // return the visType object, which kibana will use to display and configure new
  // Vis object of this type.
  return VisFactory.createAngularVisualization({
    name: 'diagram',
    title: 'Diagram',
    image,
    description: 'Displays flow diagrams from query results',
    category: CATEGORY.OTHER,

    visConfig: {
      defaults: {
        showLabels: true,
        showPopup: false,
        nodeFilter: false,
        hideEdgesOnDrag: false,
        showColorLegend: true,
        nodePhysics: true,
        firstNodeColor: '#FD7BC4',
        secondNodeColor: '#00d1ff',
        canvasBackgroundColor: '#FFFFFF',
        shapeFirstNode: 'dot',
        shapeSecondNode: 'box',
        displayArrow: false,
        posArrow: 'to',
        shapeArrow: 'arrow',
        smoothType: 'continuous',
        scaleArrow: 1,
        maxCutMetricSizeNode: 5000,
        maxCutMetricSizeEdge: 5000,
        minCutMetricSizeNode: 0,
        maxNodeSize: 80,
        minNodeSize: 8,
        maxEdgeSize: 20,
        minEdgeSize: 0.1,
        springConstant: 0.001,
        gravitationalConstant: -35000,
        labelColor: '#000000'
      },
      template: networkVisTemplate
    },
    editorConfig: {
      optionsTemplate: networkVisParamsTemplate,
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'size_node',
          title: 'Node Size',
          mustBeFirst: 'true',
          max: 1
        },
        {
          group: 'buckets',
          name: 'first',
          icon: 'fa fa-circle-thin',
          mustBeFirst: 'true',
          title: 'Node',
          min: 2,
          aggFilter: ['terms']// Only have sense choose terms
        }
      ])
    },
    responseHandlerConfig: {
      asAggConfigResults: true
    },
    hierarchicalData: function (vis) {
      return true
    }

  })
}

export default NetworkVisTypeProvider
