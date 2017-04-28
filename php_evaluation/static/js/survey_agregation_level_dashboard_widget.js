odoo.define('agregation_level_dashboard', function(require) {
    'use strict';

    var kanban_widgets = require('web_kanban.widgets');

    var AgregationLevelDashboardGraph = kanban_widgets.AbstractField.extend({
        start: function() {
            this.graph_type = this.$node.attr('graph_type');
            this.data = JSON.parse(this.field.raw_value);
            console.table(this.data);
            this.display_graph();
            return this._super();
        },

        display_graph: function() {

            var self = this;
            for (var i = 0; i < self.data.length; i++)
                nv.addGraph(function() {
                    console.log("data [i]" + i);
                    console.log(self.data[i - 1]);
                    self.$svg = self.$el.append('<svg>');
                    self.chart = nv.models.gaugeChart()
                        .min(0)
                        .max(1000)
                        .zoneLimit1(0.25)
                        .zoneLimit2(0.50)
                        .zoneLimit3(0.75)
                        .zoneLimit4(1);
                    self.chart.options({
                        delay: 250,
                        transition: 100,
                        color: d3.scale.category10().range()
                    });
                    if (i - 1 == 0)
                        d3.select(self.$el.find('svg')[0])
                        .datum([self.data[0].values[i].value])
                        .transition().duration(1200)
                        .call(self.chart);
                    else
                        d3.append(self.$el.find('svg')[0])
                        .datum([self.data[0].values[i].value])
                        .transition().duration(1200)
                        .call(self.chart);

                });


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


    kanban_widgets.registry.add('agregation_level_dashboard', AgregationLevelDashboardGraph);

});