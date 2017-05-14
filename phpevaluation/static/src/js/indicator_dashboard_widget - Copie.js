odoo.define('indicateur_dashboard', function(require) {
    'use strict';

    var kanban_widgets = require('web_kanban.widgets');

    var AgregationLevelDashboardGraph = kanban_widgets.AbstractField.extend({
        start: function() {
            //alert("Test existance 01");
            this.graph_type = this.$node.attr('graph_type');
            this.data = JSON.parse(this.field.raw_value);
            //console.log(this.field.raw_value);
            console.table(this.data);
            //this.data.append({ 'value': 100.0 })
            this.display_graph();
            return this._super();
        },

        display_graph: function() {

            var self = this;
            //self.svg = d3.select(self.$el.find('svg')[0])
            //self.svg = d3.select(this.$el).append('svg');
            //self.$svg = self.$el.append('<svg>');
            //alert("vals " + self.data[0].values[0].value);
            var table = document.createElement("table");
            var line = document.createElement("tr");
            //self.$el.append('<svg>')

            for (var i = 0; i < 1; i++) {
                var column = document.createElement("td");
                var svg = document.createElement("svg");
                nv.addGraph((function(svg, line) {

                    self.chart = nv.models.gaugeChart()
                        .min(0)
                        .max(1000)
                        .zoneLimit1(0.25)
                        .zoneLimit2(0.50)
                        .zoneLimit3(0.75)
                        .zoneLimit4(1);

                    //var legend_right = config.device.size_class > config.device.SIZES.XS;
                    //option//
                    self.chart.options({
                        delay: 250,
                        transition: 100,
                        //showLegend: legend_right || _.size(dataSize) <= MAX_LEGEND_LENGTH,
                        color: d3.scale.category10().range()
                    });

                    //self.$el.find('svg')[0] 
                    d3.select(svg)
                        .datum([self.data[0].values[0].value])
                        .transition().duration(1200)
                        .call(self.chart);
                    //column.append(svg);
                    //line.append(column);



                })(svg, line));
                //self.$el.find('svg')[0]

                /* if (i % 2 == 0) {
                     table.append(line);
                     line = document.createElement("tr");
                 }*/

            }
            var tabl = document.createElement("table");
            var di = document.createElement("div");
            di.append(svg);
            tabl.append(di);
            self.$svg = self.$el.append(tabl);


            var tt = document.createElement("svg");
            tt.append(table);
            //self.$svg = self.$el.append(tt);
            //$(".oe_kanban_color_0.o_kanban_record").attr("width", "500");



            //var svg = d3.select(this.$el[0]).append('svg');
            //self.svg.datum([100]);
            //self.svg.transition().duration(100);
            //self.chart(self.svg);
            // self.svg.datum([100]).transition().duration(1200).call(self.chart);




            //  this.to_remove = self.chart.update;
            //nv.utils.onWindowResize(self.chart.update);
            //return chart;
            //nv.addGraph(self.chart);
            //return self.chart;

            /* var svg = d3.select(self.$el.find('svg')[0]);
             svg.datum(self.data)
                 .transition().duration(1200);
             //.call(self.chart);
             chart(svg);
             self.customize_chart();

             nv.utils.windowResize(self.on_resize);*/

        },

        on_resize: function() {
            this.chart.update();
            //this.customize_chart();
        },

        customize_chart: function() {
            if (this.graph_type === 'bar') {
                // Add classes related to time on each bar of the bar chart
                var bar_classes = _.map(this.data[0].values, function(v, k) { return v.type });

                _.each(this.$('.nv-bar'), function(v, k) {
                    // classList doesn't work with phantomJS & addClass doesn't work with a SVG element
                    $(v).attr('class', $(v).attr('class') + ' ' + bar_classes[k]);
                });
            }
        },

        destroy: function() {
            nv.utils.offWindowResize(this.on_resize);
            this._super();
        },

    });


    kanban_widgets.registry.add('indicateur_dashboard_graph', AgregationLevelDashboardGraph);

});