nv.models.gauge = function() {
    "use strict";

    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = {top: 0, right: 0, bottom: 0, left: 0}
        , width = 500
        , height = 500
        , id = Math.floor(Math.random() * 10000) //Create semi-unique ID in case user doesn't select one
        , color = nv.utils.getColor(['#88ac67', '#f78f20', '#db4e4e','#ff0000'])
        , valueFormat = d3.format(',.2f')
        , title = false
        , showMinMaxLabels = true
        , min = 0
        , max = 100
        , zoneLimit1 = 0.25
        , zoneLimit2 = 0.50
        , zoneLimit3 = 0.75
        , zoneLimit4 = 1
        , dispatch = d3.dispatch('chartClick', 'renderEnd')
        ;


    //============================================================
    // chart function
    //------------------------------------------------------------

    var renderWatch = nv.utils.renderWatch(dispatch);

    function chart(selection) {

        renderWatch.reset();

        if (typeof selection != 'undefined' && selection != null) 
	        selection.each(function(data) {
	            var availableWidth = width - margin.left - margin.right
	                , availableHeight = height - margin.top - margin.bottom
	                , container = d3.select(this)
	                ;

	            var cx = availableWidth / 2;
	            var cy = availableHeight / 2;

	            nv.utils.initSVG(container);

	            var radius = Math.min(availableWidth, availableHeight) / 2;
	            var range = max - min;
	            var fontSize = Math.round(Math.min(availableWidth, availableHeight) / 9);

	            var zones = [
	                { from: min, to: min + range * zoneLimit1 },
	                { from: min + range * zoneLimit1, to: min + range * zoneLimit2 },
	                { from: min + range * zoneLimit2, to: min + range * zoneLimit3 },
	                { from: min + range * zoneLimit3, to: min + range * zoneLimit4 }
	            ];

	            // Setup containers and skeleton of chart
	            var wrap = container.selectAll('.nv-wrap.nv-gauge').data([data]);
	            var wrapEnter = wrap.enter().append('g').attr('class','nvd3 nv-wrap nv-gauge nv-chart-' + id);
	            var gEnter = wrapEnter.append('g');
	            var g_bands = gEnter.append('g').attr('class', 'nv-gaugeBands');
	            var g_title = gEnter.append('g').attr('class', 'nv-gaugeTitle');
	            var g_needle = gEnter.append('g').attr('class', 'nv-gaugeNeedle');
	            var g_label = gEnter.append('g').attr('class', 'nv-gaugeLabel');
	            var g_minLabel = gEnter.append('g').attr('class', 'nv-gaugeMinLabel');
	            var g_maxLabel = gEnter.append('g').attr('class', 'nv-gaugeMaxLabel');

	            wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	            // draw gauge bands
	            for (var i in zones) {
	                drawBand(zones[i].from, zones[i].to, color(i), min, max, radius, g_bands);
	            }

	            // draw needle
	            var needlePath = buildNeedlePath(data[0][0], range, cx, cy, min, max, radius);

	            var needleLine = d3.svg.line()
	                .x(function(d) { return d.x; })
	                .y(function(d) { return d.y; })
	                .interpolate("basis");

	            g_needle.append("path")
	                .data([needlePath])
	                .attr("d", needleLine);

	            g_needle.append('circle')
	                .attr('cx', 0)
	                .attr('cy', 0)
	                .attr('r', 0.115 * radius);

	            wrap.selectAll('.nv-gaugeBands path')
	                .attr("transform", function () { return "translate(" + cx + ", " + (cy - 0.08 * radius) + ") rotate(270)" });

	            wrap.select('.nv-gaugeNeedle')
	                .attr('transform', 'translate(' + cx + ',' + (cy - 0.08 * radius) + ')');

	            wrap.select('.nv-gaugeTitle')
	                .attr('transform', 'translate(' + cx + ',' + (cy / 2 + fontSize / 2) + ')');

	            wrap.select('.nv-gaugeLabel')
	                .attr('transform', 'translate(' + cx + ',' + (cy + radius / 2 - fontSize * 0.9) + ')');

	            if (showMinMaxLabels) {
	                wrap.select('.nv-gaugeMinLabel')
	                    .attr('transform', 'translate(' + (cx - radius / 2.6 - fontSize * 0.9) + ',' + (cy + radius / 1.35 - fontSize * 0.9) + ')');

	                wrap.select('.nv-gaugeMaxLabel')
	                    .attr('transform', 'translate(' + (cx + radius / 1.25 - fontSize * 0.9) + ',' + (cy + radius / 1.35 - fontSize * 0.9) + ')');
	            }

	            // draw title
	            if (title) {
	                g_title.append("text")
	                    .attr("dy", fontSize / 2)
	                    .attr("text-anchor", "middle")
	                    .text(title)
	                    .style("font-size", fontSize + "px");
	            }

	            // draw value
	            g_label.append("text")
	                .data(data)
	                .attr("dy", fontSize / 2)
	                .attr("text-anchor", "middle")
	                .text(valueFormat)
	                .style("font-size", fontSize*0.9 + "px");

	            if (showMinMaxLabels) {
	                g_minLabel.append("text")
	                    .data(data)
	                    .attr("dy", fontSize / 2)
	                    .attr("text-anchor", "start")
	                    .text(valueFormat(min))
	                    .style("font-size", fontSize*0.45 + "px");

	                g_maxLabel.append("text")
	                    .data(data)
	                    .attr("dy", fontSize / 2)
	                    .attr("text-anchor", "end")
	                    .text(valueFormat(max))
	                    .style("font-size", fontSize*0.45 + "px");
	            }

	            container.on('click', function(d,i) {
	                dispatch.chartClick({
	                    data: d,
	                    index: i,
	                    pos: d3.event,
	                    id: id
	                });
	            });

	            // draws a gauge band
	            function drawBand(start, end, color, min, max, radius, element) {
	                if (0 >= end - start) return;

	                element.append("path")
	                    .style("fill", color)
	                    .attr("d", d3.svg.arc()
	                        .startAngle(valueToRadians(start, min, max))
	                        .endAngle(valueToRadians(end, min, max))
	                        .innerRadius(0.65 * radius)
	                        .outerRadius(0.85 * radius))
	                    .attr("transform", function() { return "translate(" + radius + ", " + radius + ") rotate(270)" });
	            }

	            function buildNeedlePath(value, range, cx, cy, min, max, radius) {
	                if (value > max) {
	                    value = max;
	                }

	                var delta = range / 1;
	                var tailValue = value - (range * (1/(270/360)) / 2);

	                var head = centerPoint(valueToPoint(value, 0.8, min, max, radius), cx, cy);
	                var head1 = centerPoint(valueToPoint(value - delta, 0.12, min, max, radius), cx, cy);
	                var head2 = centerPoint(valueToPoint(value + delta, 0.12, min, max, radius), cx, cy);

	                var tail = centerPoint(valueToPoint(tailValue, 0, min, max, radius), cx, cy);
	                var tail1 = centerPoint(valueToPoint(tailValue - delta, 0.12, min, max, radius), cx, cy);
	                var tail2 = centerPoint(valueToPoint(tailValue + delta, 0.12, min, max, radius), cx, cy);

	                function centerPoint(point, cx, cy) {
	                    point.x -= cx;
	                    point.y -= cy;
	                    return point;
	                }

	                return [head, head1, tail2, tail, tail1, head2, head];
	            }

	            function valueToDegrees(value, min, max) {
	                range = max - min;
	                return value / range * 270 - (min / range * 270 + 45);
	            }

	            function valueToRadians(value, min, max) {
	                return valueToDegrees(value, min, max) * Math.PI / 180;
	            }

	            function valueToPoint(value, factor, min, max, radius) {
	                return {
	                    x: cx - radius * factor * Math.cos(valueToRadians(value, min, max)),
	                    y: cy - radius * factor * Math.sin(valueToRadians(value, min, max))
	                };
	            }
	        });
		nv.utils.onWindowResize(chart.update)
        renderWatch.renderEnd('gauge immediate');
        return chart;
    }

    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = dispatch;
    chart.options = nv.utils.optionsFunc.bind(chart);

    chart._options = Object.create({}, {
        // simple options, just get/set the necessary values
        width:      {get: function(){return width;}, set: function(_){width=_;}},
        height:     {get: function(){return height;}, set: function(_){height=_;}},
        title:      {get: function(){return title;}, set: function(_){title=_;}},
        showMinMaxLabels:    {get: function(){return showMinMaxLabels;}, set: function(_){showMinMaxLabels=_;}},
        valueFormat:    {get: function(){return valueFormat;}, set: function(_){valueFormat=_;}},
        id:         {get: function(){return id;}, set: function(_){id=_;}},
        min:         {get: function(){return min;}, set: function(_){min=_;}},
        max:         {get: function(){return max;}, set: function(_){max=_;}},
        zoneLimit1: {get: function(){return zoneLimit1;}, set: function(_){zoneLimit1=_;}},
        zoneLimit2: {get: function(){return zoneLimit2;}, set: function(_){zoneLimit2=_;}},
        zoneLimit3: {get: function(){return zoneLimit3;}, set: function(_){zoneLimit3=_;}},
        zoneLimit4: {get: function(){return zoneLimit4;}, set: function(_){zoneLimit4=_;}},

        // options that require extra logic in the setter
        margin: {get: function(){return margin;}, set: function(_){
            margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
            margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
            margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
            margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
        }},
        color: {get: function(){return color;}, set: function(_){
            color=nv.utils.getColor(_);
        }}
    });

    nv.utils.initOptions(chart);
    return chart;
};


