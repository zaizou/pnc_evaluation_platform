# -*- coding: utf-8 -*-

from odoo import models, fields, api

class AgregationLevel(models.Model):
    _name = 'php_evaluation.agregation_level'
    _description = 'Niveau d\'Agregationn loopa d un indicatneur : Evaluation Subjective Action, Evaluation Objective Action, Action, Objectif, Axe '
    name = fields.Char('Niveau d Agregation',required=True, translate=True)
    agregation_level_parent_parent_id = fields.Many2one('php_evaluation.agregation_level',string='Niveau d Agregation Parent', ondelete='SET NULL')
    agregation_level_child_id = fields.Many2one('php_evaluation.agregation_level',string='Niveau Agregation Fils ', ondelete='SET NULL')
    indicator_ids = fields.One2many('php_evaluation.indicator','agregation_level_id',string='indicators')

class AgregationLevelInstance(models.Model):
    _name = 'php_evaluation.agregation_level_instance'
    _description = 'Niveau d Agregationn : Axe 01 : Prevention, Axe 02 , Objectif 01 ... '
    name = fields.Char('Niveau d Agregation',required=True, translate=True)
    agregation_level_instance_parent_id = fields.Many2one('php_evaluation.agregation_level_instance',string='Niveau d Agregation Parent', ondelete='SET NULL')
    agregation_level_instance_child_id = fields.Many2one('php_evaluation.agregation_level',string='Niveau Agregation Fils ', ondelete='SET NULL')
    indicator_ids = fields.One2many('php_evaluation.indicator','agregation_level_id',string='indicators')
    
class DataModel(models.Model):
    _name = 'php_evaluation.data_model'
    _description = 'Modelisation d une valeur numerique'
    name = fields.Char('Model',required=True, translate=True)
    tag = fields.Char('Tag',required=True, translate=True)

class CalculationFunction(models.Model):
    _inherit = 'ir.actions.server'
    _name ='php_evaluation.calculation_function'

class CalculationParameter(models.Model):
    _name = 'php_evaluation.calculation_parameter'
    _description = u"Parameter used optionnaly to calculate some categories of indicators"
    name = fields.Char(u"Paramètre de Calcul de l\'indicateur")
    value = fields.Float(u"Parameter Value",default=0.0)
    weight = fields.Float(u"Poids du paramètre",default=1)

class DatedValue(models.Model):
    _name = 'php_evaluation.dated_value'
    _description = u"Parameter used optionnaly to calculate some categories of indicators"
    date = fields.Date(u"")
    value = fields.Float(u"La valeur")


class Indicator(models.Model):
    _name = 'php_evaluation.indicator'
    _description = 'PNC indicator'
    name = fields.Char('Nom de l\'indicateur', required=True, translate=True)
    valeur = fields.Float("Valeur de l\'indicator", default=0.0)
    parent_indicator = fields.Many2one('php_evaluation.indicator',
            string='indicator Parent', ondelete='SET NULL')
    questions = fields.One2many('survey.question', 'indicator_id',
                                string='Questions', copy=True)
    agregation_level_id=fields.Many2one('php_evaluation.agregation_level',string='Niveau d Agregation ', ondelete='SET NULL')
    calculation_function=fields.Many2one('ir.actions.server',string='Fonction de Calcul', ondelete='SET NULL')
    weight=fields.Integer('Poids de l indicator', default=1)
    max_value=fields.Float("Valeur Max", default=0.0)
    min_value=fields.Float("Valeur Min", default=0.0)
    @api.multi
    def calcul_valeur_indicator(self, id_indicator):
    	count = 0
    	somme = 0
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach 141414")
        for indic in id_indicator:
            return indic.calculation_function()
    	"""for indic in id_indicator:
    		for question in indic.questions:
				count= count + 1
				somme = somme + question.question_value
				indic.valeur = somme / count """
class IndicatorCategory(models.Model):
    _name = 'php_evaluation.indicator_category'
    _description = 'The Category of the Indicator that indcludes (in french) Impact,Realisation,'
    name = fields.Char(u"Catégorie de l\'indicateur", required=True, translate=True)
    tag = fields.Char(u"Tag de la catégorie")


class SurveyQuestionExtend(models.Model):
    _inherit = 'survey.question'
      # indicator.
    indicator_id = fields.Many2one('php_evaluation.indicator',string='indicator')
    #Data Model
    #data_model_id=fields.Many2One('survey.data_model',string='Modele de donnees')

    @api.one
    def update_related_indicator(self, question_id):
        
        #count = 0
        #somme = 0
        #questions = self.env['survey.question'].browse(question_id)
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        #question_calculation()
        #for question in questions:
        _logger.warning("self.indicator_id.id  == %s",self.indicator_id.id)
        _logger.warning("self.indicator_id.fonction_calcul.id  == %s",self.indicator_id.fonction_calcul.id)
        return {
                "type": "ir.actions.server",
                "id": self._id.fonction_calcul.id,
                "context": {"active_id": self._id.id, "active_model": "survey.indicator"}
        }
class SurveyUserInputLineExtend(models.Model):
    _inherit='survey.user_input_line'
    valeur=fields.Float('Numerical value')

    @api.model
    def save_lines(self,user_input_id,question,post,answer_tag,):
        call=super(SurveyUserInputLineExtend,self).save_lines(user_input_id,question,post,answer_tag)
        _logger.warning("child called")
        _logger.warning("child called")
        _logger.warning("child called")
        _logger.warning("child called")
        return call

