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
            #fes = F.search([['action_realisee','=',action_id]])
            _logger.warning("pnc.FE")
            _logger.warning("pnc.FE")
            _logger.warning("pnc.FE")
            _logger.warning(fes)
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

