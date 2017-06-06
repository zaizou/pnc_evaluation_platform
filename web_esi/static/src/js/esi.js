odoo.define('web_esi.esi', function(require) {
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


    var MyView = View.extend({
        icon: 'fa-briefcase',
        display_name: _lt("ESI view"),
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
            $(container).addClass("wrapper");
            $(self.$el).append(container);
            title = document.createElement('div');
            $(container).append(title);

            var table = document.createElement('table');
            $(container).addClass("table");
            $(container).append(table);
            var head = document.createElement('thead');
            elemBody = document.createElement('tbody');
            $(table).append(head);
            var head_line = document.createElement('tr');
            $(head).addClass("row header");
            $(head).append(head_line);
            $(head_line).append('<th class="cell">Objectif</th>');
            $(head_line).append('<th class="cell">Action</th>');
            $(head_line).append('<th class="cell">Etat (Contributeurs)</th>');
            $(head_line).append('<th class="cell">Qualité de réalisation (Contributeurs)</th>');
            $(head_line).append('<th class="cell">Résultats (Contributeurs)</th>');
            $(head_line).append('<th class="cell">.</th>');
            $(head_line).append('<th class="cell">Retard (début)</th>');
            $(head_line).append('<th class="cell">Retard (fin)</th>');
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
                    $(title).empty();
                    $(title).append('<h1>' + data[0].name + '</h1>');
                    console.log("calling on_data_loaded");
                    console.log("data is :  " + data);
                    console.log(data);
                    var objects = new Model('pncevaluation.objectifpnc');
                    var actions = new Model('pncevaluation.actionpnc');
                    actionsD = new Array();

                    return objects.query(['id', 'name', 'actions_ids']).filter(
                        [
                            ['id', 'in', data[0].objectifs_ids]
                        ]
                    ).all().then(function(obje) {
                        //console.log(obje);
                        objectifsD = obje;
                        /*console.log('les tabls');
                        console.log('ObjD');
                        console.log(objectifsD);
                        console.log('ActD');
                        console.log(actionsD);*/
                        var tabIdActions = [];
                        iteration = 0;
                        for (var i = 0; i < objectifsD.length; i++) {
                            for (var j = 0; j < objectifsD[i].actions_ids.length; j++) {
                                tabIdActions[iteration] = objectifsD[i].actions_ids[j];
                                iteration++;
                            }
                        }
                        self.rpc('/pncevaluation/get_actions_stats', { actions_ids: tabIdActions, date_debut: "1", date_fin: "2" }).done(function(result) {
                            console.log("table");
                            console.log(result);
                            actionsStats = result;

                            var res = actions.query(['name', 'objectiflie_id', 'nb_etat_fin', 'nb_etat_prep', 'nb_etat_current', 'nb_qualite_mal', 'nb_qualite_pom', 'nb_qualite_br',
                                    'nb_qualite_tb', 'nb_res_ms', 'nb_res_pms', 'nb_res_s', 'nb_res_ps'
                                ])
                                .filter(
                                    [
                                        ['id', 'in', tabIdActions]
                                    ])
                                .all().then(function(act) {
                                    var it = 0;

                                    for (var i = 0; i < objectifsD.length; i++) {
                                        tabActions[i] = new Array();
                                        objectifsD[i].actions = new Array();

                                        for (var j = 0; j < act.length; j++)
                                            if (act[j].objectiflie_id[0] == objectifsD[i].id) {
                                                act[j].stats = actionsStats[j];
                                                tabActions[i].push(act[j]);
                                                objectifsD[i].actions.push(act[j]);
                                            }

                                    }
                                    $(elemBody).empty();
                                    for (var i = 0; i < objectifsD.length; i++) {
                                        var obj = false;
                                        for (var t = 0; t < objectifsD[i].actions.length; t++)
                                            if (!objectifsD[i].actions[t].stats.isEmpty) {
                                                obj = true;
                                                break;
                                            }


                                        if (obj) {
                                            var line = document.createElement('tr');
                                            $(elemBody).append(line);


                                            var objectif = document.createElement('td');
                                            if (typeof objectifsD[i].numero !== 'undefined')
                                                var strO = "<h2> Objectif 0" + objectifsD[i].numero + "<h2/>";
                                            else
                                                var strO = "<h2> Objectif<h2/>";
                                            $(objectif).append(strO);
                                            $(line).append(objectif);

                                            var actionst = document.createElement('td');
                                            var etatst = document.createElement('td');
                                            var retarddt = document.createElement('td');
                                            var retardft = document.createElement('td');
                                            var qualitet = document.createElement('td');
                                            var resultatt = document.createElement('td');
                                            var res_icon = document.createElement('td');
                                            $(line).append(actionst);
                                            $(line).append(etatst);
                                            $(line).append(qualitet);
                                            $(line).append(resultatt);
                                            $(line).append(res_icon);
                                            $(line).append(retarddt);
                                            $(line).append(retardft);


                                            console.log("OBJD");
                                            console.log(objectifsD[i]);


                                            //console.log(tabActions);

                                            for (var j = 0; j < objectifsD[i].actions.length; j++) {

                                                var action_line = document.createElement('tr');
                                                $(actionst).append(action_line);

                                                var action = document.createElement('td');
                                                var strA = "<h2>" + objectifsD[i].actions[j].name + "<h2/>";
                                                $(action).append(strA);
                                                $(action_line).append(action);



                                                var etatLine = document.createElement('tr');
                                                $(etatst).append(etatLine);
                                                var etat = document.createElement('td');
                                                if (objectifsD[i].actions[j].stats.nb_etat_fin)
                                                    $(etat).append('<h5 class="fina">Finalisée ( ' + objectifsD[i].actions[j].stats.nb_etat_fin + ') <h5/>');
                                                if (objectifsD[i].actions[j].stats.nb_etat_current)
                                                    $(etat).append('<h5 class="encours">En cours ( ' + objectifsD[i].actions[j].stats.nb_etat_current + ' )<h5/>');
                                                if (objectifsD[i].actions[j].stats.nb_etat_prep)
                                                    $(etat).append('<h5 class="enprep">En préparation ( ' + objectifsD[i].actions[j].stats.nb_etat_prep + ' )<h5/>');
                                                $(etatLine).append(etat);

                                                var qualiteLine = document.createElement('tr');
                                                $(qualitet).append(qualiteLine);
                                                var qualite = document.createElement('td');
                                                if (objectifsD[i].actions[j].stats.nb_qualite_tb)
                                                    $(qualite).append('<h5 class="tbr">Très bien réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_tb + ' )<h5/>');
                                                if (objectifsD[i].actions[j].stats.nb_qualite_br)
                                                    $(qualite).append('<h5 class="br">Bien réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_br + ' )<h5/>');
                                                if (objectifsD[i].actions[j].stats.nb_qualite_pom)
                                                    $(qualite).append('<h5 class="pobr">Plus ou moin bien réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_pom + ' )<h5/>');
                                                if (objectifsD[i].actions[j].stats.nb_qualite_mal)
                                                    $(qualite).append('<h5 class="mr">Mal réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_mal + ' )<h5/>');
                                                $(qualiteLine).append(qualite);

                                                var resLine = document.createElement('tr');
                                                var resIconLine = document.createElement('tr');
                                                $(resultatt).append(resLine);
                                                $(res_icon).append(resIconLine);
                                                var resultat = document.createElement('td');
                                                var resultatIcon = document.createElement('td');
                                                if (objectifsD[i].actions[j].stats.nb_res_ps) {
                                                    $(resultat).append('<h5 class="tsat">Très Satisfaisants ( ' + objectifsD[i].actions[j].stats.nb_res_ps + ' )<h5/>');
                                                    $(resultatIcon).append('<h5><img src=\"/web_esi/static/src/img/res/rsz_tsat.png\" /></h5>');
                                                }
                                                if (objectifsD[i].actions[j].stats.nb_res_s) {
                                                    $(resultat).append('<h5 class="sat">Satisfaisants ( ' + objectifsD[i].actions[j].stats.nb_res_s + ' )<h5/>');
                                                    $(resultatIcon).append('<h5><img src=\"/web_esi/static/src/img/res/rsz_sat.png\" /></h5>');
                                                }

                                                if (objectifsD[i].actions[j].stats.nb_res_pms) {
                                                    $(resultat).append('<h5 class="pms">Plus ou moin satisfaisants  ( ' + objectifsD[i].actions[j].stats.nb_res_pms + ' ) <h5/>');
                                                    $(resultatIcon).append('<h5><img src=\"/web_esi/static/src/img/res/rsz_pmsat.png\" /></h5>');
                                                }

                                                if (objectifsD[i].actions[j].stats.nb_res_ms) {
                                                    $(resultat).append('<h5 class="ns">Non satisfaisants ( ' + objectifsD[i].actions[j].stats.nb_res_ms + ' )  <h5/>');
                                                    $(resultatIcon).append('<h5><img src=\"/web_esi/static/src/img/res/rsz_nsat.png\" /></h5>');
                                                }

                                                $(resLine).append(resultat);
                                                $(resIconLine).append(resultatIcon);


                                                /* var retarddl = document.createElement('tr');
                                                 $(retarddt).append(retarddl);
                                                 var retardd = document.createElement('td');
                                                 $(retardd).append('<h3>10<h3/>');
                                                 $(retardd).append('<h3>10<h3/>');
                                                 $(retardd).append('<h3>15<h3/>');
                                                 $(retarddl).append(retardd);

                                                 var retardfl = document.createElement('tr');
                                                 $(retardft).append(retardfl);
                                                 var retardf = document.createElement('td');
                                                 $(retardf).append('<h3><img src=\"/web_esi/static/src/img/arrow/up.png\" /></h3>');
                                                 $(retardf).append('<h3><img src=\"/web_esi/static/src/img/arrow/up.png\" /></h3>');
                                                 $(retardf).append('<h3><img src=\"/web_esi/static/src/img/arrow/up.png\" /></h3>');
                                                 $(retardfl).append(retardf);*/
                                            }

                                        }

                                    }



                                    return act;
                                });
                            return true;




                        });








                    });
                });
            });
        }

    });

    core.view_registry.add('esi', MyView);

});