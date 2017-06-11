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
    var headerAspect;
    var headerObject;
    var headerAction;


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
            $(table).addClass("pnc_overview");
            $(table).attr("cellspacing", 10);
            var head_line = document.createElement('tr');
            $(head_line).addClass("pnc_overview");
            $(head).addClass("row header");
            $(head).append(head_line);
            $(head_line).append('<td></td>');
            // $(head_line).append('<th class="cell pnc_overview">Objectif</th>');
            // $(head_line).append('<th class="cell">Action</th>');
            $(head_line).append('<th class="pnc_overview" id="etatHead" class="cell"><h4>Etat (Contributeurs)</h4></th>');
            $(head_line).append('<th class="pnc_overview" id="qualiteHead" class="cell">Qualité de réalisation (Contributeurs)</th>');
            $(head_line).append('<th  class="pnc_overview" id="resultatHead" class="cell">Résultats (Contributeurs)</th>');
            $(head_line).append('<th class="pnc_overview" id="res_iconHead" class="cell">.</th>');
            $(head_line).append('<th class="pnc_overview" id="retarddHead" class="cell">Retard (début)</th>');
            $(head_line).append('<th class="pnc_overview" id="retardfHead" class="cell">Retard (fin)</th>');
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

                    return objects.query(['id', 'numero', 'name', 'actions_ids']).filter(
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

                            var res = actions.query(['name', 'numero', 'objectiflie_id', 'nb_etat_fin', 'nb_etat_prep', 'nb_etat_current', 'nb_qualite_mal', 'nb_qualite_pom', 'nb_qualite_br',
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
                                            var lineObj = document.createElement('tr');
                                            $(elemBody).append(lineObj);
                                            var objectif = document.createElement('th');
                                            $(objectif).addClass("pnc_overview");
                                            $(objectif).addClass("span");
                                            $(objectif).addClass("objectif");
                                            $(objectif).attr("colspan", "7");
                                            $(objectif).attr("scope", "colgroup");
                                            $(objectif).attr("scope", "colgroup");
                                            headerObject = "object" + i;
                                            $(objectif).attr("id", headerObject);




                                            if (typeof objectifsD[i].numero !== 'undefined')
                                                var strO = "<h2> Objectif 0" + objectifsD[i].numero + "<h2/>";
                                            else
                                                var strO = "<h2> Objectif<h2/>";
                                            $(objectif).append(strO);
                                            $(lineObj).append(objectif);

                                            console.log("OBJD");
                                            console.log(objectifsD[i]);

                                            for (var j = 0; j < objectifsD[i].actions.length; j++) {
                                                if (!objectifsD[i].actions[j].stats.isEmpty) {
                                                    console.log("isEmpty");
                                                    console.log(objectifsD[i].actions[j].stats.isEmpty);
                                                    var line = document.createElement('tr');
                                                    //$(line).addClass("pnc_overview");
                                                    $(elemBody).append(line);
                                                    var actionst = document.createElement('th');
                                                    headerAction = headerObject + ".act" + j;
                                                    $(actionst).attr("id", headerAction);
                                                    $(actionst).attr("headers", headerObject);
                                                    $(actionst).addClass("pnc_overview");




                                                    var etatst = document.createElement('td');
                                                    $(etatst).attr("headers", headerObject + " " + headerAction + " " + "etatHead");
                                                    $(etatst).addClass("pnc_overview");
                                                    var retarddt = document.createElement('td');
                                                    $(retarddt).attr("headers", headerObject + " " + headerAction + " " + "retarddHead");
                                                    $(retarddt).addClass("pnc_overview");
                                                    var retardft = document.createElement('td');
                                                    $(retardft).attr("headers", headerObject + " " + headerAction + " " + "retardfHead");
                                                    $(retardft).addClass("pnc_overview");
                                                    var qualitet = document.createElement('td');
                                                    $(qualitet).attr("headers", headerObject + " " + headerAction + " " + "qualiteHead");
                                                    $(qualitet).addClass("pnc_overview");
                                                    var resultatt = document.createElement('td');
                                                    $(resultatt).attr("headers", headerObject + " " + headerAction + " " + "resultatHead");
                                                    $(resultatt).addClass("pnc_overview");
                                                    var res_icon = document.createElement('td');
                                                    $(res_icon).attr("headers", headerObject + " " + headerAction + " " + "res_iconHead");
                                                    $(res_icon).addClass("pnc_overview");
                                                    $(line).append(actionst);
                                                    // $(actionst).addClass("pnc_overview");
                                                    $(line).append(etatst);
                                                    $(line).append(qualitet);
                                                    $(line).append(resultatt);
                                                    $(line).append(res_icon);
                                                    $(line).append(retarddt);
                                                    $(line).append(retardft);


                                                    var action = document.createElement('td');
                                                    $(action).addClass("cell_pnc");
                                                    var strA;
                                                    if (objectifsD[i].actions[j].numero < 10 && objectifsD[i].actions[j].numero > 0)
                                                        strA = "<h2> Action 0" + objectifsD[i].actions[j].numero + "<h2/>";
                                                    else
                                                        strA = "<h2> Action " + objectifsD[i].actions[j].numero + "<h2/>";
                                                    $(action).append(strA);
                                                    // $(action_line).append(action);
                                                    //$(action).addClass("gris");
                                                    if (j != objectifsD[i].actions.length - 1)
                                                        $(action).addClass("bas");
                                                    $(actionst).append(action);

                                                    // var etatLine = document.createElement('tr');
                                                    // $(etatst).append(etatLine);


                                                    var etat = document.createElement('td');
                                                    $(etat).addClass("cell_pnc");
                                                    //$(etat).attr("align", "center");
                                                    if (objectifsD[i].actions[j].stats.nb_etat_fin)
                                                        $(etat).append('<h4 class="fina ">Finalisée ( <a class="get_contrib" href="get_contributeur">' + objectifsD[i].actions[j].stats.nb_etat_fin + '<a> ) </h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_etat_current)
                                                        $(etat).append('<h4 class="encours ">En cours ( ' + objectifsD[i].actions[j].stats.nb_etat_current + ' )</h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_etat_prep)
                                                        $(etat).append('<h4 class="enprep ">En préparation ( ' + objectifsD[i].actions[j].stats.nb_etat_prep + ' )</h4>');
                                                    $(etatst).append(etat);
                                                    // $(etatLine).append(etat);

                                                    // var qualiteLine = document.createElement('tr');
                                                    // $(qualitet).append(qualiteLine);

                                                    var qualite = document.createElement('td');
                                                    $(qualite).addClass("cell_pnc");
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_tb)
                                                        $(qualite).append('<h4 class="tbr">Très bien réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_tb + ' )</h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_br)
                                                        $(qualite).append('<h4 class="br">Bien réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_br + ' )</h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_pom)
                                                        $(qualite).append('<h4 class="pobr">Plus ou moin bien réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_pom + ' )</h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_mal)
                                                        $(qualite).append('<h4 class="mr">Mal réalisée ( ' + objectifsD[i].actions[j].stats.nb_qualite_mal + ' )</h4>');
                                                    // $(qualiteLine).append(qualite);
                                                    $(qualitet).append(qualite);

                                                    // var resLine = document.createElement('tr');
                                                    // var resIconLine = document.createElement('tr');
                                                    // $(resultatt).append(resLine);
                                                    // $(res_icon).append(resIconLine);
                                                    var resultat = document.createElement('td');
                                                    $(qualite).addClass("cell_pnc_res");
                                                    var resultatIcon = document.createElement('td');
                                                    $(resultatIcon).addClass("cell_pnc_res_icon");
                                                    if (objectifsD[i].actions[j].stats.nb_res_ps) {
                                                        $(resultat).append('<h4 class="tsat">Très Satisfaisants ( ' + objectifsD[i].actions[j].stats.nb_res_ps + ' )</h4>');
                                                        $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_tsat.png\" /></h4>');
                                                    }
                                                    if (objectifsD[i].actions[j].stats.nb_res_s) {
                                                        $(resultat).append('<h4 class="sat">Satisfaisants ( ' + objectifsD[i].actions[j].stats.nb_res_s + ' )</h4>');
                                                        $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_sat.png\" /></h4>');
                                                    }

                                                    if (objectifsD[i].actions[j].stats.nb_res_pms) {
                                                        $(resultat).append('<h4 class="pms">Plus ou moin satisfaisants  ( ' + objectifsD[i].actions[j].stats.nb_res_pms + ' ) </h4>');
                                                        $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_pmsat.png\" /></h4>');
                                                    }

                                                    if (objectifsD[i].actions[j].stats.nb_res_ms) {
                                                        $(resultat).append('<h4 class="ns">Non satisfaisants ( ' + objectifsD[i].actions[j].stats.nb_res_ms + ' )  </h4>');
                                                        $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_nsat.png\" /></h4>');
                                                    }
                                                    $(resultatt).append(resultat);
                                                    $(res_icon).append(resultatIcon);

                                                    // $(resLine).append(resultat);
                                                    // $(resIconLine).append(resultatIcon);



                                                    var retardd = document.createElement('td');
                                                    $(retardd).addClass("cell_indic");
                                                    if (objectifsD[i].actions[j].stats.retard_debut > 365)
                                                        $(retardd).append('<h3><img src=\"/web_esi/static/src/img/indic/rouge/rouge_24.png\" /></h3>');
                                                    if (objectifsD[i].actions[j].stats.retard_debut < 365 && objectifsD[i].actions[j].stats.retard_debut > 182)
                                                        $(retardd).append('<h3><img src=\"/web_esi/static/src/img/indic/orange.png\" /></h3>');
                                                    if (objectifsD[i].actions[j].stats.retard_debut <= 182 && objectifsD[i].actions[j].stats.retard_debut > -1)
                                                        $(retardd).append('<h3><img src=\"/web_esi/static/src/img/indic/vert.png\" /></h3>');
                                                    if (objectifsD[i].actions[j].stats.retard_debut == -1)
                                                        $(retardd).append('<h3><img src=\"/web_esi/static/src/img/indic/gris.png\" /></h3>');
                                                    $(retarddt).append(retardd);

                                                    var retardf = document.createElement('td');
                                                    $(retardf).addClass("cell_indic");
                                                    if (objectifsD[i].actions[j].stats.retard_fin > 365)
                                                        $(retardf).append('<h3><img src=\"/web_esi/static/src/img/indic/rouge/rouge_24.png\" /></h3>');
                                                    if (objectifsD[i].actions[j].stats.retard_fin < 365 && objectifsD[i].actions[j].stats.retard_fin > 182)
                                                        $(retardf).append('<h3><img src=\"/web_esi/static/src/img/indic/orange.png\" /></h3>');
                                                    if (objectifsD[i].actions[j].stats.retard_fin <= 182 && objectifsD[i].actions[j].stats.retard_fin > -1)
                                                        $(retardf).append('<h3><img src=\"/web_esi/static/src/img/indic/vert.png\" /></h3>');
                                                    if (objectifsD[i].actions[j].stats.retard_fin == -1)
                                                        $(retardf).append('<h3><img src=\"/web_esi/static/src/img/indic/gris.png\" /></h3>');
                                                    $(retardft).append(retardf);
                                                }
                                            }

                                        }

                                    }

                                    $(document).on("click", "a.get_contrib", function(e) {
                                        e.preventDefault();
                                        var url = $(this).attr("href");
                                        console.log(url);
                                        // do something, like make an ajax request to get the url
                                        // self.rpc('/pncevaluation/get_contribs_view', { actions_ids: 1, date_debut: "1", date_fin: "2" }).done(function(result) {
                                        //     console.log("done from get contributeurs");
                                        // });
                                        self.rpc("/web/action/load", { action_id: "pncevaluation.pncevaluation_contributeur_action_js" }).done(function(result) {
                                            self.getParent().do_action(result, {
                                                additional_context: {
                                                    //HERE WE ARE TRYING SOME OPTIONS.
                                                },
                                            });
                                        });
                                        //var v = new instance.web.View;
                                        //v.reload();
                                        //View.reload();


                                    });



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