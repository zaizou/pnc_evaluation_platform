odoo.define('web.GraphWidget', function(require) {
    "use strict";

    var config = require('web.config');
    var core = require('web.core');
    var Model = require('web.DataModel');
    var formats = require('web.formats');
    var Widget = require('web.Widget');

    var _t = core._t;
    var QWeb = core.qweb;
    var names;
    var data_source;
    var avance;
    var tabOnes;
    var tabSeries;

    // hide top legend when too many item for device size
    var MAX_LEGEND_LENGTH = 25 * (1 + config.device.size_class);

    return Widget.extend({
        className: "o_graph_svg_container",
        init: function(parent, model, options) {
            this._super(parent);
            this.context = options.context;
            this.fields = options.fields;
            this.fields.__count__ = { string: _t("Count"), type: "integer" };
            this.model = new Model(model, { group_by_no_leaf: true });

            this.domain = options.domain || [];
            this.groupbys = options.groupbys || [];
            this.mode = options.mode || "bar";
            this.measure = options.measure || "__count__";
            this.stacked = options.stacked;
        },
        start: function() {
            return this.load_data().then(this.proxy('display_graph'));
        },
        update_data: function(domain, groupbys) {
            this.domain = domain;
            this.groupbys = groupbys;
            return this.load_data().then(this.proxy('display_graph'));
        },
        set_mode: function(mode) {
            this.mode = mode;
            this.display_graph();
        },
        set_measure: function(measure) {
            this.measure = measure;
            return this.load_data().then(this.proxy('display_graph'));
        },
        load_data: function() {
            var fields = this.groupbys.slice(0);
            if (this.measure !== '__count__'.slice(0))
                fields = fields.concat(this.measure);
            return this.model
                .query(fields)
                .filter(this.domain)
                .context(this.context)
                .lazy(false)
                .group_by(this.groupbys.slice(0, 2))
                .then(this.proxy('prepare_data'));
        },
        prepare_data: function() {
            var raw_data = arguments[0],
                is_count = this.measure === '__count__';
            var data_pt, j, values, value;

            // console.log("Arguments");
            // console.log(arguments);
            this.data = [];
            this.fulldata = [];
            // console.log("raw data");
            // console.log(raw_data);
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
        sanitize_value: function(value, field) {
            console.log()
            if (value === false) return _t("Undefined");
            if (value instanceof Array) return value[1];
            if (field && this.fields[field] && (this.fields[field].type === 'selection')) {
                var selected = _.where(this.fields[field].selection, { 0: value })[0];
                return selected ? selected[1] : value;
            }
            return value;
        },
        display_graph: function() {
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
                /*if (chart) {
                    chart.tooltip.chartContainer(this.$el[0]);
                }*/
            }
        },
        display_bar: function() {
            // prepare data for bar chart
            var data, values,
                measure = this.fields[this.measure].string,
                self = this;

            // zero groupbys
            if (this.groupbys.length === 0) {
                data = [{
                    values: [{
                        x: measure,
                        y: this.data[0].value
                    }],
                    key: measure
                }];
            }
            // one groupby
            if (this.groupbys.length === 1) {
                values = this.data.map(function(datapt) {
                    return { x: datapt.labels, y: datapt.value };
                });
                data = [{
                    values: values,
                    key: measure,
                }];
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
                    if ((!xlabels.length) || (xlabels[xlabels.length - 1] !== label)) {
                        xlabels.push(label);
                    }
                    series.push(this.data[i].labels[1]);
                    if (!(serie in values)) { values[serie] = {}; }
                    values[serie][label] = this.data[i].value;
                }
                series = _.uniq(series);
                data = [];
                var current_serie, j;
                for (i = 0; i < series.length; i++) {
                    current_serie = { values: [], key: series[i] };
                    for (j = 0; j < xlabels.length; j++) {
                        current_serie.values.push({
                            name: xlabels[j],
                            y: values[series[i]][xlabels[j]] || 0,
                            drilldown: null
                        });
                    }
                    data.push(current_serie);
                }
            }
            data_source = this.data;

            console.log("rana hna");
            console.log(data);

            if (this.groupbys.length == 2) {
                tabOnes = new Array();
                tabSeries = new Array();
                var headers = new Array();
                for (var i = 0; i < data_source.length; i++) {
                    var oneName = data_source[i].labels[0];
                    var subs = new Array();
                    var y = 0;
                    for (var j = 0; j < data_source.length; j++) {
                        if (oneName == data_source[j].labels[0]) {
                            y += data_source[j].value;
                            subs.push([data_source[j].labels[1], data_source[j].value])
                        }
                    }

                    if (headers.indexOf(oneName) < 0) {
                        tabOnes.push({
                            name: data_source[i].labels[0],
                            y: y,
                            drilldown: data_source[i].labels[0]
                        });

                        tabSeries.push({
                            id: data_source[i].labels[0],
                            data: subs
                        });
                        headers.push(oneName);
                    }


                }
                console.log("this.datat");
                console.log(this.data);
                console.log("tabs");
                console.log(tabOnes);
                console.log(tabSeries);
                $(this.$el[0]).highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category'
                    },

                    legend: {
                        enabled: false
                    },

                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },

                    series: [{
                        name: 'Haut',
                        colorByPoint: true,
                        data: tabOnes
                    }],
                    drilldown: {
                        series: tabSeries
                    }
                });

            } else {

                console.log("data to be :");
                console.log(data);
                var tabb = new Array();
                for (var j = 0; j < data[0].values.length; j++)
                    tabb.push([data[0].values[j].x[0], data[0].values[j].y]);

                console.log("atbb");
                console.log(tabb);


                $(this.$el[0]).highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '' + data[0].key
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: ': <b>{point.y} </b>'
                    },
                    series: [{
                        name: 'Population',
                        data: tabb,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: '#FFFFFF',
                            align: 'right',
                            format: '{point.y}', // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    }]
                });

                // var svg = d3.select(this.$el[0]).append('svg');
                // svg.datum(data);

                // svg.transition().duration(0);

                // var chart = nv.models.multiBarChart();
                // chart.options({
                //     margin: { left: 120, bottom: 60 },
                //     delay: 250,
                //     transition: 10,
                //     showLegend: _.size(data) <= MAX_LEGEND_LENGTH,
                //     showXAxis: true,
                //     showYAxis: true,
                //     rightAlignYAxis: false,
                //     stacked: this.stacked,
                //     reduceXTicks: false,
                //     rotateLabels: -20,
                //     showControls: (this.groupbys.length > 1)
                // });
                // chart.yAxis.tickFormat(function(d) {
                //     return formats.format_value(d, {
                //         type: 'float',
                //         digits: self.fields[self.measure] && self.fields[self.measure].digits || [69, 2],
                //     });
                // });

                // chart(svg);
                // this.to_remove = chart.update;
                // nv.utils.onWindowResize(chart.update);

                // return chart;



            }







        },
        display_budget_bar_chart: function() {

            console.log("the datdat");
            console.log(this);




            //this.context.params.model

            var data, values,
                measure = this.fields[this.measure].string,
                self = this;
            $(this.$el[0]).attr("id", "power-bar");

            var tab = document.createElement('table');
            var line = document.createElement('tr');
            $(this.$el[0]).append(tab);
            $(tab).append(line);
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            $(line).append(td1);
            $(line).append(td2);
            $(line).append(td3);
            $(line).append(td4);

            var idv = document.createElement('div');
            $(idv).attr("id", "cont1");
            var idv2 = document.createElement('div');
            $(idv2).attr("id", "cont2");
            var idv3 = document.createElement('div');
            $(idv3).attr("id", "cont3");
            var idv4 = document.createElement('div');
            $(idv4).attr("id", "cont4");
            $(td1).append(idv);
            $(td2).append(idv2);
            $(td3).append(idv3);
            $(td4).append(idv4);


            //this.domain[0][0]="numero_axe"
            var axe = -1;

            if (this.domain[0])
                if (this.domain[0][0] == "numero_axe")
                    axe = this.domain[0][2];


            self.rpc('/pncevaluation/get_budgets', { axe_num: axe }).done(function(result) {
                console.log("result");
                console.log(result);


                var index = 0;
                var cate = [];
                var budgets_estim = [];
                var budgets_reel = [];
                var ecarts = [];
                for (var i = 0; i < result.length; i++) {

                    if (cate.indexOf(result[i].date) < 0) {
                        cate[index] = result[i].date;
                        budgets_estim[index] = result[i].budget_estime;
                        budgets_reel[index] = result[i].budget_reel;
                        ecarts[index] = budgets_reel[index] - budgets_estim[index];
                        index++;
                    } else {
                        budgets_estim[cate.indexOf(result[i].date)] += result[i].budget_estime;
                        budgets_reel[cate.indexOf(result[i].date)] += result[i].budget_reel;
                        ecarts[cate.indexOf(result[i].date)] = budgets_reel[cate.indexOf(result[i].date)] - budgets_estim[cate.indexOf(result[i].date)];

                    }



                }
                // if (result.length == 0) {
                //     cate[0] = 'Indéfinie'
                //     budgets_estim[0] = 0;
                //     budgets_reel[0] = 0;
                //     ecarts[0] = 0;
                // }
                var strV
                if (axe > 0)
                    strV = "Suivi des Budgets de l\'axe : 0" + axe;
                else
                    strV = "Suivi global des Budgets "
                Highcharts.chart('cont1', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: strV
                    },
                    xAxis: {
                        categories: cate
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Budget Estimé',
                        data: budgets_estim
                    }, {
                        name: 'Budget réel',
                        data: budgets_reel
                    }, {
                        name: 'Ecart',
                        data: ecarts
                    }],

                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 300
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }]
                    }

                });

                // Highcharts.chart('cont2', {
                //     chart: {
                //         type: 'column'
                //     },
                //     title: {
                //         text: 'Column chart with negative values'
                //     },
                //     xAxis: {
                //         categories: cate
                //     },
                //     credits: {
                //         enabled: false
                //     },
                //     series: [{
                //         name: 'Budget Estimé',
                //         data: budgets_estim
                //     }, {
                //         name: 'Budget réel',
                //         data: budgets_reel
                //     }, {
                //         name: 'Ecart',
                //         data: ecarts
                //     }]
                // });

                // Highcharts.chart('cont3', {
                //     chart: {
                //         type: 'column'
                //     },
                //     title: {
                //         text: 'Column chart with negative values'
                //     },
                //     xAxis: {
                //         categories: cate
                //     },
                //     credits: {
                //         enabled: false
                //     },
                //     series: [{
                //         name: 'Budget Estimé',
                //         data: budgets_estim
                //     }, {
                //         name: 'Budget réel',
                //         data: budgets_reel
                //     }, {
                //         name: 'Ecart',
                //         data: ecarts
                //     }]
                // });

                // Highcharts.chart('cont4', {
                //     chart: {
                //         type: 'column'
                //     },
                //     title: {
                //         text: 'Column chart with negative values'
                //     },
                //     xAxis: {
                //         categories: cate
                //     },
                //     credits: {
                //         enabled: false
                //     },
                //     series: [{
                //         name: 'Budget Estimé',
                //         data: budgets_estim
                //     }, {
                //         name: 'Budget réel',
                //         data: budgets_reel
                //     }, {
                //         name: 'Ecart',
                //         data: ecarts
                //     }]
                // });








            });



        },

        display_pie: function() {
            var data = [],
                all_negative = true,
                some_negative = false,
                all_zero = true;

            this.data.forEach(function(datapt) {
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
                data = this.data.map(function(datapt) {
                    return { name: datapt.labels.join("/"), y: datapt.value };
                });
                console.log("grouped by");
                console.log(data);
                console.log("this data");
                console.log(this.data);
                names = data[0].name.split("/");
                data_source = this.data;



            }
            //setTimeout(function() { debugger; }, 5000);

            // if (this.groupbys.length > 1)
            //     console.log(createThe(0, 0, data_source.length));

            console.log("inf <<");

            if (this.groupbys.length == 2) {
                doTwoLevel(this.$el[0])
            } else {

                $(this.$el[0]).attr("id", "power-pie");
                $(this.$el[0]).highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Title',
                        colorByPoint: true,
                        data: data
                    }]
                });

            }

            function doTwoLevel(get) {
                tabOnes = new Array();
                tabSeries = new Array();
                var headers = new Array();
                for (var i = 0; i < data_source.length; i++) {
                    var oneName = data_source[i].labels[0];
                    var subs = new Array();
                    var y = 0;


                    for (var j = 0; j < data_source.length; j++) {
                        if (oneName == data_source[j].labels[0]) {
                            y += data_source[j].value;
                            subs.push([data_source[j].labels[1], data_source[j].value])
                        }
                    }

                    if (headers.indexOf(oneName) < 0) {
                        tabOnes.push({
                            name: data_source[i].labels[0],
                            y: y,
                            drilldown: data_source[i].labels[0]
                        });

                        tabSeries.push({
                            name: data_source[i].labels[0],
                            id: data_source[i].labels[0],
                            data: subs
                        });
                        headers.push(oneName);
                    }


                }

                $(get).highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}: {point.y}'
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                    },

                    series: [{
                        name: 'Haut',
                        colorByPoint: true,
                        data: tabOnes
                    }],
                    drilldown: {
                        series: tabSeries
                    }
                });




            }




            function createThe(niveau, begin, end) {


                if (niveau == 0) {
                    var current_label = data_source[begin].labels[niveau];
                    var yy = 0;
                    var name = names[niveau];
                    var subs = new Array();
                    var i = 0;
                    // avance = 0; //
                    console.log("Niveau ------->");
                    console.log(niveau);
                    for (i = begin; i <= end; i++) {
                        console.log("data_source[i].labels[niveau] :")
                        console.log(data_source[i].labels[niveau])
                        console.log("current_label:");
                        console.log(current_label);

                        if (data_source[i].labels[niveau] == current_label)
                            yy += data_source[i].value;
                        else
                            break;
                        current_label = data_source[i].labels[niveau];
                    }
                    avance = i;
                    while (avance < data_source.length) {
                        subs = createThe(niveau + 1, begin, avance);
                    }

                    return {
                        name: name,
                        y: yy,
                        subs: subs
                    }
                }

                if (niveau == names.length - 1) {
                    var yy = 0;
                    var namee = names[niveau];
                    for (var i = begin; i <= end; i++) {
                        yy += data_source[i].value;
                    }
                    return {
                        name: namee,
                        y: yy

                    }

                } else {
                    var current_label = data_source[begin].labels[niveau];
                    var yy = 0;
                    var name = names[niveau];
                    var subs = new Array();
                    var i = 0;
                    // avance = 0; //
                    for (i = begin; i <= end; i++) {
                        if (data_source[i].labels[niveau] == current_label)
                            yy += data_source[i].value;
                        else
                            break;
                        current_label = data_source[i].labels[niveau];
                    }
                    avance = i;
                    while (avance < data_source.length) {
                        if (niveau == 0)
                            subs = createThe(niveau + 1, begin, avance);
                        else
                            subs = createThe(niveau + 1, avance, avance);
                    }

                    return {
                        name: name,
                        y: yy,
                        subs: subs
                    }

                }
            }






            // var svg = d3.select(this.$el[0]).append('svg');
            // console.log("Pie data");
            // console.log(data);
            // svg.datum(data);

            // svg.transition().duration(100);

            // var legend_right = config.device.size_class > config.device.SIZES.XS;

            // var chart = nv.models.pieChart();
            // chart.options({
            //     delay: 250,
            //     showLegend: legend_right || _.size(data) <= MAX_LEGEND_LENGTH,
            //     legendPosition: legend_right ? 'right' : 'top',
            //     transition: 100,
            //     color: d3.scale.category10().range(),
            // });

            // chart(svg);
            // this.to_remove = chart.update;
            // nv.utils.onWindowResize(chart.update);

            // return chart;
        },
        display_line: function() {
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
                var values = this.data.map(function(datapt, index) {
                    return { x: index, y: datapt.value };
                });
                data = [{
                    values: values,
                    key: measure,
                }];
                tickValues = this.data.map(function(d, i) { return i; });
                tickFormat = function(d) { return self.data[d].labels; };
            }
            if (this.groupbys.length > 1) {
                data = [];
                var data_dict = {},
                    tick = 0,
                    tickLabels = [],
                    serie, tickLabel,
                    identity = function(p) { return p; };
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
                        x: tick,
                        y: this.data[i].value,
                    });
                    data = _.map(data_dict, identity);
                }
                tickFormat = function(d) { return tickLabels[d]; };
            }

            var svg = d3.select(this.$el[0]).append('svg');
            svg.datum(data);

            svg.transition().duration(0);

            var chart = nv.models.lineChart();
            chart.options({
                margin: { left: 120, bottom: 60 },
                useInteractiveGuideline: true,
                showLegend: _.size(data) <= MAX_LEGEND_LENGTH,
                showXAxis: true,
                showYAxis: true,
            });
            chart.xAxis.tickValues(tickValues)
                .tickFormat(tickFormat);
            chart.yAxis.tickFormat(function(d) {
                return formats.format_value(d, {
                    type: 'float',
                    digits: self.fields[self.measure] && self.fields[self.measure].digits || [69, 2],
                });
            });

            chart(svg);
            this.to_remove = chart.update;
            nv.utils.onWindowResize(chart.update);

            return chart;
        },
        display_gauge_chart: function() {
            $(this.$el[0]).attr("id", "power-gauge");
            var powerGauge = gauge('#power-gauge', {
                size: 400,
                clipWidth: 400,
                clipHeight: 300,
                ringWidth: 60,
                maxValue: 100,
                transitionMs: 4000,
            });
            powerGauge.render();
            powerGauge.update(this.data[0].value);
            return powerGauge;

            //  var chart[i] = nv.models.gaugeChart()
            /*   var chart=[];
        for (var i = 0; i < this.data.length; i++) {

                var chart[i] = nv.models.gaugeChart()
                .min(0)
                .max(1000)
                .zoneLimit1(0.25)
                .zoneLimit2(0.75);
            var legend_right = config.device.size_class > config.device.SIZES.XS;

            chart[i].options({
              delay: 250,
              transition: 100,
              showLegend: legend_right || _.size(data) <= MAX_LEGEND_LENGTH,
              color: d3.scale.category10().range()
            });



            var svg=d3.select(this.$el[0]).append('svg')
            svg.datum(this.data[0].value);//.call(chart);
            chart[i](svg);
        }


        
        //var str=this.$el[0]+" svg";
        //d3.select(str).;
        

        //svg.transition().duration(100);

        this.to_remove = chart[i].update;
        nv.utils.onWindowResize(chart[i].update);
        nv.utils.windowResize(chart[i].update);
*/
            //return chart;

        },
        destroy: function() {
            nv.utils.offWindowResize(this.to_remove);
            return this._super();
        }
    });

});