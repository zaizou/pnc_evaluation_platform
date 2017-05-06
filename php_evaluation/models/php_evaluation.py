# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)

class AgregationLevel(models.Model):
    _name = 'php_evaluation.agregation_level'
    _description = u"Niveau d\'Agrégationn  d\'un indicatneur : Evaluation Subjective Action, Evaluation Objective Action, Action, Objectif, Axe "
    name = fields.Char('Niveau d Agregation',required=True, translate=True)
    description = fields.Char('Description du niveau')
    level = fields.Selection(selection=[('axe','Axe'),('objectif','Objectif'),('action','Action'),('mesure','Mesure')],string=u"Niveau d\'agrégation",)
    agregation_level_parent_parent_id = fields.Many2one('php_evaluation.agregation_level',string='Niveau d Agregation Parent', ondelete='SET NULL')
    agregation_level_childs_ids = fields.One2many('php_evaluation.agregation_level','agregation_level_parent_parent_id',string=u"Niveaux d\'agrégation fils ")
    indicator_ids = fields.One2many('php_evaluation.indicator','agregation_level_id',string='indicators')
    pnc_program_id = fields.Many2one('php_evaluation.pnc_program',string=u"Programme PNC")
    action_program_id = fields.Many2one('php_evaluation.action_program',string=u"Programme d\'action")
    #instances_ids = fields.One2many('php_evaluation.agregation_level_instance','agregation_level_id',string='Instances')

class AgregationLevelInstance(models.Model):
    _name = 'php_evaluation.agregation_level_instance'
    _description = 'Niveau d Agregationn : Axe 01 : Prevention, Axe 02 , Objectif 01 ... '
    name = fields.Char('Niveau d Agregation',required=True, translate=True)
    agregation_level_id = fields.Many2one('php_evaluation.agregation_level',string=u"Niveau d\'agrégation (Catégorie)", ondelete='SET NULL')
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
    parent_indicator_id = fields.Many2one('php_evaluation.indicator',
            string='indicateur parent', ondelete='SET NULL')
    child_indicators_ids = fields.One2many('php_evaluation.indicator','parent_indicator_id',string='Sous indicateurs')
    questions = fields.One2many('survey.question', 'indicator_id',
                                string='Questions', copy=True)
    agregation_level_id=fields.Many2one('php_evaluation.agregation_level',string=u"Niveau d\'agrégation", ondelete='SET NULL')
    calculation_function=fields.Many2one('ir.actions.server',string='Fonction de calcul', ondelete='SET NULL')
    weight=fields.Integer('Poids de l\'indicator', default=1)
    max_value=fields.Float("Valeur Max", default=0.0)
    min_value=fields.Float("Valeur Min", default=0.0)
    @api.one
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
        #for indic in id_indicator:
        return id_indicator.calculation_function()
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
    indicator_id = fields.Many2one('php_evaluation.indicator',string=u"Indicateur associé")
    valeur = fields.Float(u"Valeur de la question")
    weight = fields.Float(u"Poids de la question ",default=1)
    #Data Model
    #data_model_id=fields.Many2One('survey.data_model',string='Modele de donnees')

    @api.one
    def update_related_indicator(self, question_id):
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        _logger.warning("testing the new approach")
        #question_calculation()
        #for question in questions:
        _logger.warning("self.indicator_id.id  == %s",self.indicator_id.id)
        _logger.warning("self.indicator_id.fonction_calcul.id  == %s",self.indicator_id.calculation_function.id)
        count = 0
        sum = 0
        for inputL in question_id.user_input_line_ids:
            sum += inputL.value_number
            count= count +1
        if(count>0):
            sum = sum / count
            self.valeur = sum
            self.indicator_id.calcul_valeur_indicator(indicator_id)
        #question_id.write({'valeur':sum})
        """
        self.ensure_one()
        action =  {
                "type": "ir.actions.server",
                "id": self.indicator_id.calculation_function.id,
                "context": {"active_id": self.indicator_id.id, "active_model": "survey.indicator"}
        }
        """


      
class SurveyUserInputLineExtend(models.Model):
    _inherit='survey.user_input_line'
    valeur=fields.Float('Numerical value')

    @api.model
    def save_lines(self,user_input_id,question,post,answer_tag,):
        _logger.warning("child called")
        _logger.warning("child called")
        _logger.warning("child called")
        _logger.warning("child called")
        call=super(SurveyUserInputLineExtend,self).save_lines(user_input_id,question,post,answer_tag)
        questions=self.env['survey.question'].browse(question)
        for question in question:
            question.update_related_indicator(question)
        return call

