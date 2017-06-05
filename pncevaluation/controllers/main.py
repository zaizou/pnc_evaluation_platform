# -*- coding: utf-8 -*-
import logging
from odoo import registry
from odoo import http
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
        for action_id in actions_ids:
            #fes = registry['pncevaluation.fe'].search([['action_realisee','=',action_id]])
            #F = http.request.env['pncevaluation.fe']
            #attributes_ids = attributes_obj.search(cr, uid, [('attribute_line_ids.product_tmpl_id', 'in', product_ids)], context=context)
            feORM = request.env['pncevaluation.fe']
            fes = feORM.search([('action_realisee', '=', action_id)])
            empty=False
            if( len(fes) == 0 ):
                empty = True
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
                'nb_res_ps':nb_res_ps
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



        
        
    

