<img width=222 src="https://user-images.githubusercontent.com/1423657/35244908-15f41bd4-ffc2-11e7-9303-9a87a271d67a.png"/>

## Kibana Diagram

Kibana plugin to Visualize aggregations diagrams using [mscgen](https://mscgen.js.org) for rendering.

<img width=400 src="https://user-images.githubusercontent.com/1423657/43055683-440d4efa-8e38-11e8-9367-44e484e7bf90.png"/>

### Create Kibana Plugin archive (zip)
```
./release.sh
```

### Usage
* Choose an index
* Select a cascading set of 2+ Terms aggregations
* Hit Play

The plugin will automatically display a diagram with relations derived from the returned aggregations.

![ezgif com-optimize 2](https://user-images.githubusercontent.com/1423657/43073006-548fc254-8e78-11e8-8005-38b1aa55d66c.gif)

### Status
- This plugin is *experiemental* - use at your own risk!
- Contributors are welcome! Join us make this into something useful!
#### TODO
- [ ] Deep Test & Debug
- [ ] Implement colors in msc
- [ ] Implement links in msc
- [ ] Implement non-aggregated view

### Acknowledgement

Elasticsearch and Kibana are trademarks of Elasticsearch BV, registered in the U.S. and in other countries.