class pnc_program(models.Model):
     _name = 'php_evaluation.pnc'
     _description = "Le Plan National Cancer"
     agregation_level_ids = fields.One2many('php_evaluation.agregation_level','pnc_program_id',string = u"Structure du Plan",domain = [('level','=','axe')])
class action_program(models.Model):
     _name = 'php_evaluation.pa'
     _description = "Programme d\'Action"
     agregation_level_ids = fields.One2many('php_evaluation.agregation_level','action_program_id',string = u"Structure du Programme")
class rapport_meo(models.Model):
     _name = 'php_evaluation.rmo'
     _description = "Rapport de mise en oeuvre"
     formulaires_ids = fields.One2many('php_evaluation.fmo','rapport_moe_id',string=u"Formulaires de mise en oeuvre ") 
class formulaire_moe(models.Model):
     _name = 'php_evaluation.fmo'
     _description = "Formulaire de mise en oeuvre"
     rapport_moe_id = fields.Many2one('php_evaluation.rmo',string=u"Rapport de mise en oeuvre associé")
     action_realisee = fields.Many2one('php_evaluation.agregation_level',string = u"Niveau d\'agrégation",domain = [('level','=','action')])
     resultats_attendus= fields.Text(u"Résultats Attendus")
     manniere_moe = fields.Text(u"Décrire la manière dont l\'action à été mise ne oeuvre")
     #partie prenante
     descriptions_res = fields.Text(u"Description des résultats obtenus")
     dates_cles_ids = fields.One2many('php_evaluation.date_cle','form_moe_id',string=u"Dates clés de l\'Action")
     probleme_ronc = fields.Text(u"Problèmes rencontrés : écart entre l\'action prévue et l\'action réalisée, le cas échéant")
class date_cle(models.Model):
     _name = 'php_evaluation.date_cle'
     _description = u"Date Clé"
     date = fields.Date(u"Date de l\'évènement")
     comment = fields.Text(u"Commentaire")
     form_moe_id = fields.Many2one(u"Formulaire de mise en oeuvre")
class rapport_evalution(models.Model):
     _name = 'php_evaluation.re'
     _description = u"Rapport d\'évaluation"
     formulaires_evaluation_ids = fields.One2many('php_evaluation.fe','rapport_evaluation_id',string=u"Formulaires d\'évaluation")
     formulaires_inspection_ids = fields.One2many('php_evaluation.finspection','rapport_evaluation_id',string=u"Formulaires d\'inspection")
class formulaire_evaluation(models.Model):
     _name = 'php_evaluation.fe'
     _description = u"Formulaire d\'évaluation"
     rapport_evaluation_id = fields.Many2one('php_evaluation.re',string=u"Rapport d\'évaluation")
     action_realisee = fields.Many2one('php_evaluation.agregation_level',string = u"Niveau d\'agrégation",domain = [('level','=','action')])
     etat = fields.Selection(selection=[(1,u"Complètement réalisée"),(2,u"Partiellement réalisée"),(3,u"Pas d\'information / pas mentionnée")],string='Etat de l\'action')
     realisation = fields.Selection(selection=[(1,u"Mal réalisée"),(2,u"Plus ou moin bien réalisée"),(3,u"Bien réalisée"),(4,u"Très bien réalisée")],string='L\'Action a été')
     res_attend = fields.Selection(selection= [(1,u"Moin satisfaisants"),(2,u"Plus ou moin satisfaisants"),(3,u"Satisfaisants"),(4,u"Plus que satisfaisants")],string=u"Résultats attendus / résultats obtenus")
     inspection = fields.Boolean(u"Nécessité d\'inspection")
     date_debut_p = fields.Date(u"Date de début prévue")
     date_debut_r = fields.Date(u"Date de début réelle")
     appreciation = fields.Float(u"Appréciation")
     remarques = fields.Text(u"Remarques")
class formulaire_inspection(models.Model):
     _name = 'php_evaluation.finspection'
     _description = u"Formulaire d\'inspection"
     rapport_evaluation_id = fields.Many2one('php_evaluation.re',string= u"Rapport d\'évaluation")
     action_realisee = fields.Many2one('php_evaluation.agregation_level',string = u"Niveau d\'agrégation",domain = [('level','=','action')])
     #groupe_inspection
     #personne chargée
     date = fields.Date(u"Date de l\'inspection")
     #model region
     region = fields.Char(u"Région")
     lieu = fields.Char(u"Lieu(x)")
     #Model Mission Inspection
     constat = fields.Text(u"Constat")
     realisation = fields.Selection(selection=[(1,u"Mal réalisée"),(2,u"Plus ou moin bien réalisée"),(3,u"Bien réalisée"),(4,u"Très bien réalisée")],string='L\'Action a été')
     progress = fields.Text(u"Progrès accomplis")
