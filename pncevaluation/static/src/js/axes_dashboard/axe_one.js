odoo.define('pncevaluation.axe_one', function(require) {
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
        draw_row_add(rowAdds, "purple");
        draw_row_add2(rowAdds, "green");

    }

    function draw_row_add(rowAdds, color) {
        // n contri assistent les contre m invite 
        var divReunions = document.createElement('div');
        $(divReunions).addClass("col-lg-6 col-md-12");
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
        $(nav_tabs_title).append("Réunions");
        $(nav_tabs_wrapper).append(nav_tabs_title);

        var nav_tabs = document.createElement('ul');
        $(nav_tabs).addClass("nav nav-tabs");
        $(nav_tabs).attr("data-tabs", "tabs");
        $(nav_tabs_wrapper).append(nav_tabs);

        $(nav_tabs).append('<li class="active"><a href="#coordination" data-toggle="tab" aria-expanded="true"><i class="material-icons">bug_report</i>Bugs<div class="ripple-container"></div></a></li>');
        $(nav_tabs).append('<li><a href="#evaluation" data-toggle="tab" aria-expanded="false"><i class="material-icons">code</i>Website<div class="ripple-container"></div></a></li>');



        var cardContent = document.createElement('div');
        $(cardContent).addClass("card-content");
        $(cardReunions).append(cardContent);

        var tab_content = document.createElement('div');
        $(cardContent).addClass("tab-content");
        $(cardContent).append(tab_content);

        $(tab_content).append('<div class="tab-pane active" id="coordination">Hello</div>');
        $(tab_content).append('<div class="tab-pane" id="evaluation">Eval :(</div>');
    }

    function draw_row_add2(rowAdds, color) {
        var divStats = document.createElement('div');
        $(divStats).addClass("col-lg-6 col-md-12");
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
            size: 500,
            clipWidth: 500,
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
                    taux = Math.abs(((ecartLastyear - ecratPrelastYear) / ecratPrelastYear).toFixed(2)) * 100;
                    sPourc = taux + '%'
                } else if (ecartLastyear < ecratPrelastYear) {
                    sClass = 'text-danger'
                    iClass = 'fa fa fa-long-arrow-down'
                    taux = Math.abs(((ecratPrelastYear - ecartLastyear) / ecartLastyear).toFixed(2)) * 100;
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
                txtEcart = '<space></space><big class="text-success"> ( ' + ecartLastyear + '%  Restant )</big>'
                $(cardOHeader).attr("data-background-color", "green");
            } else if (ecartLastyear < 0) {
                txtEcart = '<space></space><big class="text-danger"> ( Dépassé de ' + (-ecartLastyear) + '%  ) </big>'
                $(cardOHeader).attr("data-background-color", "red");
            } else {
                txtEcart = '<space></space><big class="text-warning">( Consommé )' + ecartLastyear + ' </big>'
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

        draw_elem_qualite(divQo, "Très bien réalisées", "156", "Actions", "star_rate", "green");
        draw_elem_qualite(divQt, "Bien réalisées", "156", "Actions", "thumb_up", "blue");
        draw_elem_qualite(divQth, "Plus ou moin bien réalisées", "156", "Actions", "thumbs_up_down", "orange");
        draw_elem_qualite(divQf, "Mal réalisées", "156", "Actions", "thumb_down", "red");
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




    core.view_registry.add('axe_one', MyView);

});