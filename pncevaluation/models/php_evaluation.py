# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)

class AgregationLevel(models.Model):
    _name = 'pncevaluation.agregation_level'
    _description = u"Niveau d\'Agrégationn testhhp d\'un indicatneur : Evaluation Subjective Action, Evaluation Objective Action, Action, Objectif, Axe "
    level = fields.Selection(selection=[('axe','Axe'),('objectif','Objectif'),('action','Action'),('mesure','Mesure')],string=u"Niveau d\'agrégation",)
    # agregation_level_parent_parent_id = fields.Many2one('pncevaluation.agregation_level',string='Niveau d Agregation Parent', ondelete='SET NULL')
    # agregation_level_childs_ids = fields.One2many('pncevaluation.agregation_level','agregation_level_parent_parent_id',string=u"Niveaux d\'agrégation fils ")
    # indicator_ids = fields.One2many('pncevaluation.indicator','agregation_level_id',string='indicators')
    
    #instances_ids = fields.One2many('pncevaluation.agregation_level_instance','agregation_level_id',string='Instances')



class projetPlanAction(models.Model):
     _inherit = 'project.project'
     _name = 'pncevaluation.actionplanproject'
     tasks = fields.One2many('pncevaluation.actionplantask','project_id',string=u"Tâches")
     #TODO action niveau d'agregation
class tachePlanAction(models.Model):
     _inherit = 'project.task'
     _name = 'pncevaluation.actionplantask'
     project_id = fields.Many2one('pncevaluation.actionplanproject',string=u"Projet")


class rapportBI(models.Model):
     _name = 'pncevaluation.reportbi'   
     name = fields.Char(u"Intitulé du rapport")

class kpi(models.Model):
     _name = 'pncevaluation.kpi'   
     name = fields.Char(u"Intitulé du KPI")
     value = fields.Many2one(u"Value")
     data_source = fields.Many2one('pncevaluation.sourcefield',string=u"Source de données")
     field_level = fields.Boolean(u"Niveau Attribut")


class DateValue(models.Model):
     _name = 'pncevaluation.datevalue'   
     date = fields.Date(u"Date")
     value = fields.Float(u"Valeur")
class DataSource(models.Model):
     _name = 'pncevaluation.sourcefield'   
     name = fields.Char(u"FieldName")
     model_source = fields.Many2one('ir.model',string=u"Modèle source")
     model_agreg  = fields.Many2one('ir.model',string=u"Modèle agrégation")
     field_source = fields.Char(u"Attribut source")

     











     

