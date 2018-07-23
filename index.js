export default function (kibana) {

  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/kibana_diagram/diagram'
      ]
    }
  });

}
