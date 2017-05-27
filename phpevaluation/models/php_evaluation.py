# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)

class AgregationLevel(models.Model):
    _name = 'phpevaluation.agregation_level'
    _description = u"Niveau d\'Agrégationn testhhp d\'un indicatneur : Evaluation Subjective Action, Evaluation Objective Action, Action, Objectif, Axe "
    level = fields.Selection(selection=[('axe','Axe'),('objectif','Objectif'),('action','Action'),('mesure','Mesure')],string=u"Niveau d\'agrégation",)
    # agregation_level_parent_parent_id = fields.Many2one('phpevaluation.agregation_level',string='Niveau d Agregation Parent', ondelete='SET NULL')
    # agregation_level_childs_ids = fields.One2many('phpevaluation.agregation_level','agregation_level_parent_parent_id',string=u"Niveaux d\'agrégation fils ")
    # indicator_ids = fields.One2many('phpevaluation.indicator','agregation_level_id',string='indicators')
    
    #instances_ids = fields.One2many('phpevaluation.agregation_level_instance','agregation_level_id',string='Instances')



class projetPlanAction(models.Model):
     _inherit = 'project.project'
     _name = 'phpevaluation.actionplanproject'
     tasks = fields.One2many('phpevaluation.actionplantask','project_id',string=u"Tâches")
     #TODO action niveau d'agregation
class tachePlanAction(models.Model):
     _inherit = 'project.task'
     _name = 'phpevaluation.actionplantask'
     project_id = fields.Many2one('phpevaluation.actionplanproject',string=u"Projet")


class rapportBI(models.Model):
     _name = 'phpevaluation.reportbi'   
     name = fields.Char(u"Intitulé du rapport")

class kpi(models.Model):
     _name = 'phpevaluation.kpi'   
     name = fields.Char(u"Intitulé du KPI")
     value = fields.Many2one(u"Value")
     data_source = fields.Many2one('phpevaluation.sourcefield',string=u"Source de données")
     field_level = fields.Boolean(u"Niveau Attribut")


class DateValue(models.Model):
     _name = 'phpevaluation.datevalue'   
     date = fields.Date(u"Date")
     value = fields.Float(u"Valeur")
class DataSource(models.Model):
     _name = 'phpevaluation.sourcefield'   
     name = fields.Char(u"FieldName")
     model_source = fields.Many2one('ir.model',string=u"Modèle source")
     model_agreg  = fields.Many2one('ir.model',string=u"Modèle agrégation")
     field_source = fields.Char(u"Attribut source")

     











     

