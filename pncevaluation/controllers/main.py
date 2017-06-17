# -*- coding: utf-8 -*-
import logging
from odoo import registry
from odoo import http
from datetime import datetime
from odoo.http import Controller, route, request
_logger = logging.getLogger(__name__)


class PNC_Evaluation(Controller):




    @route('/pncevaluation/get_actions_stats', type='json', auth='user')
    def get_stats(self,actions_ids,date_debut,date_fin):
        elements = []
        nb_etat_fin = 0
        nb_etat_current = 0
        nb_etat_prep = 0
        nb_qualite_mal = 0
        nb_qualite_pom = 0
        nb_qualite_br = 0
        nb_qualite_tb = 0
        nb_res_ms = 0
        nb_res_pms = 0
        nb_res_s = 0
        nb_res_ps = 0

        retard_debut = 0
        retard_fin = 0
        var_retard_debut = 0
        var_retard_fin = 0

        for action_id in actions_ids:
            action_orm = request.env['pncevaluation.actionpnc']
            action_objects = action_orm.search([('id', '=', action_id)])
            for action_object in action_objects:
                _logger.warning("----- Retard")
                _logger.warning("----- Action")
                _logger.warning(action_object.name)
                _logger.warning(u"----- Débuts")
                _logger.warning(action_object.date_debut_p)
                _logger.warning(action_object.date_debut_r)
                _logger.warning(u"----- Fin")
                _logger.warning(action_object.datefin_p)
                _logger.warning(action_object.datefin_r)
                fmt = '%Y-%m-%d'
                if( action_object.date_debut_r and action_object.date_debut_p):
                    d1 = datetime.strptime(action_object.date_debut_r, fmt)
                    d2 = datetime.strptime(action_object.date_debut_p , fmt)
                    retard_debut = d1 - d2
                    var_retard_debut = retard_debut.days
                else:
                    var_retard_debut = -1
                    
                if( action_object.datefin_r and action_object.datefin_p):
                    d1 = datetime.strptime(action_object.datefin_r, fmt)
                    d2 = datetime.strptime(action_object.datefin_p , fmt)
                    retard_fin = d1 - d2 
                    var_retard_fin= retard_fin.days
                else:
                    var_retard_fin= -1

                if(retard_debut.days < 365):
                    _logger.warning(u"----- Retard Début < 1 an green")
                if(retard_debut.days > 365):
                    _logger.warning(u"----- Retard Début < 1 an red")
                if(retard_fin.days < 365):
                    _logger.warning(u"----- Retard Fin < 1 an green")
                if(retard_fin.days > 365):
                    _logger.warning(u"----- Retard Fin < 1 an red")
                _logger.warning(u"----- Retard Début")
                _logger.warning(retard_debut)
                _logger.warning(u"----- Retard Fin")
                _logger.warning(retard_fin)
                _logger.warning(u"----- Retard Début Days")
                _logger.warning(retard_debut.days)
                _logger.warning(u"----- Retard Fin Days")
                _logger.warning(retard_fin.days)

            feORM = request.env['pncevaluation.fe']
            fes = feORM.search([('action_realisee', '=', action_id)])
            empty=False
            if( len(fes) == 0 ):
                empty = True
            empty=False
            for fe in fes:
                _logger.warning(fe.etat)
                if(fe.etat == u"finalisée"):
                    nb_etat_fin = nb_etat_fin +1
                if(fe.etat == u"en cours"):
                    nb_etat_current = nb_etat_current +1
                if(fe.etat == u"en préparation"):
                    nb_etat_prep = nb_etat_prep +1
                if(fe.realisation == u"mal réalisée"):
                    nb_qualite_mal = nb_qualite_mal +1
                if(fe.realisation == u"plus ou moin bien réalisée"):
                    nb_qualite_pom = nb_qualite_pom +1
                if(fe.realisation == u"bien réalisée"):
                    nb_qualite_br = nb_qualite_br +1
                if(fe.realisation == u"très bien réalisée"):
                    nb_qualite_tb = nb_qualite_tb +1
                if(fe.res_attend == u"moin satisfaisants"):
                    nb_res_ms = nb_res_ms +1
                if(fe.res_attend == u"plus ou moin satisfaisants"):
                    nb_res_pms = nb_res_pms +1
                if(fe.res_attend == u"satisfaisants"):
                    nb_res_s = nb_res_s +1
                if(fe.res_attend == u"plus que satisfaisants"):
                    nb_res_ps = nb_res_ps +1
            ret = {
                'action':action_id,
                'isEmpty':empty,
                'nb_etat_fin':nb_etat_fin,
                'nb_etat_current':nb_etat_current,
                'nb_etat_prep':nb_etat_prep,
                'nb_qualite_mal':nb_qualite_mal,
                'nb_qualite_pom':nb_qualite_pom,
                'nb_qualite_br' :nb_qualite_br ,
                'nb_qualite_tb': nb_qualite_tb,
                'nb_res_ms' :nb_res_ms,
                'nb_res_pms' :nb_res_pms,
                'nb_res_s' :nb_res_s,
                'nb_res_ps':nb_res_ps,
                'retard_debut':var_retard_debut,
                'retard_fin':var_retard_fin
            }
            elements.append(ret)
            nb_etat_fin = 0
            nb_etat_current = 0
            nb_etat_prep = 0
            nb_qualite_mal = 0
            nb_qualite_pom = 0
            nb_qualite_br = 0
            nb_qualite_tb = 0
            nb_res_ms = 0
            nb_res_pms = 0
            nb_res_s = 0
            nb_res_ps = 0
        return elements
        
    @route('/pncevaluation/get_axes_stats', type='json', auth='user')
    def get_stats_axes(self,axes_ids,date_debut,date_fin):
        #2Budget #1resultat satifaisants #   realisation
        elements = []
        for axe_id in axes_ids:
            reORM = request.env['pncevaluation.reucoor']
            reunsC = reORM.search([('axe_id', '=', axe_id)])

            re_ev_ORM = request.env['pncevaluation.reueval']
            reunsE = re_ev_ORM.search([('axe_id', '=', axe_id)])

            paORM = request.env['pncevaluation.pa']
            pas = paORM.search([('axe_id', '=', axe_id)])

            budORM = request.env['pncevaluation.budgetpnc']
            buds = budORM.search([('axe_id', '=', axe_id)])
            
            budgeEst = sum(bud.budget_estime for bud in buds)
            budgetReel = sum(bud.budget_reel for bud in buds)
            
            appORM = request.env['pncevaluation.fe']
            fes = appORM.search([('axe_id', '=', axe_id)])
            apppreciation_axe = sum(fe.appreciation for fe in fes)
            if len(fes):
                apppreciation_axe = apppreciation_axe/len(fes)
            evals = len(fes)
            
            inspORM = request.env['pncevaluation.finspection']
            insp = inspORM.search([('axe_id', '=', axe_id)])

            compre1 = appORM.search([('axe_id', '=', axe_id),('res_attend','=',u"satisfaisants")])
            compre2 =appORM.search([('axe_id', '=', axe_id),('res_attend','=',u"plus que satisfaisants")])
            compre3=compre1 | compre2



            ret = {
                'axe_id':axe_id,
                'reunions_coord': len(reunsC),
                'reunions_eval': len(reunsE),
                'plans_action': len(pas),
                'budget_estim': budgeEst,
                'budget_reel': budgetReel,
                'taux_real':apppreciation_axe,
                'eval_sub':evals,
                'inspec':len(insp),
                'compre':len(compre3)
            }
            elements.append(ret)
        return elements
    
    @route('/pncevaluation/get_budgets', type='json', auth='user')
    def get_budgets(self,axe_num):
        reORM = request.env['pncevaluation.budgetpnc']
        listV = reORM.get_budgets_date(axe_num)
        if len(listV) == 0:
            listV.append({
                'axe_id' : [0,'axe X'],
                'budget_estime' :0,
                'budget_reel' : 0,
                'date' : 'Indéfinie'
            })
        return  listV
        #read_group(domain, fields, groupby, offset=0, limit=None, orderby=False, lazy=True)

    @route('/pncevaluation/get_action_pa_rea', type='json', auth='user')
    def get_pa_rea(self):
        axesORM = request.env['pncevaluation.axepnc']
        planActionORM = request.env['pncevaluation.pa']
        actionPaORM = request.env['pncevaluation.actionpa']
        axes = axesORM.search([])
        axesCount = []
        i = 0
        pActions = []
        for axe in axes:
            axeCount = 0
            _logger.warning(u"----- Axes PAs")
            _logger.warning(axe.action_programs_ids)
            # plans = planActionORM.browse(axe.action_programs_ids)
            # _logger.warning("-----plan")
            # _logger.warning(plans)
            for plan in axe.action_programs_ids:
                planCount = plan.getActionPaRe()
                axeCount = axeCount + planCount
                pActions.append({
                    'plan_id':plan.id,
                    'plan_intitule':plan.name,
                    'plan_actions_count':planCount,
                })
            axesCount.append({
                'numero' : axe.numero,
                'paCount': pActions,
                'axeCount': axeCount,
            
            })    


        _logger.warning(u"----- Axes Counts")
        _logger.warning(axesCount)
        return axesCount
    @route('/pncevaluation/get_reunions', type='json', auth='user')
    def get_statistics(self):
        reORM = request.env['pncevaluation.reucoor']
        listV = reORM.get_reunions_date()
        return listV





    @route('/pncevaluation/get_contribs_view', type='json', auth='user')
    def get_contribs_view(self):
        action = {
            'type': 'ir.actions.act_window',
            'res_model': 'pncevaluation.contributeur',
            'view_type': 'tree',
            'view_mode': 'tree',
            'target': 'new',
            'domain': [('id', '=', 1)]
        }
        action.setdefault('flags', {})  
        action_type = action.setdefault('type', 'ir.actions.act_window_close')
        if action_type == 'ir.actions.act_window':
            if not action.get('views'):
                view_id = action.get('view_id') or False
                if isinstance(view_id, (list, tuple)):
                    view_id = view_id[0]

                # providing at least one view mode is a requirement, not an option
                view_modes = action['view_mode'].split(',')

                if len(view_modes) > 1:
                    if view_id:
                        raise ValueError('Non-db action dictionaries should provide '
                                'either multiple view modes or a single view '
                                'mode and an optional view id.\n\n Got view '
                                'modes %r and view id %r for action %r' % (view_modes, view_id, action))
                    action['views'] = [(False, mode) for mode in view_modes]
                    action['views'] = [(view_id, view_modes[0])]

                # if action.pop('view_type', 'form') == 'form':
                #     if 'view_mode' in action:
                #         action['view_mode'] = ','.join(mode if mode != 'tree' else 'list' for mode in action['view_mode'].split(','))
                #     action['views'] = [[id, mode if mode != 'tree' else 'list'] for id, mode in action['views'] ]
            

        return action

        
        
    @route('/pncevaluation/get_dashboard_stats', type='json', auth='user')
    def get_statistics(self,numero_axe):
        feORM = request.env['pncevaluation.fe']
        listV = feORM.count_qualite(numero_axe)

        budORM = request.env['pncevaluation.budgetpnc']
        budglistV = budORM.search([('numero_axe', '=', numero_axe)])
        #somme budget
        ecarts = []
        for budget in budglistV :
            ecarts.append({
                'ecart': budget.budget_reel - budget.budget_estime,
                'annee' : budget.annne
            })


        ActORM = request.env['pncevaluation.pa']
        pas = ActORM.search([('numero_axe', '=', numero_axe)])
        count_correspondence = 0
        count_total = 0
        for pa in pas:
            count_correspondence = count_correspondence + pa.getActionPaRe()
            count_total = count_total + len( pa.actions_ids )
        if count_total>0:
            count_correspondence = count_correspondence/count_total

        #reunions coordination
        coorORM = request.env['pncevaluation.reucoor']
        reu_coor = coorORM.search([('numero_axe', '=', numero_axe)])

        #reunions evaluation
        evalORM = request.env['pncevaluation.reueval']
        reu_eval = evalORM.search([('numero_axe', '=', numero_axe)])

        axe_orm = request.env['pncevaluation.axepnc']
        axe_objects = axe_orm.search([])
        fmt = '%Y-%m-%d'
        retard_debut = 0
        retard_fin = 0
        var_retard_debut = 0
        var_retard_fin = 0
        #
        count_actions_ret_debut = 0
        count_actions_ret_fin = 0
        
        for axe in axe_objects:
            for objectp in axe.objectifs_ids:
                for act in objectp.actions_ids:
                        if( act.date_debut_r and act.date_debut_p):
                                d1 = datetime.strptime(act.date_debut_r, fmt)
                                d2 = datetime.strptime(act.date_debut_p , fmt)
                                retard_debut = d1 - d2
                                
                        if( act.datefin_r and act.datefin_p):
                                d1 = datetime.strptime(act.datefin_r, fmt)
                                d2 = datetime.strptime(act.datefin_p , fmt)
                                retard_fin = d1 - d2 

                        if(retard_debut.days > 365):
                                count_actions_ret_debut = count_actions_ret_debut + 1 
                        if(retard_fin.days > 365):
                                count_actions_ret_fin = count_actions_ret_fin + 1
        
        return{
            'budgets':ecarts,
            'num_axe': numero_axe,
            'nb_reu_coor': len( reu_coor),
            'nb_reu_eval' : len(reu_eval) ,
            'count_qualite': listV,
            'correspond': count_correspondence,
            'count_retard_debut':count_actions_ret_debut,
            'count_retard_fin':count_actions_ret_fin

        }


        return listV