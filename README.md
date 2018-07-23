<img width=100 border=1 src="https://user-images.githubusercontent.com/1423657/43099944-1483f2f6-8ec4-11e8-98ac-916bdcebc7d0.png"/>

## Kibana Diagram

Kibana plugin to Visualize aggregations diagrams using [mscgen](https://mscgen.js.org) for rendering.

<img width=300 src="https://user-images.githubusercontent.com/1423657/43055683-440d4efa-8e38-11e8-9367-44e484e7bf90.png"/>

### Create Kibana Plugin Release _(zip)_
Adjust the Kibana version in `package.json` or `release.sh` before execution:
```
./release.sh
```
### Install a GIT Release _(adjust version)_ 
Each branch contains a `dist` folder with installable versions of the plugin, ie:
```
kibana-plugin install https://github.com/lmangani/kibana_diagram/raw/master/dist/kibana_diagram-6.2.4.zip
```
----

### Usage
* Choose an index
* Select a cascading set of 2+ Terms aggregations
* Hit Play

The plugin will automatically display a diagram with relations derived from the returned aggregations.

![ezgif com-optimize 16](https://user-images.githubusercontent.com/1423657/43084057-3444292a-8e98-11e8-947b-edc2db3cbe9b.gif)

### Status
- This plugin is *experiemental* - use at your own risk!
- Contributors are welcome! Join us make this into something useful!
#### TODO
- [x] Implement Agg to Diagram baseline
- [ ] Deep Test & Debug
- [ ] Implement colors in msc
- [ ] Implement links in msc
- [ ] Implement non-aggregated view

### Acknowledgement

Elasticsearch and Kibana are trademarks of Elasticsearch BV, registered in the U.S. and in other countries.


