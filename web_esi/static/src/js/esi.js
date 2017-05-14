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
            var head = document.createElement('thead');
            elemBody = document.createElement('tbody');
            $(table).append(head);
            var head_line = document.createElement('tr');
            $(head).append(head_line);
            $(head_line).append('<th>Action</th>');
            $(head_line).append('<th>Stat</th>');
            $(head_line).append('<th>Commentaire</th>');
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
                    for (var i = 0; i < data.length; i++) {
                        var line = document.createElement('tr');
                        $(elemBody).append(line);
                        $(line).append("<td>" + data[i].id +
                            "</td><td>" + data[i].display_name + "</td><td class=\"gra" + i + "\"></td>");



                    }


                    //return self.on_data_loaded(data, n_group_bys);
                });
            });




            //$(container).append('<table><tr><td><h1>test</h1></td></tr><tr><td>hello</td></tr></table>');
            //$(this.$el).attr("color", "#FF5533");

            // gather the fields to get
            /* var fields = _.compact(_.map(["date_start", "date_delay", "date_stop", "progress"], function(key) {
                return self.fields_view.arch.attrs[key] || '';
            }));
            fields = _.uniq(fields.concat(n_group_bys));
*/
            /* return $.when(this.has_been_loaded).then(function() {
                 return self.dataset.read_slice(fields, {
                     domain: domains,
                     context: contexts
                 }).then(function(data) {
                     console.log("calling on_data_loaded");
                     console.log(data);
                     return self.on_data_loaded(data, n_group_bys);

                 });
             });*/

        },
        on_data_loaded: function(tasks, group_bys) {
            console.log("on_data_loaded Called");
            var self = this;
            var ids = _.pluck(tasks, "id");
            return this.dataset.name_get(ids).then(function(names) {
                var ntasks = _.map(tasks, function(task) {
                    return _.extend({ __name: _.detect(names, function(name) { return name[0] == task.id; })[1] }, task);
                });
                return self.on_data_loaded_2(ntasks, group_bys);
            });
        }

    });


    core.view_registry.add('esi', MyView);


});