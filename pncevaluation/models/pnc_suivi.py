# -*- coding: utf-8 -*-
#Partie 02 : Suivi 
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)




class rapport_meo(models.Model):
     _name = 'pncevaluation.rmo'
     _description = "Rapport de mise en oeuvre"
     name = fields.Char(u"Intitulé du rapport")
     date_elaboration = fields.Date(u"Date d\'élaboration")
     formulaires_ids = fields.One2many('pncevaluation.fmo','rapport_moe_id',string=u"Formulaires de mise en oeuvre ") 
     forms_pa_moe_ids = fields.One2many('pncevaluation.fpamoe','rapport_meo_id',string=u"Formulaires de correspondance")
class formulaire_moe(models.Model):
     _name = 'pncevaluation.fmo'
     _description = "Formulaire de mise en oeuvre"
     date = fields.Date(u"Date")
     rapport_moe_id = fields.Many2one('pncevaluation.rmo',string=u"Rapport de mise en oeuvre associé")
     action_realisee = fields.Many2one('pncevaluation.actionpnc',string = u"Action réalisée")
     resultats_attendus= fields.Text(u"Résultats Attendus")
     manniere_moe = fields.Text(u"Décrire la manière dont l\'action à été mise ne oeuvre")
     parties_impliquee = fields.Text(u"Parties impliquée")
     descriptions_res = fields.Text(u"Description des résultats obtenus")
     dates_cles_ids = fields.One2many('pncevaluation.date_cle','form_moe_id',string=u"Dates clés de l\'Action")
     probleme_ronc = fields.Text(u"Problèmes rencontrés : écart entre l\'action prévue et l\'action réalisée, le cas échéant")

class formulairePAMOE(models.Model):
     _name = 'pncevaluation.fpamoe'
     _description = "Formulaire Plan d\'action/Mise en oeuvre"
     name = fields.Char(u"Intitulé") 
     date = fields.Date(u"Date")
     realisations_ids = fields.One2many('pncevaluation.r_actpa','form_pa_moe_id',string=u"Action plan d\'action")
     rapport_meo_id = fields.Many2one('pncevaluation.rmo',string=u"Rapprot de mise en oeuvre")




class realisationAction(models.Model):
     _name = 'pncevaluation.r_actpa'
     _description = "Réalisation action Plan d\'action"
     name = fields.Char(u"Intitulé")
     plan_action_id = fields.Many2one('pncevaluation.pa',string="Plan d\'action")
     action_pa_ids = fields.Many2many('pncevaluation.actionpa',string="Action du plan d\'action")
     etat = fields.Selection(selection=[(u"finalisée",u"Finalisée"),(u"en cours",u"En cours"),(u"en préparation",u"En préparation"),(u"non entammée",u"Non entammée")],string=u"Etat de l\'action",required=True)
     appreciation = fields.Selection(selection=[(u"import,facile",u"Importante, facile à réaliser"),(u"import,difficile",u"Importante, difficile à réaliser"),(u"moin import,facile",u"Moin importante, facile à réaliser"),(u"moin import,difficile",u"Moin importante, difficile à réaliser")],string=u"Appréciation",required=True)
     form_pa_moe_id = fields.Many2one('pncevaluation.fpamoe',string="Formulaire correspondance")








class date_cle(models.Model):
     _name = 'pncevaluation.date_cle'
     _description = u"Date Clé"
     date = fields.Date(u"Date de l\'évènement :")
     comment = fields.Text(u"Commentaire")
     form_moe_id = fields.Many2one(u"Formulaire de mise en oeuvre")


class reunionCoordination(models.Model):
     #_inherit = 'calendar.event'
     _name = 'pncevaluation.reucoor'
     _description = "reunion"
     #TODO date
     date = fields.Date("Date")
     start = fields.Datetime(u"Début")
     date_start = fields.Datetime(u"Début",compute='_computeStart', readonly=True)
     stop = fields.Datetime(u"Fin")
     color = fields.Integer(u"Coleur",related='axe.color')
     date_stop= fields.Datetime(string='Fin',compute='_computeStop', readonly=True)
     date_deadline = fields.Datetime(string='Fin',compute='_computeStop', readonly=True)
     name = fields.Char(u"Objet de la réunion")
     axe = fields.Many2one('pncevaluation.axepnc',string="axe")
     axe_id = fields.Many2one('pncevaluation.axepnc',string="axe")
     user_id = fields.Many2one('pncevaluation.axepnc',string="Axe")
     numero_axe = fields.Integer(related='user_id.numero')
     #state = fields.Selection(selection_add=[('done', "Terminée")])
     contributions_ids = fields.One2many('pncevaluation.contribution','reunion_coordination_id',string=u"Contributions")
     contributeurs_presents_ids = fields.Many2many('pncevaluation.contributeur',string=u"Contributeurs Présents")
     contributeurs_invites_ids = fields.Many2many('pncevaluation.contributeur',string=u"Contributeurs invités")
     pv_reunion_ids = fields.Many2one('pncevaluation.pvreunionaction',string=u"PV de la réunion")

     @api.one
     def _computeStop(self):
         self.date_stop = self.stop
         self.date_deadline = self.stop

     @api.one
     def _computeStart(self):
         self.date_start = self.start

     @api.model
     def create(self, vals):
        _logger.warning("----- Reunion Vals")
        _logger.warning(vals)
        return super(reunionCoordination, self).create(vals)

    #  @api.multi
    #  def write(self, vals):
    #     tools.image_resize_images(vals)
    #     return super(pnc_contributeur, self).write(vals)

class pv_reunion_action(models.Model):
     _name = 'pncevaluation.pvreunionaction'
     date = fields.Date("Date")
     name = fields.Char(u"Intitulé du PV ")

class BudgetPNC(models.Model):
     _name = 'pncevaluation.budgetpnc'
     _description = "Budget"
     name = fields.Char(u"Intitulé")
     date = fields.Date(u"Année")
     budget_estime = fields.Float(u"Budget estimé")
     budget_reel = fields.Float(u"Budget réel")
     rubriques_ids = fields.One2many('pncevaluation.rubriquebudget','budget_id',string="Rubriques")
     axe_id = fields.Many2one('pncevaluation.axepnc',string="Axe")
     numero_axe = fields.Integer(related='axe_id.numero')
class rubriqueBudget(models.Model):
     _name = 'pncevaluation.rubriquebudget'
     _description = "Rubrique"
     name = fields.Char(u"Intitulé de la rubrique")
     budget_id = fields.Many2one('pncevaluation.budgetpnc',string="Budget")
     estime = fields.Float(u"Estimé")
     reel = fields.Float(u"Réel")