nv.models.gaugeChart = function() {
    "use strict";

    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var gauge = nv.models.gauge();

    var margin = {top: 0, right: 0, bottom: 0, left: 0}
        , width = null
        , height = null
        , color = nv.utils.defaultColor()
        , noData = null
        , dispatch = d3.dispatch('renderEnd')
        ;

    //============================================================
    // Chart function
    //------------------------------------------------------------

    var renderWatch = nv.utils.renderWatch(dispatch);

    function chart(selection) {
        renderWatch.reset();
        renderWatch.models(gauge);
        if (typeof selection != 'undefined' && selection != null) 
	        selection.each(function(data) {
	            var container = d3.select(this);
	            nv.utils.initSVG(container);

	            var availableWidth = nv.utils.availableWidth(width, container, margin),
	                availableHeight = nv.utils.availableHeight(height, container, margin);

	            chart.update = function() { container.transition().call(chart); };
	            chart.container = this;

	            // Display No Data message if there's nothing to show.
	            if (!data || !data.length) {
	                nv.utils.noData(chart, container);
	                return chart;
	            } else {
	                container.selectAll('.nv-noData').remove();
	            }

	            // Setup containers and skeleton of chart
	            var wrap = container.selectAll('g.nv-wrap.nv-gaugeChart').data([data]);
	            var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-gaugeChart').append('g');
	            var g = wrap.select('g');

	            gEnter.append('g').attr('class', 'nv-gaugeWrap');

	            wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	            // Main Chart Component(s)
	            gauge.width(availableWidth).height(availableHeight);
	            var gaugeWrap = g.select('.nv-gaugeWrap').datum([data]);
	            d3.transition(gaugeWrap).call(gauge);
	        });
	    nv.utils.onWindowResize(chart.update)
        renderWatch.renderEnd('gauge chart immediate');
        return chart;
    }

    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.dispatch = dispatch;
    chart.gauge = gauge;
    chart.options = nv.utils.optionsFunc.bind(chart);

    // use Object get/set functionality to map between vars and chart functions
    chart._options = Object.create({}, {
        // simple options, just get/set the necessary values
        width:      {get: function(){return width;}, set: function(_){width=_;}},
        height:     {get: function(){return height;}, set: function(_){height=_;}},
        noData:         {get: function(){return noData;}, set: function(_){noData=_;}},

        // options that require extra logic in the setter
        color: {get: function(){return color;}, set: function(_){
            color = _;
            gauge.color(color);
        }},
        margin: {get: function(){return margin;}, set: function(_){
            margin.top    = _.top    !== undefined ? _.top    : margin.top;
            margin.right  = _.right  !== undefined ? _.right  : margin.right;
            margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
            margin.left   = _.left   !== undefined ? _.left   : margin.left;
        }}
    });

    nv.utils.inheritOptions(chart, gauge);
    nv.utils.initOptions(chart);
    nv.utils.onWindowResize(chart.update);

    return chart;
};





