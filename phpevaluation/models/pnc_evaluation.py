# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)


class rapport_evalution(models.Model):
     _name = 'phpevaluation.re'
     _description = u"Rapport d\'évaluation"
     date_elaboration = fields.Date(u"Date d\'élaboration")
     name = fields.Char(u"Initulé du rapport")
     formulaires_evaluation_ids = fields.One2many('phpevaluation.fe','rapport_evaluation_id',string=u"Formulaires d\'évaluation")
     formulaires_inspection_ids = fields.One2many('phpevaluation.finspection','rapport_evaluation_id',string=u"Formulaires d\'inspection")
class formulaire_evaluation(models.Model):
     _name = 'phpevaluation.fe'
     _description = u"Formulaire d\'évaluation"
     name = fields.Char(u"Intitulé du formulaire")
     contributeur = fields.Many2one('phpevaluation.contributeur',string="Contributeur")
     date = fields.Date(u"Date")
     rapport_evaluation_id = fields.Many2one('phpevaluation.re',string=u"Rapport d\'évaluation")
     axe_id = fields.Many2one('phpevaluation.axepnc',string=u"Axe concerné")
     action_realisee = fields.Many2one('phpevaluation.actionpnc',string = u"Action réalisée")
     etat = fields.Selection(selection=[(u"finalisée",u"Finalisée"),(u"en cours",u"En cours"),(u"en préparation",u"En préparation")],string=u"Etat de l\'action",)
     realisation = fields.Selection(selection=[(u"mal réalisée",u"Mal réalisée"),(u"plus ou moin bien réalisée",u"Plus ou moin bien réalisée"),(u"bien réalisée",u"Bien réalisée"),(u"très bien réalisée",u"Très bien réalisée")],string=u"L\'Action a été",)
     res_attend = fields.Selection(selection= [(u"moin satisfaisants",u"Moin satisfaisants"),(u"plus ou moin satisfaisants",u"Plus ou moin satisfaisants"),(u"satisfaisants",u"Satisfaisants"),(u"plus que satisfaisants",u"Plus que satisfaisants")],string=u"Résultats attendus / résultats obtenus",)
     inspection = fields.Boolean(u"Nécessité d\'inspection")
     date_debut_p = fields.Date(u"Date début prévue")
     date_debut_r = fields.Date(u"Date début réelle")
 #code ajoute
     datefin_p = fields.Date(u"Date fin prévue")
     datefin_r = fields.Date(u"Date fin réelle")
     retard = fields.Boolean(u"Retard entre dates prevues et reélles")
     inspection = fields.Boolean(u"Nécessité d\'inspection")
     appreciation = fields.Float(u"Appréciation",group_operator = 'avg' )
     remarques = fields.Text(u"Remarques")
class formulaire_inspection(models.Model):
     _name = 'phpevaluation.finspection'
     _description = u"Formulaire d\'inspection"
     contributeur = fields.Many2one('phpevaluation.contributeur',string="Contributeur")
     rapport_evaluation_id = fields.Many2one('phpevaluation.re',string= u"Rapport d\'évaluation")
     action_realisee = fields.Many2one('phpevaluation.actionpnc',string = u"Action réalisée")
     #groupe_inspection
     #personne chargée
     date = fields.Date(u"Date de l\'inspection")
     #model region
     region = fields.Many2one('phpevaluation.region',string=u"Région concernée")
     lieu = fields.Char(u"Lieu(x)")
     #Model Mission Inspection
     constat = fields.Text(u"Constat")
     realisation = fields.Selection(selection=[(u"mal réalisée",u"Mal réalisée"),(u"plus ou moin bien réalisée",u"Plus ou moin bien réalisée"),(u"bien réalisée",u"Bien réalisée"),(u"très bien réalisée",u"Très bien réalisée")],string='L\'Action a été')
     progress = fields.Text(u"Progrès accomplis")
    
#Partie 03 :  Evaluation

class projetEvaluation(models.Model):
     _inherit = 'project.project'
     _name = 'phpevaluation.evaluationproject'
     tasks = fields.One2many('phpevaluation.evaluationsubjective','project_id',string=u"Tâches")
class evaluationSubjective(models.Model):
     #_inherit = 'project.task'
     _name = 'phpevaluation.evaluationsubjective'
     project_id = fields.Many2one('phpevaluation.evaluationproject',string=u"Projet")

class inspection(models.Model):
     #_inherit = 'project.task'
     _name = 'phpevaluation.inspection'   
class reunion_evaluation(models.Model):
     #_inherit = 'calendar.event'
     _name = 'phpevaluation.reueval'  
     date = fields.Date("Date")
     start = fields.Datetime(u"Début")
     stop = fields.Datetime(u"Fin")
     name = fields.Char(u"Objet de la réunion")
     contributions_ids = fields.One2many('phpevaluation.contribution','reunion_evaluation_id',string=u"Contributions")
     contributeurs_presents_ids = fields.Many2many('phpevaluation.contributeur',string=u"Contributeurs Présents")
     contributeurs_invites_ids = fields.Many2many('phpevaluation.contributeur',string=u"Contributeurs invités")
     pv_reunion_ids = fields.Many2one('phpevaluation.pvreunionevaluation',string=u"PV de la réunion")

class pv_reunion_evaluation(models.Model):
     _name = 'phpevaluation.pvreunionevaluation'   
     name = fields.Char(u"Intitulé du PV ")

class region(models.Model):
     _name = 'phpevaluation.region'
     _description = u"Région"
     name = fields.Char(u"Intitulé de la région")
     code = fields.Char(u"Code de la région")
     wilayas_ids = fields.One2many('phpevaluation.wilaya','region_id',string=u"Wilayas concernées")

class wilaya(models.Model):
     _name = 'phpevaluation.wilaya'
     _description = u"Wilaya"
     name = fields.Char(u"Intitulé Wilaya")
     matricule = fields.Char(u"Matricule")
     region_id = fields.Many2one('phpevaluation.region',string=u"Région")