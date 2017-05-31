# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)


class pnc_program(models.Model):
     _name = 'pncevaluation.pnc'
     _description = "Le Plan National Cancer"
     name = fields.Char(u"Intitulé du Plan")
     date_debut = fields.Date(u"Date début du plan")
     date_fin = fields.Date(u"Date fin du plan")
     axes_ids = fields.One2many('pncevaluation.axepnc','pnc_program_id',string = u"Structure du Plan")
class AxePNC(models.Model):
    _name = 'pncevaluation.axepnc'
    _description = u"Axe du plan national cancer"
    name = fields.Char(u"Intitulé de l\'axe",required=True, translate=True)
    numero = fields.Integer(u"Numéro de l axe")
    description = fields.Char(u"Description de l\'axe")
    color = fields.Integer(u"Couleur",default=1)
    budgets_ids = fields.One2many('pncevaluation.budgetpnc','axe_id',u"Budgets")
    focus = fields.Char('Focus de l\'Axe',required=True, translate=True)
    budget_estime = fields.Float(u"Budget Estimé")
    pnc_program_id = fields.Many2one('pncevaluation.pnc_program',string=u"Programme PNC")
    objectifs_ids = fields.One2many('pncevaluation.objectifpnc','axelie_id',u"Objectifs")
    action_programs_ids = fields.One2many('pncevaluation.pa','axe_id',string="Programmes d\'actions")

class ObjectifPNC(models.Model):
    _name = 'pncevaluation.objectifpnc'
    _description = u"Objectif du plan national cancer"
    name = fields.Char(u"Intitulé de de l\'objectif")
    numero = fields.Integer(u"Numéro de l\'objectif",required=True, translate=True)
    axelie_id = fields.Many2one('pncevaluation.axe_pnc',string='Axe lié', ondelete='SET NULL')
    actions_ids = fields.One2many('pncevaluation.actionpnc','objectiflie_id',string="Actions")
    action_programs_ids = fields.Many2many('pncevaluation.pa',string="Programmes d\'actions")

    # add  pnc_program_idd 
class ActionPNC(models.Model):
    _name = 'pncevaluation.actionpnc'
    _description = u"Action du plan national cancer"
    name = fields.Char(u"Intitulé de l\'action",required=True, translate=True)
    numero = fields.Integer(u"Numéro de l\'action")
    objectiflie_id = fields.Many2one('pncevaluation.objectifpnc',string='Objectif lié', ondelete='SET NULL')
    mesures_ids = fields.One2many('pncevaluation.mesurepnc','actionlie_id',string="Mesures")
    #suivi 
    action_program_ids = fields.Many2many('pncevaluation.action_program',string=u"Programmes d\'action")

class MesurePNC(models.Model):
    _name = 'pncevaluation.mesurepnc'
    _description = u"Objectif du plan national cancer"
    name = fields.Char('Intitulé de de la mesure')
    numero = fields.Integer(u"Numéro de la mesure")
    actionlie_id = fields.Many2one('pncevaluation.actionpnc',string='Action liée', ondelete='SET NULL')
    # add  pnc_program_idd 


class partie_prenante(models.Model):
     _name = 'pncevaluation.partieprenante'
     _description = u"Partie Prenante"
     name = fields.Char(u"Intitulé")
     groupes_ids = fields.One2many('pncevaluation.groupe','partie_prenante_id',string=u"Groupes")


class pnc_groupe(models.Model):
     _name = 'pncevaluation.groupe'
     _description = u"Les Groupes du Plan Cancer "
     name = fields.Char(u"Intitulé du groupe")
     tag = fields.Selection(selection=[('all','membre'),('inspection','Inspection'),('evaluation_subjective',u"Evaluation Subjective"),('pilotage',u"Comité de pilotage")],string=u"Etiquette")
     partie_prenante_id = fields.Many2one('pncevaluation.partieprenante',string=u"Partie prenante")
     contributeurs_ids = fields.Many2many('pncevaluation.contributeur',string=u"Contributeurs")

class pnc_contributeur(models.Model):
     #_inherit = 'res.partner'
     _name = 'pncevaluation.contributeur'
     _description = u"Contributeur Plan Cancer "
     name = fields.Char(u"Nom")
     prenom = fields.Char(u"Prénom")
     specialite = fields.Char(u"Spécialité")
     poids = fields.Float(u"Poids du contributeur")
     #informations PNC
     groups_ids = fields.Many2many('pncevaluation.groupe',string=u"Groupes")
     contributions_ids = fields.One2many('pncevaluation.contribution','contributeur_id',string=u"Contributions")
     reunions_coordination_ids = fields.Many2many('pncevaluation.reucoor',string=u"Réunions de coordinnations")
     reunions_coordination_invitation_ids = fields.Many2many('pncevaluation.reucoor',string=u"Invitations aux Réunions de coordinnations")
     reunions_evaluation_ids = fields.Many2many('pncevaluation.reueval',string=u"Réunions d évaluation ")
     reunions_evaluation_invitation_ids = fields.Many2many('pncevaluation.reueval',string=u"Invitations aux réunions d évaluation")

class contribution(models.Model):
     _name = 'pncevaluation.contribution'
     name = fields.Char(u"Intitulé de la contribution")
     date = fields.Date("Date")
     type_contribution = fields.Selection(selection=[('doc','Documentation'),('rea',u"Réalisation")],string=u"Type de la contribution")
     contributeur_id = fields.Many2one('pncevaluation.contributeur',string=u"Contributeurs")
     reunion_coordination_id = fields.Many2one('pncevaluation.reucoor',string=u"Réunion")
     reunion_evaluation_id = fields.Many2one('pncevaluation.reueval',string=u"Réunion")
     plan_action_ids = fields.Many2many('pncevaluation.pa',string=u"La contribution s\'inscrit dans les Plan d\'action :")
     axe_id = fields.Many2one('pncevaluation.axepnc',string=u"Axe concerné")
     objectifs_ids = fields.Many2many('pncevaluation.objectifpnc',string=u"Objectifs concernés :")
     actions_ids = fields.Many2many('pncevaluation.actionpnc',string=u"Actions concernées :")