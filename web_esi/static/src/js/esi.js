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
    var currentSelf;

    var container;

    function open_tree_contrib(self) {
        //self = this;
        //var model_obj = new instance.web.Model('ir.model.data');
        // view_id = Model.call('get_object_reference', ["pncevaluation",
        //     "contributeur_tree_view"
        // ]);
        var view_id;
        var Menus = new Model('ir.model.data');

        Menus.query(['id']).filter([
            ['name', '=', 'contributeur_tree_view']
        ]).all().then(function(ir_model_datas) {
            console.log(ir_model_datas);
            view_id = ir_model_datas[0];
            // for (i in ir_model_datas) {
            //     console.log(ir_model_datas[i].id);
            // }
        });

        // var Model = require('web.DataModel');
        // var formats = require('web.formats');

        var view_manager = currentSelf.view.getParent(),
            action_manager = view_manager.getParent();
        //self.view.destroy();
        action_manager.do_action({
            type: 'ir.actions.act_window',
            res_model: 'pncevaluation.contributeur',
            view_mode: 'tree',
            views: [
                [view_id, 'tree']
            ],
            target: 'new'
        });
    }

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
            container = document.createElement('div');
            $(container).addClass("axe_summary");
            $(container).addClass("wrapper");
            $(self.$el).append(container);


        },
        do_search: function(domains, contexts, group_bys) {
            $(container).empty();
            $('.o_control_panel').attr('style', 'display:none');
            var self = this;
            currentSelf = self;
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
                    console.log("calling on_data_loaded");
                    console.log("data is :  " + data);
                    console.log(data);
                    var objects = new Model('pncevaluation.objectifpnc');
                    var actions = new Model('pncevaluation.actionpnc');
                    actionsD = new Array();

                    return objects.query(['id', 'numero', 'name', 'actions_ids', 'description']).filter(
                        [
                            ['id', 'in', data[0].objectifs_ids]
                        ]
                    ).all().then(function(obje) {
                        objectifsD = obje;
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

                                    if (objectifsD.length > 0) {
                                        isAxeVide = false;
                                    }
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

                                    var tablesContainer = document.createElement('div');
                                    $(tablesContainer).addClass("col-md-12");
                                    $(container).append(tablesContainer);




                                    console.log("OBJS");
                                    console.log(objectifsD);
                                    //$("div.o_main_content").addClass("parallax__group");
                                    //$("div.o_control_panel").addClass("parallax__layer parallax__layer--base");
                                    // $("div.o_main").addClass("parallax__group");
                                    // $("div.o_content").addClass("parallax__layer parallax__layer--fore");



                                    for (var i = 0; i < objectifsD.length; i++) {
                                        var obj = false;
                                        var cardView = document.createElement('div');
                                        $(cardView).addClass("card");
                                        $(tablesContainer).append(cardView);
                                        var cardHeader = document.createElement('div');
                                        $(cardHeader).addClass("card-header");
                                        $(cardHeader).attr("data-background-color", "purple");
                                        $(cardView).append(cardHeader);

                                        var headerTitle = document.createElement('h4');
                                        $(headerTitle).addClass("title");
                                        $(headerTitle).append("" + objectifsD[i].name);
                                        $(cardHeader).append(headerTitle);
                                        if (objectifsD[i].description) {
                                            var headerSubTitle = document.createElement('p');
                                            $(headerSubTitle).addClass("category");
                                            $(headerTitle).append("" + objectifsD[i].description);
                                            $(cardHeader).append('<br/>');
                                            $(cardHeader).append(headerSubTitle);
                                        }
                                        var cardContent = document.createElement('div');
                                        $(cardContent).addClass("card-content table-responsive");
                                        $(cardView).append(cardContent);

                                        var elemTable = document.createElement('table');
                                        $(elemTable).addClass("table");
                                        $(cardContent).append(elemTable);
                                        var thead = document.createElement('thead');
                                        $(thead).addClass("text-primary");
                                        $(thead).append('<th><h3>Action</h3></th>')
                                        $(thead).append('<th><h3>Etat (Contributeurs)</h3></th>')
                                        $(thead).append('<th><h3>Qualité de réalisation</h3></th>')
                                        $(thead).append('<th><h3>Résultats (Contributeurs)</h3></th>')
                                        $(thead).append('<th></h3>#</h3></th>')
                                        $(thead).append('<th><h3>Retard début</h3></th>')
                                        $(thead).append('<th><h3>Retard fin</h3></th>')
                                        $(elemTable).append(thead);
                                        var tbody = document.createElement('tbody');
                                        $(elemTable).append(tbody);

                                        for (var t = 0; t < objectifsD[i].actions.length; t++)
                                            if (!objectifsD[i].actions[t].stats.isEmpty) {
                                                obj = true;
                                                break;
                                            }


                                        if (obj) {

                                            for (var j = 0; j < objectifsD[i].actions.length; j++) {
                                                if (!objectifsD[i].actions[j].stats.isEmpty) {
                                                    var ActionLine = document.createElement('tr');
                                                    $(tbody).append(ActionLine);

                                                    var actionName = document.createElement('td');

                                                    var strA;
                                                    if (objectifsD[i].actions[j].numero < 10 && objectifsD[i].actions[j].numero > 0)
                                                        strA = "<div><h3> Action 0" + objectifsD[i].actions[j].numero + "<h3/><div>";
                                                    else
                                                        strA = "<div><h3> Action " + objectifsD[i].actions[j].numero + "<h3/></div>";
                                                    $(actionName).append(strA);
                                                    $(ActionLine).append(actionName);


                                                    var etat = document.createElement('td');
                                                    //$(etat).attr("align", "center");
                                                    if (objectifsD[i].actions[j].stats.nb_etat_fin)
                                                        $(etat).append('<h4 class="fina ">Finalisée  <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-fina-etat">( ' + objectifsD[i].actions[j].stats.nb_etat_fin + '<a> ) </h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_etat_current)
                                                        $(etat).append('<h4 class="encours ">En cours   <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-current-etat">( ' + objectifsD[i].actions[j].stats.nb_etat_current + ' <a> )</h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_etat_prep)
                                                        $(etat).append('<h4 class="enprep ">En préparation ( <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-prep-etat"> ( ' + objectifsD[i].actions[j].stats.nb_etat_prep + ' <a> )</h4>');
                                                    if (!objectifsD[i].actions[j].stats.nb_etat_fin && !objectifsD[i].actions[j].stats.nb_etat_current && !objectifsD[i].actions[j].stats.nb_etat_prep) {
                                                        $(etat).append('<h4 class="noneval ">Non évaluée </h4>');

                                                    }
                                                    $(ActionLine).append(etat);



                                                    var qualite = document.createElement('td');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_tb)
                                                        $(qualite).append('<h4 class="tbr">Très bien réalisée <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-tb-qual">( ' + objectifsD[i].actions[j].stats.nb_qualite_tb + ' )</a></h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_br)
                                                        $(qualite).append('<h4 class="br">Bien réalisée <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-br-qual">( ' + objectifsD[i].actions[j].stats.nb_qualite_br + ' )</a></h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_pom)
                                                        $(qualite).append('<h4 class="pobr">Plus ou moin bien réalisée <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-pom-qual">( ' + objectifsD[i].actions[j].stats.nb_qualite_pom + ' )</a> </h4>');
                                                    if (objectifsD[i].actions[j].stats.nb_qualite_mal)
                                                        $(qualite).append('<h4 class="mr">Mal réalisée <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-mal-qual"> ( ' + objectifsD[i].actions[j].stats.nb_qualite_mal + ' )</a> </h4>');
                                                    if (!objectifsD[i].actions[j].stats.nb_qualite_tb && !objectifsD[i].actions[j].stats.nb_qualite_br && !objectifsD[i].actions[j].stats.nb_qualite_pom && !objectifsD[i].actions[j].stats.nb_qualite_mal) {
                                                        $(qualite).append('<pre style="background-color:#FFFFFF;border:0px;font-size:300%;">   -</pre> ');
                                                    }
                                                    // $(qualiteLine).append(qualite);
                                                    $(ActionLine).append(qualite);

                                                    var resultat = document.createElement('td');
                                                    var resultatIcon = document.createElement('td');
                                                    if (objectifsD[i].actions[j].stats.nb_res_ps) {
                                                        $(resultat).append('<h4 class="tsat"> Très Satisfaisants <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-ps-res">( ' + objectifsD[i].actions[j].stats.nb_res_ps + ' )</a></h4>');
                                                        // $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_tsat.png\" /></h4>');
                                                    }
                                                    if (objectifsD[i].actions[j].stats.nb_res_s) {
                                                        $(resultat).append('<h4 class="sat">Satisfaisants <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-sat-res">( ' + objectifsD[i].actions[j].stats.nb_res_s + ' )</a></h4>');
                                                        // $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_sat.png\" /></h4>');
                                                    }

                                                    if (objectifsD[i].actions[j].stats.nb_res_pms) {
                                                        $(resultat).append('<h4 class="pms">Plus ou moin satisfaisants  <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-pms-res">( ' + objectifsD[i].actions[j].stats.nb_res_pms + ' ) </a></h4>');
                                                        // $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_pmsat.png\" /></h4>');
                                                    }

                                                    if (objectifsD[i].actions[j].stats.nb_res_ms) {
                                                        $(resultat).append('<h4 class="ns">Non satisfaisants <a class="get_contrib" href="get_contributeur-' + objectifsD[i].actions[j].id + '-' + objectifsD[i].actions[j].objectiflie_id[0] + '-ms-res">( ' + objectifsD[i].actions[j].stats.nb_res_ms + ' )  </a></h4>');
                                                        // $(resultatIcon).append('<h4><img src=\"/web_esi/static/src/img/res/rsz_nsat.png\" /></h4>');
                                                    }
                                                    if (!objectifsD[i].actions[j].stats.nb_res_ps && !objectifsD[i].actions[j].stats.nb_res_s && !objectifsD[i].actions[j].stats.nb_res_pms && !objectifsD[i].actions[j].stats.nb_res_ms) {
                                                        $(resultat).append('<pre style="background-color:#FFFFFF;border:0px;font-size:300%;"> -</pre> ');
                                                    }
                                                    $(ActionLine).append(resultat);
                                                    $(ActionLine).append(resultatIcon);


                                                    var retardd = document.createElement('td');
                                                    if (objectifsD[i].actions[j].stats.retard_debut > 365)
                                                        $(retardd).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-red" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="red " /> </svg>');
                                                    if (objectifsD[i].actions[j].stats.retard_debut < 365 && objectifsD[i].actions[j].stats.retard_debut > 182)
                                                        $(retardd).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-orange" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="orange " /> </svg>');
                                                    if (objectifsD[i].actions[j].stats.retard_debut <= 182 && objectifsD[i].actions[j].stats.retard_debut > -1)
                                                        $(retardd).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-green" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="green" /> </svg>');
                                                    if (objectifsD[i].actions[j].stats.retard_debut == -1)
                                                        $(retardd).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-grey" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="grey" /> </svg>');
                                                    $(ActionLine).append(retardd);

                                                    var retardf = document.createElement('td');
                                                    if (objectifsD[i].actions[j].stats.retard_fin > 365)
                                                        $(retardf).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-red" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="red " /> </svg>');
                                                    if (objectifsD[i].actions[j].stats.retard_fin < 365 && objectifsD[i].actions[j].stats.retard_fin > 182)
                                                        $(retardf).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-orange" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="orange " /> </svg>');
                                                    if (objectifsD[i].actions[j].stats.retard_fin <= 182 && objectifsD[i].actions[j].stats.retard_fin > -1)
                                                        $(retardf).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-green" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="green" /> </svg>');
                                                    if (objectifsD[i].actions[j].stats.retard_fin == -1)
                                                        $(retardf).append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"   class="retard-grey" width="50" height="50"><circle  r="25 " cx="25 " cy="25 " fill="grey" /> </svg>');
                                                    $(ActionLine).append(retardf);











                                                }
                                            }

                                        }

                                    }


                                    if (isAxeVide) {

                                    }

                                    $(document).on("click", "a.get_contrib", function(e) {
                                        e.preventDefault();
                                        var url = $(this).attr("href");
                                        console.log("url");
                                        console.log(url);
                                        console.log("id action");
                                        console.log(url.split('-')[1])
                                        console.log("id objectif");
                                        console.log(url.split('-')[2])
                                            //open_tree_contrib(self);

                                        // var model_obj = new instance.web.Model('ir.model.data');
                                        // view_id = model_obj.call('get_object_reference', ["pncevaluation",
                                        //     "contributeur_tree_view"
                                        // ]);



                                        // var Model = require('web.DataModel');
                                        // var formats = require('web.formats');

                                        // var view_manager = self.view.getParent(),
                                        //     action_manager = view_manager.getParent();
                                        // self.view.destroy();
                                        // action_manager.do_action({
                                        //     type: 'ir.actions.act_window',
                                        //     res_model: res_model,
                                        //     res_id: res_id,
                                        //     view_mode: 'form',
                                        //     views: [
                                        //         [view_id, 'form']
                                        //     ],
                                        //     target: 'current'
                                        // });



                                        self.rpc("/web/action/load", { action_id: "pncevaluation.pncevaluation_contributeur_action_js" }).done(function(result) {
                                            console.log(result);
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



                                    // return act;
                                });
                            return true;




                        });








                    });
                });
            });
        },
        destroy: function() {
            $('.o_control_panel').attr('style', 'display:');
        }

    });






    core.view_registry.add('esi', MyView);

});