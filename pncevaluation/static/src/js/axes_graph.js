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
    var datas;
    var series;


    var MyView = View.extend({
        icon: 'fa-briefcase',
        display_name: _lt("Axes view"),
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
            $(container).addClass("axe_summary");
            $(container).attr("id", "cont")
            $(self.$el).append(container);
            //$(container).append('<h1>Axe 01 : Prévention </h1>');
            table = document.createElement('table');
            $(table).addClass("axes_table");
            $(table).addClass("pnc");
            $(container).append(table);
            elemBody = document.createElement('tbody');
            $(table).append(elemBody);
        },
        do_search: function(domains, contexts, group_bys) {
            var self = this;
            datas = new Array();
            series = new Array();
            var fields = _.compact(_.map(["id", "name"], function(key) {
                return self.fields_view.arch.attrs[key] || '';
            }));
            return $.when(this.has_been_loaded).then(function() {
                return self.dataset.read_slice(fields, {
                    domain: domains,
                    context: contexts
                }).then(function(data) {


                    $(elemBody).empty();
                    var line = document.createElement('tr');
                    $(elemBody).append(line);
                    var td = document.createElement('td');
                    $(td).attr("id", "corr");
                    var dat = new Array();
                    self.rpc('/pncevaluation/get_action_pa_rea').done(function(result) {
                        console.log(result);

                        for (var i = 0; i < result.length; i++) {
                            datas[i] = {
                                name: 'Axe ' + result[i].numero,
                                y: result[i].axeCount,
                                drilldown: 'axe' + result[i].numero + 'pa'
                            };

                            dat[i] = new Array();
                            for (var j = 0; j < result[i].paCount.length; j++) {
                                var str = "" + result[i].paCount[j].plan_intitule;
                                dat[i][j] = new Array();
                                dat[i][j] = [str, result[i].paCount[j].plan_actions_count];
                            }



                            series.push({
                                name: 'Programmes d\'action',
                                id: 'axe' + result[i].numero + 'pa',
                                data: dat[i]

                            });

                        }
                        console.log("datas");
                        console.log(datas);
                        console.log("series");
                        console.log(series);


                        $('#corr').highcharts({
                            chart: {
                                type: 'pie'
                            },
                            title: {
                                text: 'Correspondance'
                            },
                            subtitle: {
                                text: 'Nombre d\'actions du PA qui ont une correspondance au niveau de la réalisation'
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
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> actions du total<br/>'
                            },

                            series: [{
                                name: 'Axe',
                                colorByPoint: true,
                                data: datas
                            }],
                            drilldown: {
                                series: series
                            }
                        });

                        self.rpc('/pncevaluation/get_reunions').done(function(result) {
                            console.log("Réunions");
                            console.log(result);
                            var line = document.createElement('tr');
                            $(elemBody).append(line);
                            var td = document.createElement('td');
                            $(td).attr("id", "corr");


                        });






                    });



                });


            });


        }
    });


    core.view_registry.add('axes_graphs', MyView);

});