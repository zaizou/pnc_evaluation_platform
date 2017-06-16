odoo.define('pncevaluation.axes_graphs', function(require) {
    "use strict";
    var core = require('web.core');
    var View = require('web.View');
    var _lt = core._lt;

    var Model = require('web.DataModel');
    var formats = require('web.formats');
    var time = require('web.time');
    var parse_value = require('web.web_client');
    var form_common = require('web.form_common');
    var table;
    var elemBody;
    var axes_ids;
    var axesTable;
    datas = new Array();
    series = new Array();


    var MyView = View.extend({
        icon: 'fa-briefcase',
        display_name: "Axes Graphs",
        init: function() {
            //console.log("init Called");
            this._super.apply(this, arguments);
            this.has_been_loaded = $.Deferred();
            this.chart_id = _.uniqueId();
            var self = this;
        },
        willStart: function() {
            console.log("WillStart Called");
            var self = this;
            this.$el.addClass(this.fields_view.arch.attrs['class']);
            return self.alive(new Model(this.dataset.model)
                .call('fields_get')).then(function(fields) {
                self.fields = fields;
                self.has_been_loaded.resolve();
            });

        },
        start: function() {
            var self = this;
            var container = document.createElement('div');
            $(container).addClass("axes_graphs");
            $(container).attr("id", "cont")
            $(self.$el).append(container);
            //$(container).append('<h1>Axe 01 : Prévention </h1>');
            table = document.createElement('table');
            $(table).addClass("axes_table");
            //$(table).addClass("pnc");
            $(container).append(table);
            elemBody = document.createElement('tbody');
            $(table).append(elemBody);
        },
        do_search: function(domains, contexts, group_bys) {
            var self = this;
            var fields = _.compact(_.map(["id", "name"], function(key) {
                return self.fields_view.arch.attrs[key] || '';
            }));
            return $.when(this.has_been_loaded).then(function() {
                return self.dataset.read_slice(fields, {
                    domain: domains,
                    context: contexts
                }).then(function(data) {
                    $(elemBody).empty();
                    self.rpc('/pncevaluation/get_action_pa_rea').done(function(result) {
                        //$(elemBody)
                        console.log(result);

                        for (var i = 0; i < result.length; i++) {
                            datas.append({
                                name: 'Axe ' + result[i].numero,
                                y: result[0].axeCount,
                                drilldown: 'axe' + result[i].numero + 'pa'
                            });

                            var dat = new Array();
                            for (var j = 0; j < result[i].length; j++)
                                dat.append(['' + result[i].paCount[j].plan_intitule, result[i].paCount[j].plan_actions_count])


                            series.append({
                                name: 'Programmes d\'action',
                                id: 'axe' + result[0].numero + 'pa',
                                data: dat

                            });

                        }
                        $('#cont').highcharts({
                            chart: {
                                type: 'pie'
                            },
                            title: {
                                text: 'Nombre d\'actions qui ont '
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
                                        enabled: true,
                                    }
                                }
                            },

                            series: [{
                                name: 'Actions',
                                colorByPoint: true,
                                data: datas
                            }],
                            drilldown: {
                                series: series
                            }
                        });







                    });

                });


            });


        }

    });





    core.view_registry.add('axes_graphs', MyView);

});