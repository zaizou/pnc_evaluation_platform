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
    var countResSat = 0;
    var totBE = 0;
    var totBR = 0;
    var countEval = 0
    var countInsp = 0



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
            $(self.$el).append(container);
            //$(container).append('<h1>Axe 01 : Prévention </h1>');
            var card = document.createElement('div');
            $(container).addClass("card");
            $(container).append(card);
            var cardHeader = document.createElement('div');
            $(cardHeader).addClass("card-header");
            $(cardHeader).attr('data-background-color', 'green');
            $(card).append(cardHeader);
            $(cardHeader).append('<h4 class="title">Table comparative des axes</h4><p class="category">Comparaison entre les indicateurs des axes</p>');

            var cardContent = document.createElement('div');
            $(cardContent).addClass("card-content table-responsive");
            $(card).append(cardContent);






            table = document.createElement('table');
            $(cardContent).append(table);
            $(table).addClass("axes_table");
            $(table).addClass("axes_table");
            $(table).addClass("pnc");
            //$(container).append(table);
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
                    $(head_line).append('<th class="pnc"><h4> Total<h4></th>');

                    $(elemBody).empty();
                    self.rpc('/pncevaluation/get_axes_stats', { axes_ids: axes_ids, date_debut: "1", date_fin: "2" }).done(function(result) {
                        $('.o_control_panel').attr('style', 'display:none');
                        console.log("table");
                        console.log(result);

                        for (var i = 0; i < axesTable.length; i++)
                            for (var j = 0; j < result.length; j++)
                                if (axesTable[i].id == result[j].axe_id)
                                    axesTable[i].stats = result[j];

                        console.log("axesTable");

                        console.log(axesTable);
                        draw_avancement_line(axesTable);
                        draw_comprehension(axesTable);
                        draw_budget(axesTable);
                        draw_realisation(axesTable);
                        draw_evaliation_line(axesTable);

                    });


                });


            });


        },
        destroy: function() {
            $('.o_control_panel').attr('style', 'display:');
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
        $(kpi_cont).append('<tr class="pnc"><td class="pnc"><h5>Programmes d\'action</h5></td></tr>');
        var reu_coord_sum = 0;
        var reu_eval_sum = 0;
        var pas_sum = 0;
        countResSat = 0
        totBE = 0;
        totBR = 0;
        for (var j = 0; j < axesTable.length; j++) {
            console.log("reun coord length");

            countResSat += axesTable[j].stats.compre;;
            totBE += axesTable[j].stats.budget_estim;
            totBR += axesTable[j].stats.budget_reel;;
            countEval += axesTable[j].stats.eval_sub;
            countInsp += axesTable[j].stats.inspec;

            reu_eval_sum += axesTable[j].stats.reunions_eval;
            reu_coord_sum += axesTable[j].stats.reunions_coord;
            pas_sum += axesTable[j].stats.plans_action;
        }
        console.log("sums");
        console.log(reu_eval_sum);
        console.log(reu_coord_sum);
        console.log(pas_sum);

        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(axeCt).addClass("pnc");
            $(avn_line).append(axeCt);
            $(axeCt).addClass("pnc");
            if (reu_eval_sum)
                $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((axesTable[i].stats.reunions_coord / reu_coord_sum) * 100).toFixed(2) + '%</h5> </td></tr> ');
            else
                $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>Non calculé</h5> </td></tr> ');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((axesTable[i].stats.reunions_eval / reu_eval_sum) * 100).toFixed(2) + '%</h5></td></tr>');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((axesTable[i].stats.plans_action / pas_sum) * 100).toFixed(2) + '%</h5></td></tr>');
        }
        //$(axeCt).append('<tr class="pnc"><td class="pnc"><h5>%</h5> </td></tr> ');
        $(avn_line).append('<td>100%</td>');

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
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((axes[i].stats.compre / countResSat) * 100).toFixed(2) + '%</h5> </td></tr> ');
        }
        $(avn_line).append('<td>100%</td>');
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

            var ecartBudg = axes[i].stats.budget_estim - axes[i].stats.budget_reel
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((axesTable[i].stats.budget_estim / totBE) * 100).toFixed(2) + '%</h5> </td></tr> ');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((axesTable[i].stats.budget_reel / totBR) * 100).toFixed(2) + '%</h5></td></tr>');
        }
        $(avn_line).append('<td>100%</td>');
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
                $(axeCt).append('<tr class="pnc"><td class="text-warning pnc"><h5>' + axes[i].stats.taux_real + ' %</h5> </td></tr> ');
            if (axes[i].stats.taux_real >= 60)
                $(axeCt).append('<tr class="pnc"><td class="text-success pnc"><h5>' + axes[i].stats.taux_real + ' %</h5> </td></tr> ');
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
            $(axeCt).append('<tr class="pnc"><td class="pnc" ><h5>' + ((axes[i].fe_ids.length / countEval) * 100).toFixed(2) + '%</h5> </td></tr> ');
            $(axeCt).append('<tr class="pnc"><td class="pnc"><h5>' + ((countInsp > 0) ? ((axes[i].fi_ids.length / countInsp) * 100).toFixed(2) : 0) + '%</h5></td></tr>');
        }
        $(eval_line).append('<td>100%</td>');
    }
    core.view_registry.add('axes', MyView);

});