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
    var elemBody;
    var objectifsD;
    var actionsD;
    var iteration;
    var tabActions = new Array();
    var actionsStats;
    var title;
    var headerAspect;
    var headerObject;
    var headerAction;

    var container;


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
            container = document.createElement('div');
            $(container).addClass("axe_summary");
            $(container).addClass("wrapper");
            $(self.$el).append(container);


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
                    $(title).empty();
                    $(title).append('<h1>' + data[0].name + '</h1>');

                    self.rpc("/pncevaluation/get_dashboard_stats", { numero_axe: 1 }).done(function(result) {
                        console.log("Stats Axe 01 :::");
                        console.log(result);

                    });


                });
            });
        }

    });



    core.view_registry.add('axe_one', MyView);

});