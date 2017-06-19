odoo.define('pncevaluation.axe_three', function(require) {
    "use strict";
    var core = require('web.core');
    var View = require('web.View');
    var _lt = core._lt;

    var Model = require('web.DataModel');
    var formats = require('web.formats');
    var time = require('web.time');
    var parse_value = require('web.web_client');
    var form_common = require('web.form_common');
    var title;
    var container;
    var data_source;

    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };

    Array.prototype.min = function() {
        return Math.min.apply(null, this);
    };


    var MyView = View.extend({
        icon: 'fa-briefcase',
        display_name: _lt("Axe 01 view"),
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

        },
        do_search: function(domains, contexts, group_bys) {
            $(container).empty();

            var self = this;
            var isAxeVide = true;
            var fields = _.compact(_.map(["id", "name"], function(key) {
                return self.fields_view.arch.attrs[key] || '';
            }));
            return $.when(this.has_been_loaded).then(function() {
                return self.dataset.read_slice(fields, {
                    domain: domains,
                    context: contexts
                }).then(function(data) {
                    self.rpc("/pncevaluation/get_dashboard_stats", { numero_axe: 1 }).done(function(result) {
                        console.log("Stats Axe 01 :::");
                        console.log(result);
                        container = document.createElement('div');
                        $(container).addClass("axe_summary");
                        $(container).addClass("wrapper content");
                        $(self.$el).append(container);
                        data_source = result;


                        function sortNumber(a, b) {
                            return a.annee - b.annee;
                        }
                        if (typeof data_source.budgets != 'undefined')
                            data_source.budgets.sort(sortNumber);

                        draw_dashboard(data[0].name, container);
                    });


                });
            });
        }

    });


    function draw_dashboard(dashboard_name, container) {
        $(title).empty();
        $(title).append('<h1>' + dashboard_name + '</h1>');

        var container_fluid = document.createElement('div');
        $(container_fluid).addClass("container-fluid");
        $(container).append(container_fluid);
        //
        var rowQualite = document.createElement('div');
        $(rowQualite).addClass("row");
        $(container_fluid).append(rowQualite);
        draw_row_qualite(rowQualite);
        //
        var rowStats = document.createElement('div');
        $(rowStats).addClass("row");
        $(container_fluid).append(rowStats);
        draw_row_stats(rowStats);
        //
        var rowAdds = document.createElement('div');
        $(rowAdds).addClass("row");
        $(container_fluid).append(rowAdds);
        draw_row_add_coordination(rowAdds, "purple");
        draw_row_add_evaluation(rowAdds, "purple");

        var rowAdds2 = document.createElement('div');
        $(rowAdds2).addClass("row");
        $(container_fluid).append(rowAdds2);
        draw_row_add2(rowAdds, "green");

    }

    function draw_row_add_coordination(rowAdds, color) {
        // n contri assistent les contre m invite 
        var divReunions = document.createElement('div');
        $(divReunions).addClass("col-lg-4 col-md-12");
        $(rowAdds).append(divReunions);

        var cardReunions = document.createElement('div');
        $(cardReunions).addClass("card card-nav-tabs");
        $(divReunions).append(cardReunions);

        var cardHeader = document.createElement('div');
        $(cardHeader).addClass("card-header");
        $(cardHeader).attr("data-background-color", color);
        $(cardReunions).append(cardHeader);

        var nav_tabs_navigation = document.createElement('div');
        $(nav_tabs_navigation).addClass("nav-tabs-navigation");
        $(cardHeader).append(nav_tabs_navigation);

        var nav_tabs_wrapper = document.createElement('div');
        $(nav_tabs_wrapper).addClass("nav-tabs-wrapper");
        $(nav_tabs_navigation).append(nav_tabs_wrapper);

        var nav_tabs_title = document.createElement('span');
        $(nav_tabs_title).append("<big>Réunions de coordination :</big>");
        $(nav_tabs_wrapper).append(nav_tabs_title);

        var nav_tabs = document.createElement('ul');
        $(nav_tabs).addClass("nav nav-tabs");
        $(nav_tabs).attr("data-tabs", "tabs");
        $(nav_tabs_wrapper).append(nav_tabs);

        $(nav_tabs).append('<li class="reu_coor_tab active"><a href="#coordination" data-toggle="tab" aria-expanded="true"><i class="material-icons">date_range</i>Réunions<div class="ripple-container"></div></a></li>');
        $(nav_tabs).append('<li><a href="#top_act" data-toggle="tab" aria-expanded="false"><i class="material-icons">stars</i>Top 10 Actions<div class="ripple-container"></div></a></li>');
        $(nav_tabs).append('<li><a href="#top_pa" data-toggle="tab" aria-expanded="false"><i class="material-icons">stars</i>Top 5 Programmes Action<div class="ripple-container"></div></a></li>');



        var cardContent = document.createElement('div');
        $(cardContent).addClass("card-content");
        $(cardReunions).append(cardContent);

        var tab_content = document.createElement('div');
        $(tab_content).addClass("tab-content");
        $(cardContent).append(tab_content);

        // var tabPaneReuCoor = document.createElement('div');
        // $(tab_content).addClass("tab-pane");
        // $(nav_tabs).attr("id", "coordination");
        // var tabPaneTopAct = document.createElement('div');
        // $(tab_content).addClass("tab-pane");
        // $(nav_tabs).attr("id", "top_act");
        // var tabPaneTopPa = document.createElement('div');
        // $(tab_content).addClass("tab-pane");
        // $(nav_tabs).attr("id", "top_pa");
        // var tabPaneReuEval = document.createElement('div');
        // $(tab_content).addClass("tab-pane");
        // $(nav_tabs).attr("id", "evaluation");
        // var tabPaneTopActEval = document.createElement('div');
        // $(tab_content).addClass("tab-pane");
        // $(nav_tabs).attr("id", "top_act_eval");

        var tabPane1 = document.createElement('div');
        $(tabPane1).addClass('tab-pane active');
        $(tabPane1).attr('id', 'coordination')
        $(tab_content).append(tabPane1);


        var tableCoordination = document.createElement('table');
        $(tableCoordination).addClass('table');
        $(tabPane1).append(tableCoordination);
        var tbodyCoordination = document.createElement('tbody');
        $(tableCoordination).append(tbodyCoordination);

        var taux_par = ((data_source.reunions.coordination.particip / data_source.reunions.coordination.invit) * 100).toFixed(2)
        var moyInv = Math.round(data_source.reunions.coordination.invit / data_source.reunions.coordination.count);
        var tr1 = document.createElement('tr');
        $(tr1).append('<h3>Une moyenne de ' + moyInv + ' invités par réunion</h3>');
        $(tbodyCoordination).append(tr1);

        var tr2 = document.createElement('tr');
        var strP = ""
        if (taux_par < 40) {
            $(tr2).append('<h3>Taux de présence au réunions : <span class="text-danger">' + taux_par + '%</span></h3>');
            $(cardHeader).attr("data-background-color", "red");
        } else if (taux_par < 70) {
            $(tr2).append('<h3>Taux de présence au réunions : <span class="text-warning">' + taux_par + '%</span></h3>');
            $(cardHeader).attr("data-background-color", "orange");
        } else {
            $(tr2).append('<h3>Taux de présence au réunions : <span class="text-success">' + taux_par + '%</span></h3>');
            $(cardHeader).attr("data-background-color", "green");
        }

        $(tbodyCoordination).append(tr2);


        var tabPane2 = document.createElement('div');
        $(tabPane2).addClass('tab-pane');
        $(tabPane2).attr('id', 'top_act')
        $(tab_content).append(tabPane2);

        var tableCoordination2 = document.createElement('table');
        $(tableCoordination2).addClass('table');
        $(tabPane2).append(tableCoordination2);
        var thead = document.createElement('thead');
        $(tableCoordination2).append(thead);
        var tbodyCoordination2 = document.createElement('tbody');
        $(tableCoordination2).append(tbodyCoordination2);

        $(thead).append('<tr><th>Ordre</th><th>Intitulé</th><th>Nombre de réunions programmées</th></tr>');


        function sortNumber2(a, b) {
            return b.count - a.count;
        }
        data_source.reunions.coordination.actions.sort(sortNumber2);
        for (var i = 0; i < data_source.reunions.coordination.actions.length; i++) {
            if (i > 10)
                break;
            var line = document.createElement('tr');
            $(tbodyCoordination2).append(line);
            $(line).append('<td>' + (i + 1) + '</td><td>' + data_source.reunions.coordination.actions[i].name + '</td><td>' + data_source.reunions.coordination.actions[i].count + '</td>')
        }



        var tabPane3 = document.createElement('div');
        $(tabPane3).addClass('tab-pane');
        $(tabPane3).attr('id', 'top_pa')
        $(tab_content).append(tabPane3);

        var tableCoordination3 = document.createElement('table');
        $(tableCoordination3).addClass('table');
        $(tabPane3).append(tableCoordination3);
        var thead = document.createElement('thead');
        $(tableCoordination3).append(thead);
        var tbodyCoordination3 = document.createElement('tbody');
        $(tableCoordination3).append(tbodyCoordination3);

        $(thead).append('<tr><th>Ordre</th><th>Intitulé</th><th>Nombre de réunions programmées</th></tr>');


        function sortNumber2(a, b) {
            return b.count - a.count;
        }
        data_source.reunions.coordination.pas.sort(sortNumber2);
        for (var i = 0; i < data_source.reunions.coordination.actions.length; i++) {
            if (i > 5)
                break;
            var line = document.createElement('tr');
            tbodyCoordination3.append(line);
            $(line).append('<td>' + (i + 1) + '</td><td>' + data_source.reunions.coordination.pas[i].name + '</td><td>' + data_source.reunions.coordination.pas[i].count + '</td>')
        }








    }

    function draw_row_add_evaluation(rowAdds, color) {
        // n contri assistent les contre m invite 
        var divReunions = document.createElement('div');
        $(divReunions).addClass("col-lg-4 col-md-12");
        $(rowAdds).append(divReunions);

        var cardReunions = document.createElement('div');
        $(cardReunions).addClass("card card-nav-tabs");
        $(divReunions).append(cardReunions);

        var cardHeader = document.createElement('div');
        $(cardHeader).addClass("card-header");
        $(cardHeader).attr("data-background-color", color);
        $(cardReunions).append(cardHeader);

        var nav_tabs_navigation = document.createElement('div');
        $(nav_tabs_navigation).addClass("nav-tabs-navigation");
        $(cardHeader).append(nav_tabs_navigation);

        var nav_tabs_wrapper = document.createElement('div');
        $(nav_tabs_wrapper).addClass("nav-tabs-wrapper");
        $(nav_tabs_navigation).append(nav_tabs_wrapper);

        var nav_tabs_title = document.createElement('span');
        $(nav_tabs_title).append("<big>Réunions d\'évaluation :</big>");
        $(nav_tabs_wrapper).append(nav_tabs_title);

        var nav_tabs = document.createElement('ul');
        $(nav_tabs).addClass("nav nav-tabs");
        $(nav_tabs).attr("data-tabs", "tabs");
        $(nav_tabs_wrapper).append(nav_tabs);



        $(nav_tabs).append('<li><a href="#evaluation" data-toggle="tab" aria-expanded="false"><i class="material-icons">date_range</i>Réunions<div class="ripple-container"></div></a></li>');
        $(nav_tabs).append('<li><a href="#top_act_eval" data-toggle="tab" aria-expanded="false"><i class="material-icons">stars</i>Top 10 Action<div class="ripple-container"></div></a></li>');



        var cardContent = document.createElement('div');
        $(cardContent).addClass("card-content");
        $(cardReunions).append(cardContent);

        var tab_content = document.createElement('div');
        $(tab_content).addClass("tab-content");
        $(cardContent).append(tab_content);

        // var tabPaneReuEval = document.createElement('div');
        // $(tabPaneReuEval).addClass("tab-pane");
        // $(tabPaneReuEval).attr("id", "coordination");
        // var tabPaneTopAct = document.createElement('div');
        // $(tabPaneTopAct).addClass("tab-pane");
        // $(tabPaneTopAct).attr("id", "top_act_eval");


        var tabPane1 = document.createElement('div');
        $(tabPane1).addClass('tab-pane active');
        $(tabPane1).attr('id', 'evaluation')
        $(tab_content).append(tabPane1);


        var tableEvaluation = document.createElement('table');
        $(tableEvaluation).addClass('table');
        $(tabPane1).append(tableEvaluation);
        var tbodyEvaluation = document.createElement('tbody');
        $(tableEvaluation).append(tbodyEvaluation);

        var taux_par = ((data_source.reunions.evaluation.particip / data_source.reunions.evaluation.invit) * 100).toFixed(2)
        var moyInv = Math.round(data_source.reunions.evaluation.invit / data_source.reunions.evaluation.count);
        var tr1 = document.createElement('tr');
        $(tr1).append('<h3>Une moyenne de ' + moyInv + ' invités par réunion</h3>');
        $(tbodyEvaluation).append(tr1);

        var tr2 = document.createElement('tr');
        var strP = ""
        if (taux_par < 40) {
            $(tr2).append('<h3>Taux de présence au réunions : <span class="text-danger">' + taux_par + '%</span></h3>');
            $(cardHeader).attr("data-background-color", "red");
        } else if (taux_par < 70) {
            $(tr2).append('<h3>Taux de présence au réunions : <span class="text-warning">' + taux_par + '%</span></h3>');
            $(cardHeader).attr("data-background-color", "orange");
        } else {
            $(tr2).append('<h3>Taux de présence au réunions : <span class="text-success">' + taux_par + '%</span></h3>');
            $(cardHeader).attr("data-background-color", "green");
        }

        $(tbodyEvaluation).append(tr2);


        var tabPane2 = document.createElement('div');
        $(tabPane2).addClass('tab-pane');
        $(tabPane2).attr('id', 'top_act_eval')
        $(tab_content).append(tabPane2);

        var tableEvaluation2 = document.createElement('table');
        $(tableEvaluation2).addClass('table');
        $(tabPane2).append(tableEvaluation2);
        var thead = document.createElement('thead');
        $(tableEvaluation2).append(thead);
        var tbodyEvaluation2 = document.createElement('tbody');
        $(tableEvaluation2).append(tbodyEvaluation2);

        $(thead).append('<tr><th>Ordre</th><th>Intitulé</th><th>Nombre de réunions programmées</th></tr>');


        function sortNumber2(a, b) {
            return b.count - a.count;
        }
        data_source.reunions.evaluation.actions.sort(sortNumber2);
        for (var i = 0; i < data_source.reunions.evaluation.actions.length; i++) {
            if (i > 10)
                break;
            var line = document.createElement('tr');
            $(tableEvaluation2).append(line);
            $(line).append('<td>' + (i + 1) + '</td><td>' + data_source.reunions.evaluation.actions[i].name + '</td><td>' + data_source.reunions.evaluation.actions[i].count + '</td>')
        }


    }



    function draw_row_add2(rowAdds, color) {
        var divStats = document.createElement('div');
        $(divStats).addClass("col-lg-4 col-md-12");
        $(rowAdds).append(divStats);
        var cardStats = document.createElement('div');
        $(cardStats).addClass("card");
        $(divStats).append(cardStats);

        var cardOHeader = document.createElement('div');
        $(cardOHeader).addClass("card-header");
        $(cardOHeader).attr("data-background-color", color);
        $(cardStats).append(cardOHeader);

        var category = document.createElement('p');
        $(category).addClass("category");
        $(category).append("Statistiques sur les actions et l\'avancement");
        var title = document.createElement('h3');
        $(title).append("Statistiques");
        $(cardOHeader).append(title);
        $(cardOHeader).append(category);



        var cardOContent = document.createElement('div');
        $(cardOContent).addClass("card-content");
        $(cardStats).append(cardOContent);

        var tab = document.createElement('table');
        $(cardOContent).append(tab);

        var tauxRD = ((data_source.count_retard_fin / data_source.count_total_act) * 100).toFixed(2);


        var tr1 = document.createElement('tr');
        if (tauxRD > 50) {
            $(tr1).append('<h3>Taux d\'ations en retard (début) : <span class="text-danger">' + tauxRD + '%</span><h3>')
            $(cardOHeader).attr("data-background-color", "red");
        } else if (tauxRD > 0) {
            $(tr1).append('<h3>Taux d\'ations en retard (début) : <span class="text-warning">' + tauxRD + '%</span></h3>')
            $(cardOHeader).attr("data-background-color", "orange");
        } else {
            $(tr1).append('<h3>Taux d\'ations en retard (début) : <span class="text-success">' + tauxRD + '%</span></h3>')
            $(cardOHeader).attr("data-background-color", "green");
        }
        var tauxRF = ((data_source.count_retard_debut / data_source.count_total_act) * 100).toFixed(2);
        var tr2 = document.createElement('tr');
        if (tauxRF > 50) {
            $(tr2).append('<h3>Taux d\'ations en retard (fin) : <span class="text-danger">' + tauxRF + '%</span></h3>')
            $(cardOHeader).attr("data-background-color", "red");
        } else if (tauxRF > 0 && tauxRD < 50) {
            $(tr2).append('<h3>Taux d\'ations en retard (fin) : <span class="text-warning">' + tauxRF + '%</span></h3>')
            $(cardOHeader).attr("data-background-color", "orange");
        }
        if (tauxRF == 0 && tauxRD == 0) {
            $(tr2).append('<h3>Taux d\'ations en retard (fin) : <span class="text-success">' + tauxRF + '%</span></h3>')
            $(cardOHeader).attr("data-background-color", "green");
        }

        $(tab).append(tr1);
        $(tab).append(tr2);






    }


    function draw_row_stats(rowStats) {
        var divBudget = document.createElement('div');
        $(divBudget).addClass("col-md-4");
        $(rowStats).append(divBudget);

        var divReal = document.createElement('div');
        $(divReal).addClass("col-md-4");
        $(rowStats).append(divReal);

        var divCorr = document.createElement('div');
        $(divCorr).addClass("col-md-4");
        $(rowStats).append(divCorr);

        draw_elem_stats(divBudget, "budget_chart", "Hausse", "<big>Budget</big>", "", "", "red");
        draw_elem_stats(divReal, "appr_chart", "Hausse", "<big>Appréciation </big>", "unit", "", "green");
        draw_elem_stats(divCorr, "corr_chart", "Hausse", "<big>Correspondence </big>", "unit", "compare_arrows", "yellow");

    }

    function draw_budget_chart() {
        var labels = []
        var series = []

        for (var i = 0; i < data_source.budgets.length; i++) {
            labels.push('' + data_source.budgets[i].annee);
            series.push(data_source.budgets[i].ecart);
        }
        var budgetChart = {
            labels: labels,
            series: [
                series
            ]
        };
        console.log("high");
        console.log(series.max());
        console.log("min");
        console.log(series.min());
        var optionsbudget = {
            axisX: {
                showGrid: true
            },
            axisY: {
                showGrid: true,
                labelInterpolationFnc: function(value) {
                    return value * 100 + '%';

                }
            },
            low: series.min() - Math.abs(series.min()) * 0.5,
            high: series.max() + series.max() * 0.5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 5, right: 5, bottom: 5, left: 5 },
        }

        var responsiveOptions = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value[0];
                    }
                }
            }]
        ];


        console.log("series in draw_budget_chart");
        console.log(series);
        var budget = new Chartist.Line('#budget_chart', budgetChart, optionsbudget, responsiveOptions);
        md.startAnimationForLineChart(budget);
    }

    function draw_appreciation_chart() {
        $('#appr_chart').addClass('appr_chart');
        var powerGauge = gauge('#appr_chart', {
            size: 400,
            clipWidth: 400,
            clipHeight: 150,
            ringWidth: 60,
            maxValue: 100,
            transitionMs: 4000,
        });
        powerGauge.render();
        powerGauge.update(data_source.count_qualite.appreciation);
        //md.startAnimationForLineChart(appreciation);
    }

    function draw_elem_stats(divStat, chart_id, data_title, data, unit, icon, color) {
        var cardQo = document.createElement('div');
        $(cardQo).addClass("card");
        $(divStat).append(cardQo);

        var cardOHeader = document.createElement('div');
        if (icon) {
            $(cardOHeader).addClass("card-header");
            $(cardOHeader).attr("data-background-color", color);
            $(cardQo).append(cardOHeader);

            var str = '<i class="material-icons">' + icon + '</i>'
            $(cardOHeader).append(str)
        } else {
            $(cardOHeader).addClass("card-header card-chart");
            $(cardOHeader).attr("data-background-color", color);
            var chart = document.createElement('div');
            //data_source
            $(chart).addClass("ct-chart");
            $(chart).attr("id", chart_id);
            $(cardQo).append(cardOHeader);
            $(cardOHeader).append(chart);
            if (chart_id == "budget_chart")
                draw_budget_chart();
        }


        var cardOContent = document.createElement('div');
        $(cardOContent).addClass("card-content");
        $(cardQo).append(cardOContent);

        var category = document.createElement('p');
        $(category).addClass("category");
        var str2 = "";
        var strP = "";
        var title = document.createElement('h3');
        $(title).addClass("title");
        if (chart_id == "budget_chart") {
            var ecartLastyear = (data_source.budgets[data_source.budgets.length - 1].ecart) * 100;
            var lastYear = data_source.budgets[data_source.budgets.length - 1].annee;
            if (data_source.budgets.length >= 2) {
                var prelastYear = data_source.budgets[data_source.budgets.length - 2].annee;
                var ecratPrelastYear = (data_source.budgets[data_source.budgets.length - 2].ecart) * 100;

                var taux;
                var sClass;
                var iClass;
                var comment;
                console.log("ecarts");
                console.log("last");
                console.log(ecartLastyear)
                console.log("prelast");
                console.log(ecratPrelastYear);
                var sPourc = taux + '%'
                if (ecartLastyear > ecratPrelastYear) {
                    sClass = 'text-success'
                    iClass = 'fa fa fa-long-arrow-up'
                    taux = Math.abs(((((ecartLastyear - ecratPrelastYear) / ecratPrelastYear)) * 100).toFixed(2));
                    sPourc = taux.toFixed(2) + '%'
                } else if (ecartLastyear < ecratPrelastYear) {
                    sClass = 'text-danger'
                    iClass = 'fa fa fa-long-arrow-down'
                    taux = Math.abs(((((ecratPrelastYear - ecartLastyear) / ecartLastyear)) * 100).toFixed(2));
                    sPourc = taux + '%'

                } else {
                    iClass = ''
                    sPourc = "Pas d\'écart";
                }

                strP = '<big><span class="' + sClass + '"><i class="' + iClass + '"></i>  ' + sPourc + '</span>'
                strP += "  par rapport à l\'an dernier</big>"
                    //$(category).append(strP);
            }


            var txtEcart;
            if (ecartLastyear > 0) {
                txtEcart = '<space></space><big class="text-success"> ( ' + ecartLastyear.toFixed(2) + '%  Restant )</big>'
                $(cardOHeader).attr("data-background-color", "green");
            } else if (ecartLastyear < 0) {
                txtEcart = '<space></space><big class="text-danger"> ( Dépassé de ' + (-ecartLastyear).toFixed(2) + '%  ) </big>'
                $(cardOHeader).attr("data-background-color", "red");
            } else {
                txtEcart = '<space></space><big class="text-warning">( Consommé )' + ecartLastyear.toFixed(2) + ' </big>'
                $(cardOHeader).attr("data-background-color", "orange");
            }
            str2 = data + txtEcart + '<smal>' + unit + '</smal>'
        }
        if (chart_id == "appr_chart") {
            draw_appreciation_chart();
            if (data_source.count_qualite.appreciation < 40) {
                txtEcart = '<big class="text-danger"> ( ' + data_source.count_qualite.appreciation + '% )</big>'
                $(cardOHeader).attr("data-background-color", "red");
            } else if (data_source.count_qualite.appreciation < 70) {
                txtEcart = '<big class="text-warning"> ( ' + data_source.count_qualite.appreciation + '% )</big>'
                $(cardOHeader).attr("data-background-color", "orange");
            } else {
                txtEcart = '<big class="text-success"> ( ' + data_source.count_qualite.appreciation + '% )</big>'
                $(cardOHeader).attr("data-background-color", "green");
            }

            str2 = data + txtEcart;
            //strP = data + txtEcart;
            console.log("str2");
            console.log(str2);
        }

        if (chart_id == "corr_chart") {
            data_source.correspond *= 100;
            if (data_source.correspond < 40) {
                txtEcart = '<big class="text-danger">( ' + data_source.correspond + '% des actions de PA )</big>'
                $(cardOHeader).attr("data-background-color", "red");
            } else if (data_source.correspond < 70) {
                txtEcart = '<big class="text-warning">( ' + data_source.correspond + '% des actions de PA )</big>'
                $(cardOHeader).attr("data-background-color", "orange");
            } else {
                txtEcart = '<big class="text-sucess">( ' + data_source.correspond + '% des actions de PA )</big>'
                $(cardOHeader).attr("data-background-color", "green");
            }
            str2 = data + txtEcart;
        }
        $(title).append(str2);
        $(category).append(strP);
        $(cardOContent).append(title);
        $(cardOContent).append(category);
        var cardOFooter = document.createElement('div');
        $(cardOFooter).addClass("card-footer");
        $(cardQo).append(cardOFooter);

    }

    function draw_row_qualite(rowQualite) {
        var divQo = document.createElement('div');
        $(divQo).addClass("col-lg-3 col-md-6 col-sm-6");
        $(rowQualite).append(divQo);


        var divQt = document.createElement('div');
        $(divQt).addClass("col-lg-3 col-md-6 col-sm-6");
        $(rowQualite).append(divQt);

        var divQth = document.createElement('div');
        $(divQth).addClass("col-lg-3 col-md-6 col-sm-6");
        $(rowQualite).append(divQth);

        var divQf = document.createElement('div');
        $(divQf).addClass("col-lg-3 col-md-6 col-sm-6");
        $(rowQualite).append(divQf);

        draw_elem_qualite(divQo, "Très bien réalisées", "" + data_source.count_qualite.count_tbr, " appréciations", "star_rate", "green");
        draw_elem_qualite(divQt, "Bien réalisées", "" + data_source.count_qualite.count_br, " appréciations", "thumb_up", "blue");
        draw_elem_qualite(divQth, "Plus ou moin bien réalisées", "" + data_source.count_qualite.count_pmbr, " appréciations", "thumbs_up_down", "orange");
        draw_elem_qualite(divQf, "Mal réalisées", "" + data_source.count_qualite.count_ml, " appréciations", "thumb_down", "red");
    }


    function draw_elem_qualite(divQo, data_title, data, unit, icon, color) {
        var cardQo = document.createElement('div');
        $(cardQo).addClass("card card-stats");
        $(divQo).append(cardQo);

        var cardOHeader = document.createElement('div');
        $(cardOHeader).addClass("card-header");
        $(cardOHeader).attr("data-background-color", color);
        $(cardQo).append(cardOHeader);

        var str = '<i class="material-icons">' + icon + '</i>'
        $(cardOHeader).append(str)


        var cardOContent = document.createElement('div');
        $(cardOContent).addClass("card-content");
        $(cardQo).append(cardOContent);

        var category = document.createElement('p');
        $(category).addClass("category");
        $(category).append(data_title);

        var title = document.createElement('h3');
        $(title).addClass("title");
        var str2 = data + '<smal>  ' + unit + '</smal>'
        $(title).append(str2);

        $(cardOContent).append(category);
        $(cardOContent).append(title);




        var cardOFooter = document.createElement('div');
        $(cardOFooter).addClass("card-footer");
        $(cardQo).append(cardOFooter);



    }




    core.view_registry.add('axe_three', MyView);

});