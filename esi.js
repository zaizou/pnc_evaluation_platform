odoo.define('web_esi.esi', function(require) {
    var core = require('web.core');
    var View = require('web.View');
    var _lt = core._lt;

    var Model = require('web.DataModel');
    var formats = require('web.formats');
    var time = require('web.time');
    var parse_value = require('web.web_client');
    var form_common = require('web.form_common');
    var elemBody;



    var MyView = View.extend({
        icon: 'fa-briefcase',
        display_name: _lt("ESI view"),
        init: function() {
            console.log("init Called");
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
                console.log("this.dataset.model : " + self.dataset.model);
                console.log("this.dataset");
                console.log(self.dataset);
                console.log(self.fields);
                self.has_been_loaded.resolve();
            });

        },
        start: function() {
            var self = this;
            var container = document.createElement('div');
            $(container).addClass("axe_summary");
            $(self.$el).append(container);
            $(container).append('<h1>Axe 01 : Prévention </h1>');
            var table = document.createElement('table');
            $(container).append(table);
            $(table).addClass("pnc");
            var head = document.createElement('thead');
            $(head).addClass("pnc");
            elemBody = document.createElement('tbody');
            $(table).append(head);
            var head_line = document.createElement('tr');
            $(head_line).addClass("pnc");
            $(head).append(head_line);
            $(head_line).append('<th class="pnc">Domaine</th>');
            $(head_line).append('<th class="pnc">KPI</th>');
            $(head_line).append('<th class="pnc">Valeur</th>');
            $(head_line).append('<th class="pnc">Observation</th>');
            $(table).append(elemBody);
        },
        do_search: function(domains, contexts, group_bys) {
            console.log("doSearch Called");

            var self = this;
            // gather the fields to get
            var fields = _.compact(_.map(["id", "name"], function(key) {
                return self.fields_view.arch.attrs[key] || '';
            }));
            //fields = _.uniq(fields.concat(n_group_bys));
            return $.when(this.has_been_loaded).then(function() {
                return self.dataset.read_slice(fields, {
                    domain: domains,
                    context: contexts
                }).then(function(data) {
                    console.log("calling on_data_loaded");
                    console.log("data is :  " + data);
                    console.log(data);
                    $(elemBody).empty();
                    var line = document.createElement('tr');
                    $(elemBody).append(line);
                    var tdDomaine = document.createElement('td');
                    $(tdDomaine).append("<h2>Avancement<h2/>")
                    $(line).append(tdDomaine);
                    $(line).addClass("pnc");

                    $(tdDomaine).addClass("pnc");
                    var tdKpi = document.createElement('td');
                    $(tdKpi).append('<h3>Réunions de Coordination<h3/>');
                    $(tdKpi).append('<h3>Réunions d\'évaluation<h3/>');
                    $(tdKpi).append('<h3>Contributions<h3/>');
                    $(line).append(tdKpi);

                    var tdValeur = document.createElement('td');
                    $(tdValeur).addClass("pnc");
                    $(tdValeur).append('<h3>10<h3/>');
                    $(tdValeur).append('<h3>10<h3/>');
                    $(tdValeur).append('<h3>15<h3/>');
                    $(line).append(tdValeur);

                    var tdObservation = document.createElement('td');
                    $(tdObservation).addClass("pnc");
                    $(tdObservation).append('<h3><img src=\"/web_esi/static/src/img/arrow/up.png\" /></h3>');
                    $(line).append(tdObservation);
                    $(tdObservation).append('<h3><img src=\"/web_esi/static/src/img/arrow/up.png\" /></h3>');
                    $(line).append(tdObservation);
                    $(tdObservation).append('<h3><img src=\"/web_esi/static/src/img/arrow/up.png\" /></h3>');
                    $(line).append(tdObservation);





                    //var img = (ecart > 0) ? "up.png" : "down.png";
                    /* for (var i = 0; i < data.length; i++) {
                         var line = document.createElement('tr');
                         $(elemBody).append(line);
                         $(line).append("<td>" + data[i].id +
                             "</td><td>" + data[i].display_name + "</td><td class=\"gra" + i + "\"><img src=\"/web_esi/static/src/img/arrow/up.png\" /></td>");
                     }*/
                    //return self.on_data_loaded(data, n_group_bys);
                });
            });
        },
    });
    core.view_registry.add('esi', MyView);
});