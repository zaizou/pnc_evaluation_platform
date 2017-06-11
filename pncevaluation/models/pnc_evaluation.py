# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)


class rapport_evalution(models.Model):
     _name = 'pncevaluation.re'
     _description = u"Rapport d\'évaluation"
     date_elaboration = fields.Date(u"Date d\'élaboration")
     name = fields.Char(u"Initulé du rapport")
     formulaires_evaluation_ids = fields.One2many('pncevaluation.fe','rapport_evaluation_id',string=u"Formulaires d\'évaluation")
     formulaires_inspection_ids = fields.One2many('pncevaluation.finspection','rapport_evaluation_id',string=u"Formulaires d\'inspection")
class formulaire_evaluation(models.Model):
     _name = 'pncevaluation.fe'
     _description = u"Formulaire d\'évaluation"
     name = fields.Char(u"Intitulé du formulaire")
     contributeur = fields.Many2one('pncevaluation.contributeur',string="Contributeur")
     date = fields.Date(u"Date")
     rapport_evaluation_id = fields.Many2one('pncevaluation.re',string=u"Rapport d\'évaluation")
     axe_id = fields.Many2one('pncevaluation.axepnc',string=u"Axe concerné")
     numero_axe = fields.Integer(related='axe_id.numero')
     action_realisee = fields.Many2one('pncevaluation.actionpnc',string = u"Action réalisée", required=True)
     etat = fields.Selection(selection=[(u"finalisée",u"Finalisée"),(u"en cours",u"En cours"),(u"en préparation",u"En préparation")],string=u"Etat de l\'action",required=True)
     realisation = fields.Selection(selection=[(u"mal réalisée",u"Mal réalisée"),(u"plus ou moin bien réalisée",u"Plus ou moin bien réalisée"),(u"bien réalisée",u"Bien réalisée"),(u"très bien réalisée",u"Très bien réalisée")],string=u"L\'Action a été",required=True)
     res_attend = fields.Selection(selection= [(u"moin satisfaisants",u"Moin satisfaisants"),(u"plus ou moin satisfaisants",u"Plus ou moin satisfaisants"),(u"satisfaisants",u"Satisfaisants"),(u"plus que satisfaisants",u"Plus que satisfaisants")],string=u"Résultats attendus / résultats obtenus",required=True)
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
     _name = 'pncevaluation.finspection'
     _description = u"Formulaire d\'inspection"
     contributeur = fields.Many2one('pncevaluation.contributeur',string="Contributeur")
     rapport_evaluation_id = fields.Many2one('pncevaluation.re',string= u"Rapport d\'évaluation")
     axe_id = fields.Many2one('pncevaluation.axepnc',string=u"Axe concerné")
     numero_axe = fields.Integer(related='axe_id.numero')
     action_realisee = fields.Many2one('pncevaluation.actionpnc',string = u"Action réalisée")
     #groupe_inspection
     #personne chargée
     date = fields.Date(u"Date de l\'inspection")
     #model region
     region = fields.Many2one('pncevaluation.region',string=u"Région concernée")
     lieu = fields.Char(u"Lieu(x)")
     #Model Mission Inspection
     constat = fields.Text(u"Constat")
     realisation = fields.Selection(selection=[(u"mal réalisée",u"Mal réalisée"),(u"plus ou moin bien réalisée",u"Plus ou moin bien réalisée"),(u"bien réalisée",u"Bien réalisée"),(u"très bien réalisée",u"Très bien réalisée")],string='L\'Action a été')
     progress = fields.Text(u"Progrès accomplis")
    
#Partie 03 :  Evaluation

class projetEvaluation(models.Model):
    #  _inherit = 'project.project'
     _name = 'pncevaluation.evaluationproject'
     tasks = fields.One2many('pncevaluation.evaluationsubjective','project_id',string=u"Tâches")
class evaluationSubjective(models.Model):
     #_inherit = 'project.task'
     _name = 'pncevaluation.evaluationsubjective'
     project_id = fields.Many2one('pncevaluation.evaluationproject',string=u"Projet")

class inspection(models.Model):
     #_inherit = 'project.task'
     _name = 'pncevaluation.inspection'   
class reunion_evaluation(models.Model):
     #_inherit = 'calendar.event'
     _name = 'pncevaluation.reueval'  
     date = fields.Date("Date")
     start = fields.Datetime(u"Début")
     stop = fields.Datetime(u"Fin")
     name = fields.Char(u"Objet de la réunion")
     axe_id = fields.Many2one('pncevaluation.axepnc',string="axe")
     numero_axe = fields.Integer(related='axe_id.numero')
     contributions_ids = fields.One2many('pncevaluation.contribution','reunion_evaluation_id',string=u"Contributions")
     contributeurs_presents_ids = fields.Many2many('pncevaluation.contributeur',string=u"Contributeurs Présents")
     contributeurs_invites_ids = fields.Many2many('pncevaluation.contributeur',string=u"Contributeurs invités")
     pv_reunion_ids = fields.Many2one('pncevaluation.pvreunionevaluation',string=u"PV de la réunion")

class pv_reunion_evaluation(models.Model):
     _name = 'pncevaluation.pvreunionevaluation'   
     name = fields.Char(u"Intitulé du PV ")

class region(models.Model):
     _name = 'pncevaluation.region'
     _description = u"Région"
     name = fields.Char(u"Intitulé de la région")
     code = fields.Char(u"Code de la région")
     wilayas_ids = fields.One2many('pncevaluation.wilaya','region_id',string=u"Wilayas concernées")

class wilaya(models.Model):
     _name = 'pncevaluation.wilaya'
     _description = u"Wilaya"
     name = fields.Char(u"Intitulé Wilaya")
     matricule = fields.Char(u"Matricule")
     region_id = fields.Many2one('pncevaluation.region',string=u"Région")