odoo.define('web.GraphWidget', function (require) {
"use strict";

var config = require('web.config');
var core = require('web.core');
var Model = require('web.DataModel');
var formats = require('web.formats');
var Widget = require('web.Widget');

var _t = core._t;
var QWeb = core.qweb;

// hide top legend when too many item for device size
var MAX_LEGEND_LENGTH = 25 * (1 + config.device.size_class);

return Widget.extend({
    className: "o_graph_svg_container",
    init: function (parent, model, options) {
        this._super(parent);
        this.context = options.context;
        this.fields = options.fields;
        this.fields.__count__ = {string: _t("Count"), type: "integer"};
        this.model = new Model(model, {group_by_no_leaf: true});

        this.domain = options.domain || [];
        this.groupbys = options.groupbys || [];
        this.mode = options.mode || "bar";
        this.measure = options.measure || "__count__";
        this.stacked = options.stacked;
    },
    start: function () {
        return this.load_data().then(this.proxy('display_graph'));
    },
    update_data: function (domain, groupbys) {
        this.domain = domain;
        this.groupbys = groupbys;
        return this.load_data().then(this.proxy('display_graph'));
    },
    set_mode: function (mode) {
        this.mode = mode;
        this.display_graph();
    },
    set_measure: function (measure) {
        this.measure = measure;
        return this.load_data().then(this.proxy('display_graph'));        
    },
    load_data: function () {
        var fields = this.groupbys.slice(0);
        if (this.measure !== '__count__'.slice(0))
            fields = fields.concat(this.measure);
        return this.model
                    .query(fields)
                    .filter(this.domain)
                    .context(this.context)
                    .lazy(false)
                    .group_by(this.groupbys.slice(0,2))
                    .then(this.proxy('prepare_data'));
    },
    prepare_data: function () {
        var raw_data = arguments[0],
            is_count = this.measure === '__count__';
        var data_pt, j, values, value;

        this.data = [];
        for (var i = 0; i < raw_data.length; i++) {
            data_pt = raw_data[i].attributes;
            values = [];
            if (this.groupbys.length === 1) data_pt.value = [data_pt.value];
            for (j = 0; j < data_pt.value.length; j++) {
                values[j] = this.sanitize_value(data_pt.value[j], data_pt.grouped_on[j]);
            }
            value = is_count ? data_pt.length : data_pt.aggregates[this.measure];
            this.data.push({
                labels: values,
                value: value
            });
        }
    },
    sanitize_value: function (value, field) {
        if (value === false) return _t("Undefined");
        if (value instanceof Array) return value[1];
        if (field && this.fields[field] && (this.fields[field].type === 'selection')) {
            var selected = _.where(this.fields[field].selection, {0: value})[0];
            return selected ? selected[1] : value;
        }
        return value;
    },
    display_graph: function () {
        if (this.to_remove) {
            nv.utils.offWindowResize(this.to_remove);
        }
        this.$el.empty();
        if (!this.data.length) {
            this.$el.append(QWeb.render('GraphView.error', {
                title: _t("No data to display"),
                description: _t("No data available for this chart. " +
                    "Try to add some records, or make sure that " +
                    "there is no active filter in the search bar."),
            }));
        } else {

            var chart = this['display_' + this.mode]();
            if (chart) {
            	if (typeof chart.tooltip != 'undefined' && chart.tooltip != null) 
                	chart.tooltip.chartContainer(this.$el[0]);
            }
        }
    },
    display_bar: function () {
        // prepare data for bar chart
        var data, values,
            measure = this.fields[this.measure].string,
            self = this;

        // zero groupbys
        if (this.groupbys.length === 0) {
            data = [{
                values: [{
                    x: measure,
                    y: this.data[0].value}],
                key: measure
            }];
        } 
        // one groupby
        if (this.groupbys.length === 1) {
            values = this.data.map(function (datapt) {
                return {x: datapt.labels, y: datapt.value};
            });
            data = [
                {
                    values: values,
                    key: measure,
                }
            ];
        }
        if (this.groupbys.length > 1) {
            var xlabels = [],
                series = [],
                label, serie, value;
            values = {};
            for (var i = 0; i < this.data.length; i++) {
                label = this.data[i].labels[0];
                serie = this.data[i].labels[1];
                value = this.data[i].value;
                if ((!xlabels.length) || (xlabels[xlabels.length-1] !== label)) {
                    xlabels.push(label);
                }
                series.push(this.data[i].labels[1]);
                if (!(serie in values)) {values[serie] = {};}
                values[serie][label] = this.data[i].value;
            }
            series = _.uniq(series);
            data = [];
            var current_serie, j;
            for (i = 0; i < series.length; i++) {
                current_serie = {values: [], key: series[i]};
                for (j = 0; j < xlabels.length; j++) {
                    current_serie.values.push({
                        x: xlabels[j],
                        y: values[series[i]][xlabels[j]] || 0,
                    });
                }
                data.push(current_serie);
            }
        }
        var svg = d3.select(this.$el[0]).append('svg');
        svg.datum(data);

        svg.transition().duration(0);

        var chart = nv.models.multiBarChart();
        chart.options({
          margin: {left: 120, bottom: 60},
          delay: 250,
          transition: 10,
          showLegend: _.size(data) <= MAX_LEGEND_LENGTH,
          showXAxis: true,
          showYAxis: true,
          rightAlignYAxis: false,
          stacked: this.stacked,
          reduceXTicks: false,
          rotateLabels: -20,
          showControls: (this.groupbys.length > 1)
        });
        chart.yAxis.tickFormat(function(d) {
            return formats.format_value(d, {
                type : 'float',
                digits : self.fields[self.measure] && self.fields[self.measure].digits || [69, 2],
            });
        });

        chart(svg);
        this.to_remove = chart.update;
        nv.utils.onWindowResize(chart.update);

        return chart;
    },
    display_pie: function () {
        var data = [],
            all_negative = true,
            some_negative = false,
            all_zero = true;
        
        this.data.forEach(function (datapt) {
            all_negative = all_negative && (datapt.value < 0);
            some_negative = some_negative || (datapt.value < 0);
            all_zero = all_zero && (datapt.value === 0);
        });
        if (some_negative && !all_negative) {
            this.$el.append(QWeb.render('GraphView.error', {
                title: _t("Invalid data"),
                description: _t("Pie chart cannot mix positive and negative numbers. " +
                    "Try to change your domain to only display positive results"),
            }));
            return;
        }
        if (all_zero) {
            this.$el.append(QWeb.render('GraphView.error', {
                title: _t("Invalid data"),
                description: _t("Pie chart cannot display all zero numbers.. " +
                    "Try to change your domain to display positive results"),
            }));
            return;
        }
        if (this.groupbys.length) {
            data = this.data.map(function (datapt) {
                return {x:datapt.labels.join("/"), y: datapt.value};
            });
        }
        var svg = d3.select(this.$el[0]).append('svg');
        svg.datum(data);

        svg.transition().duration(100);

        var legend_right = config.device.size_class > config.device.SIZES.XS;

        var chart = nv.models.pieChart();
        chart.options({
          delay: 250,
          showLegend: legend_right || _.size(data) <= MAX_LEGEND_LENGTH,
          legendPosition: legend_right ? 'right' : 'top',
          transition: 100,
          color: d3.scale.category10().range(),
        });

        chart(svg);
        this.to_remove = chart.update;
        nv.utils.onWindowResize(chart.update);

        return chart;
    },
    display_line: function () {
        if (this.data.length < 2) {
            this.$el.append(QWeb.render('GraphView.error', {
                title: _t("Not enough data points"),
                description: "You need at least two data points to display a line chart."
            }));
            return;
        }
        var self = this,
            data = [],
            tickValues,
            tickFormat,
            measure = this.fields[this.measure].string;
        if (this.groupbys.length === 1) {
            var values = this.data.map(function (datapt, index) {
                return {x: index, y: datapt.value};
            });
            data = [
                {
                    values: values,
                    key: measure,
                }
            ];
            tickValues = this.data.map(function (d, i) { return i;});
            tickFormat = function (d) {return self.data[d].labels;};
        }
        if (this.groupbys.length > 1) {
            data = [];
            var data_dict = {},
                tick = 0,
                tickLabels = [],
                serie, tickLabel,
                identity = function (p) {return p;};
            tickValues = [];
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].labels[0] !== tickLabel) {
                    tickLabel = this.data[i].labels[0];
                    tickValues.push(tick);
                    tickLabels.push(tickLabel);
                    tick++;
                }
                serie = this.data[i].labels[1];
                if (!data_dict[serie]) {
                    data_dict[serie] = {
                        values: [],
                        key: serie,
                    };
                }
                data_dict[serie].values.push({
                    x: tick, y: this.data[i].value,
                });
                data = _.map(data_dict, identity);
            }
            tickFormat = function (d) {return tickLabels[d];};
        }

        var svg = d3.select(this.$el[0]).append('svg');
        svg.datum(data);

        svg.transition().duration(0);

        var chart = nv.models.lineChart();
        chart.options({
          margin: {left: 120, bottom: 60},
          useInteractiveGuideline: true,
          showLegend: _.size(data) <= MAX_LEGEND_LENGTH,
          showXAxis: true,
          showYAxis: true,
        });
        chart.xAxis.tickValues(tickValues)
            .tickFormat(tickFormat);
        chart.yAxis.tickFormat(function(d) {
            return formats.format_value(d, {
                type : 'float',
                digits : self.fields[self.measure] && self.fields[self.measure].digits || [69, 2],
            });
        });

        chart(svg);
        this.to_remove = chart.update;
        nv.utils.onWindowResize(chart.update);

        return chart;
    },
    display_gauge_chart: function () {
    	alert('the data 14 :'+this.data[0].value);

		for (var i = 0; i < this.data.length; i++) {
				var chart = nv.models.gaugeChart()
	                .min(0)
	                .max(1000)
	                .zoneLimit1(0.25)
	                .zoneLimit2(0.50)
	                .zoneLimit3(0.75)
	                .zoneLimit4(1) ;
	                
	            var legend_right = config.device.size_class > config.device.SIZES.XS;
	            //option//
	            chart.options({
	              delay: 250,
	              transition: 100,
	              showLegend: legend_right || _.size(dataSize) <= MAX_LEGEND_LENGTH,
	              color: d3.scale.category10().range()
	            });
				var svg=d3.select(this.$el[0]).append('svg');
	            svg.datum([this.data[i].value]);
	            svg.transition().duration(100);
	            chart(svg);

		        this.to_remove = chart.update;
		        nv.utils.onWindowResize(chart.update);
		        //return chart;
		        nv.addGraph(chart);
		}
				//drawGaugeChart(this.data[i],this.data.length,this.$el[0],0,1000));
    },
    destroy: function () {
        nv.utils.offWindowResize(this.to_remove);
        return this._super();
    }
});

});
