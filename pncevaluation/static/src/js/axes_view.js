odoo.define('pncevaluation.axes', function(require) {
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
                /*console.log("this.dataset.model : " + self.dataset.model);
                console.log("this.dataset");
                console.log(self.dataset);
                console.log(self.fields);*/
                self.has_been_loaded.resolve();
            });

        },
        start: function() {
            var self = this;
            var container = document.createElement('div');
            $(container).addClass("axe_summary");
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
            var fields = _.compact(_.map(["id", "name"], function(key) {
                return self.fields_view.arch.attrs[key] || '';
            }));
            return $.when(this.has_been_loaded).then(function() {
                return self.dataset.read_slice(fields, {
                    domain: domains,
                    context: contexts
                }).then(function(data) {
                    console.log(data);
                    var head = document.createElement('thead');
                    $(table).append(head);
                    var head_line = document.createElement('tr');
                    $(head_line).addClass("pnc");
                    $(head).append(head_line);
                    $(head_line).append('<th class="pnc">.</th>');
                    $(head_line).append('<th class="pnc">Indicateur</th>');
                    axes_ids = new Array();
                    axesTable = new Array();
                    for (var i = 0; i < data.length; i++) {
                        $(head_line).append('<th class="pnc"><h4> Axe 0' + data[i].numero + '<h4></th>');
                        axes_ids[i] = data[i].id;
                        axesTable[i] = data[i];
                    }

                    $(elemBody).empty();
                    self.rpc('/pncevaluation/get_axes_stats', { axes_ids: axes_ids, date_debut: "1", date_fin: "2" }).done(function(result) {
                        console.log("table");
                        console.log(result);

                        for (var i = 0; i < axesTable.length; i++)
                            for (var j = 0; j < result.length; j++)
                                if (axesTable[i].id == result[j].axe_id)
                                    axesTable[i].stats = result[j];

                        console.log(axesTable);
                        draw_avancement_line(axesTable);
                        draw_comprehension(axesTable);
                        draw_budget(axesTable);
                        draw_realisation(axesTable);
                        draw_evaliation_line(axesTable);

                    });


                });


            });


        }
    });


    function draw_avancement_line(axes) {
        var avn_line = document.createElement('tr');
        $(elemBody).append(avn_line);
        $(avn_line).append('<td class="pnc"><h4 class="cat1">Avancement</h4></td>');
        var kpi_cont = document.createElement('td');
        $(avn_line).append(kpi_cont);
        $(kpi_cont).addClass("cat2");
        $(kpi_cont).addClass("pnc");
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5 >Réunions de Coordination</h5></td></tr>');
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Réunions d\'évaluation</h5></td></tr>');
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Plans d\'action</h5></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(axeCt).addClass("pnc");
            $(avn_line).append(axeCt);
            $(axeCt).addClass("pnc");
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].reunion_eval_ids.length + '</h5> </td></tr> ');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].reunion_coor_ids.length + '</h5></td></tr>');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].action_programs_ids.length + '</h5></td></tr>');
        }

    }

    function draw_comprehension(axes) {
        var avn_line = document.createElement('tr');
        $(elemBody).append(avn_line);
        $(avn_line).addClass("gris");
        $(avn_line).append('<td class="pnc"><h4 class="cat1">Compréhension</h4></td>');
        var kpi_cont = document.createElement('td');
        $(avn_line).append(kpi_cont);
        $(kpi_cont).addClass("cat2");
        $(kpi_cont).addClass("pnc");
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Résultats satisfaisants</h5></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(avn_line).append(axeCt);
            $(axeCt).addClass("pnc");
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].stats.compre + '</h5> </td></tr> ');
        }
    }

    function draw_budget(axes) {
        var avn_line = document.createElement('tr');
        $(elemBody).append(avn_line);
        $(avn_line).append('<td class="pnc"><h4 class="cat1">Budget</h4></td>');
        var kpi_cont = document.createElement('td');
        $(avn_line).append(kpi_cont);
        $(kpi_cont).addClass("cat2");
        $(kpi_cont).addClass("pnc");
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Budget Estimé</h5></td></tr>');
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Budget Réel</h5></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(avn_line).append(axeCt);
            $(axeCt).addClass("pnc");
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].stats.budget_estim + '</h5> </td></tr> ');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].stats.budget_reel + '</h5></td></tr>');
        }
    }

    function draw_realisation(axes) {
        var avn_line = document.createElement('tr');
        $(elemBody).append(avn_line);
        $(avn_line).addClass("gris");
        $(avn_line).append('<td class="pnc"><h4 class="cat1">Réalisation</h4></td>');
        var kpi_cont = document.createElement('td');
        $(avn_line).append(kpi_cont);
        $(kpi_cont).addClass("cat2");
        $(kpi_cont).addClass("pnc");
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Taux de réalisation</h5></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(avn_line).append(axeCt);
            $(axeCt).addClass("pnc");
            axes[i].stats.taux_real = Math.round(axes[i].stats.taux_real * 100) / 100;
            if (axes[i].stats.taux_real <= 30)
                $(axeCt).append('<tr class="pnc"><td class="rouge pnc "><h5>' + axes[i].stats.taux_real + ' %</h5> </td></tr> ');
            if (axes[i].stats.taux_real > 30 && axes[i].stats.taux_real < 60)
                $(axeCt).append('<tr class="pnc"><td class="jaune pnc"><h5>' + axes[i].stats.taux_real + ' %</h5> </td></tr> ');
            if (axes[i].stats.taux_real >= 60)
                $(axeCt).append('<tr class="pnc"><td class="vert pnc"><h5>' + axes[i].stats.taux_real + ' %</h5> </td></tr> ');
        }
    }

    function draw_evaliation_line(axes) {
        var eval_line = document.createElement('tr');
        $(elemBody).append(eval_line);
        $(eval_line).append('<td class="pnc"><h4 class="cat1">Evaluation</h4></td>');
        var kpi_cont = document.createElement('td');
        $(eval_line).append(kpi_cont);
        $(kpi_cont).addClass("cat2");
        $(kpi_cont).addClass("pnc");
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Evaluations</h5></td></tr>');
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Inspections</h5></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(eval_line).append(axeCt);
            $(axeCt).addClass("pnc");
            $(axeCt).append('<tr class="pnc"><td class="pnc" ><h5>' + axes[i].fe_ids.length + '</h5> </td></tr> ');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + axes[i].fi_ids.length + '</h5></td></tr>');
        }
    }
    core.view_registry.add('axes', MyView);

});