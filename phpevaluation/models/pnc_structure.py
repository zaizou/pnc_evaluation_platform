# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)


class pnc_program(models.Model):
     _name = 'phpevaluation.pnc'
     _description = "Le Plan National Cancer"
     name = fields.Char(u"Intitulé du Plan")
     date_debut = fields.Date(u"Date début du plan")
     date_fin = fields.Date(u"Date fin du plan")
     axes_ids = fields.One2many('phpevaluation.axepnc','pnc_program_id',string = u"Structure du Plan")

# Code ajouté 
class AxePNC(models.Model):
    _name = 'phpevaluation.axepnc'
    _description = u"Axe du plan national cancer"
    name = fields.Char(u"Intitulé de l\'axe",required=True, translate=True)
    numero = fields.Integer(u"Numéro de l axe")
    description = fields.Char(u"Description de l\'axe")
    color = fields.Integer(u"Couleur",default=1)
    budgets_ids = fields.One2many('phpevaluation.budgetpnc','axe_id',u"Budgets")
    focus = fields.Char('Focus de l\'Axe',required=True, translate=True)
    budget_estime = fields.Float(u"Budget Estimé")
    pnc_program_id = fields.Many2one('phpevaluation.pnc_program',string=u"Programme PNC")
    objectifs_ids = fields.One2many('phpevaluation.objectifpnc','axelie_id',u"Objectifs")
    action_programs_ids = fields.One2many('phpevaluation.pa','axe_id',string="Programmes d\'actions")

class ObjectifPNC(models.Model):
    _name = 'phpevaluation.objectifpnc'
    _description = u"Objectif du plan national cancer"
    name = fields.Char(u"Intitulé de de l\'objectif")
    numero = fields.Integer(u"Numéro de l\'objectif",required=True, translate=True)
    axelie_id = fields.Many2one('phpevaluation.axe_pnc',string='Axe lié', ondelete='SET NULL')
    actions_ids = fields.One2many('phpevaluation.actionpnc','objectiflie_id',string="Actions")
    action_programs_ids = fields.Many2many('phpevaluation.pa',string="Programmes d\'actions")

    # add  pnc_program_idd 
class ActionPNC(models.Model):
    _name = 'phpevaluation.actionpnc'
    _description = u"Action du plan national cancer"
    name = fields.Char(u"Intitulé de l\'action",required=True, translate=True)
    numero = fields.Integer(u"Numéro de l\'action")
    objectiflie_id = fields.Many2one('phpevaluation.objectifpnc',string='Objectif lié', ondelete='SET NULL')
    mesures_ids = fields.One2many('phpevaluation.mesurepnc','actionlie_id',string="Mesures")
    #suivi 
    action_program_ids = fields.Many2many('phpevaluation.action_program',string=u"Programmes d\'action")

class MesurePNC(models.Model):
    _name = 'phpevaluation.mesurepnc'
    _description = u"Objectif du plan national cancer"
    name = fields.Char('Intitulé de de la mesure')
    numero = fields.Integer(u"Numéro de la mesure")
    actionlie_id = fields.Many2one('phpevaluation.actionpnc',string='Action liée', ondelete='SET NULL')
    # add  pnc_program_idd 


class partie_prenante(models.Model):
     _name = 'phpevaluation.partieprenante'
     _description = u"Partie Prenante"
     name = fields.Char(u"Intitulé")
     groupes_ids = fields.One2many('phpevaluation.groupe','partie_prenante_id',string=u"Groupes")


class pnc_groupe(models.Model):
     _name = 'phpevaluation.groupe'
     _description = u"Les Groupes du Plan Cancer "
     name = fields.Char(u"Intitulé du groupe")
     tag = fields.Selection(selection=[('all','membre'),('inspection','Inspection'),('evaluation_subjective',u"Evaluation Subjective"),('pilotage',u"Comité de pilotage")],string=u"Etiquette")
     partie_prenante_id = fields.Many2one('phpevaluation.partieprenante',string=u"Partie prenante")
     contributeurs_ids = fields.Many2many('phpevaluation.contributeur',string=u"Contributeurs")

class pnc_contributeur(models.Model):
     #_inherit = 'res.partner'
     _name = 'phpevaluation.contributeur'
     _description = u"Contributeur Plan Cancer "
     name = fields.Char(u"Nom")
     prenom = fields.Char(u"Prénom")
     specialite = fields.Char(u"Spécialité")
     poids = fields.Float(u"Poids du contributeur")
     #informations PNC
     groups_ids = fields.Many2many('phpevaluation.groupe',string=u"Groupes")
     contributions_ids = fields.One2many('phpevaluation.contribution','contributeur_id',string=u"Contributions")
     reunions_coordination_ids = fields.Many2many('phpevaluation.reucoor',string=u"Réunions de coordinnations")
     reunions_coordination_invitation_ids = fields.Many2many('phpevaluation.reucoor',string=u"Invitations aux Réunions de coordinnations")
     reunions_evaluation_ids = fields.Many2many('phpevaluation.reueval',string=u"Réunions d évaluation ")
     reunions_evaluation_invitation_ids = fields.Many2many('phpevaluation.reueval',string=u"Invitations aux réunions d évaluation")

class contribution(models.Model):
     _name = 'phpevaluation.contribution'
     name = fields.Char(u"Intitulé de la contribution")
     date = fields.Date("Date")
     type_contribution = fields.Selection(selection=[('doc','Documentation'),('rea',u"Réalisation")],string=u"Type de la contribution")
     contributeur_id = fields.Many2one('phpevaluation.contributeur',string=u"Contributeurs")
     reunion_coordination_id = fields.Many2one('phpevaluation.reucoor',string=u"Réunion")
     reunion_evaluation_id = fields.Many2one('phpevaluation.reueval',string=u"Réunion")
     plan_action_ids = fields.Many2many('phpevaluation.pa',string=u"La contribution s\'inscrit dans les Plan d\'action :")
     axe_id = fields.Many2one('phpevaluation.axepnc',string=u"Axe concerné")
     objectifs_ids = fields.Many2many('phpevaluation.objectifpnc',string=u"Objectifs concernés :")
     actions_ids = fields.Many2many('phpevaluation.actionpnc',string=u"Actions concernées :")