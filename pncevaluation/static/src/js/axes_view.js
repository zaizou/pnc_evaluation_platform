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
                    $(head).append(head_line);
                    $(head_line).append('<th>.</th>');
                    $(head_line).append('<th>KPI</th>');
                    for (var i = 0; i < data.length; i++)
                        $(head_line).append('<th><h2>' + data[i].name + '</h2></th>');
                    $(elemBody).empty();
                    draw_avancement_line(data);
                    draw_evaliation_line(data);


                });
            });
        },


    });

    function draw_avancement_line(axes) {
        var avn_line = document.createElement('tr');
        $(elemBody).append(avn_line);
        $(avn_line).append('<td><h2>Avancement</h2></td>');
        var kpi_cont = document.createElement('td');
        $(avn_line).append(kpi_cont);
        $(kpi_cont).append('<tr><td><h4>Réunions de Coordination</h4></td></tr>');
        $(kpi_cont).append('<tr><td><h4>Réunions d\'évaluation</h4></td></tr>');
        $(kpi_cont).append('<tr><td><h4>Plans d\'action</h4></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(avn_line).append(axeCt);
            $(axeCt).append('<tr><td><h4>' + axes[i].reunion_eval_ids.length + '</h4> </td></tr> ');
            $(axeCt).append('<tr><td><h4>' + axes[i].reunion_coor_ids.length + '</h4></td></tr>');
            $(axeCt).append('<tr><td><h4>' + axes[i].action_programs_ids.length + '</h4></td></tr>');
        }

    }

    function draw_evaliation_line(axes) {
        var eval_line = document.createElement('tr');
        $(elemBody).append(eval_line);
        $(eval_line).append('<td><h2>Evaluation</h2></td>');
        var kpi_cont = document.createElement('td');
        $(eval_line).append(kpi_cont);
        $(kpi_cont).append('<tr><td><h4>Evaluations</h4></td></tr>');
        $(kpi_cont).append('<tr><td><h4>Inspections</h4></td></tr>');
        for (var i = 0; i < axes.length; i++) {
            var axeCt = document.createElement('td');
            $(eval_line).append(axeCt);
            $(axeCt).append('<tr><td><h4>' + axes[i].fe_ids.length + '</h4> </td></tr> ');
            $(axeCt).append('<tr><td><h4>' + axes[i].fi_ids.length + '</h4></td></tr>');
        }
    }
    core.view_registry.add('axes', MyView);

});