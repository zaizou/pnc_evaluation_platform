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

# Code ajouté 
class AxePNC(models.Model):
    _name = 'phpevaluation.axepnc'
    _description = u"Axe du plan national cancer"
    name = fields.Char(u"Intitulé de l\'axe",required=True, translate=True)
    numero = fields.Integer(u"Numéro de l axe")
    description = fields.Char(u"Description de l\'axe")
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

class Indicator(models.Model):
    _name = 'phpevaluation.indicator'
    _description = 'PNC indicator'
    name = fields.Char('Nom de l indicateur', required=True, translate=True)
    valeur = fields.Float("Valeur de l indicator", default=0.0)
    parent_indicator_id = fields.Many2one('phpevaluation.indicator',
            string='indicateur parent', ondelete='SET NULL')
    child_indicators_ids = fields.One2many('phpevaluation.indicator','parent_indicator_id',string='Sous indicateurs')
    # questions = fields.One2many('survey.question', 'indicator_id',
    #                             string='Questions', copy=True)
    #agregation_level_id=fields.Many2one('phpevaluation.agregation_level',string=u"Niveau d\'agrégation", ondelete='SET NULL')
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
    
class pnc_program(models.Model):
     _name = 'phpevaluation.pnc'
     _description = "Le Plan National Cancer"
     name = fields.Char(u"Intitulé du Plan")
     date_debut = fields.Date(u"Date début du plan")
     date_fin = fields.Date(u"Date fin du plan")
     axes_ids = fields.One2many('phpevaluation.axepnc','pnc_program_id',string = u"Structure du Plan")
class action_program(models.Model):
     _name = 'phpevaluation.pa'
     _description = "Programme d\'Action"
     name = fields.Char(u"Intitulé du plan d'action")
     date = fields.Date(u"Date d'établissement du Plan")
    #  TODO ajout du modèle plan d'action 
     action_ids = fields.Many2many('phpevaluation.actionpnc',string = "Actions concernées")
     axe_id = fields.Many2one('phpevaluation.axepnc',string="Axes concernés",ondelete='SET NULL')
     objectifs_ids = fields.Many2many('phpevaluation.objectifpnc',string=u"Objectifs concernés")

class rapport_meo(models.Model):
     _name = 'phpevaluation.rmo'
     _description = "Rapport de mise en oeuvre"
     name = fields.Char(u"Intitulé du rapport")
     date_elaboration = fields.Date(u"Date d\'élaboration")
     formulaires_ids = fields.One2many('phpevaluation.fmo','rapport_moe_id',string=u"Formulaires de mise en oeuvre ") 
class formulaire_moe(models.Model):
     _name = 'phpevaluation.fmo'
     _description = "Formulaire de mise en oeuvre"
     date = fields.Date(u"Date")
     rapport_moe_id = fields.Many2one('phpevaluation.rmo',string=u"Rapport de mise en oeuvre associé")
     action_realisee = fields.Many2one('phpevaluation.actionpnc',string = u"Action réalisée")
     resultats_attendus= fields.Text(u"Résultats Attendus")
     manniere_moe = fields.Text(u"Décrire la manière dont l\'action à été mise ne oeuvre")
     parties_impliquee = fields.Text(u"Parties impliquée")
     descriptions_res = fields.Text(u"Description des résultats obtenus")
     dates_cles_ids = fields.One2many('phpevaluation.date_cle','form_moe_id',string=u"Dates clés de l\'Action")
     probleme_ronc = fields.Text(u"Problèmes rencontrés : écart entre l\'action prévue et l\'action réalisée, le cas échéant")
class date_cle(models.Model):
     _name = 'phpevaluation.date_cle'
     _description = u"Date Clé"
     date = fields.Date(u"Date de l\'évènement :")
     comment = fields.Text(u"Commentaire")
     form_moe_id = fields.Many2one(u"Formulaire de mise en oeuvre")
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
     etat = fields.Selection(selection=[(3,u"Finalisée"),(2,u"En cours"),(1,u"En préparation")],string=u"Etat de l\'action",)
     realisation = fields.Selection(selection=[(1,u"Mal réalisée"),(2,u"Plus ou moin bien réalisée"),(3,u"Bien réalisée"),(4,u"Très bien réalisée")],string=u"L\'Action a été",)
     res_attend = fields.Selection(selection= [(1,u"Moin satisfaisants"),(2,u"Plus ou moin satisfaisants"),(3,u"Satisfaisants"),(4,u"Plus que satisfaisants")],string=u"Résultats attendus / résultats obtenus",)
     inspection = fields.Boolean(u"Nécessité d\'inspection")
     date_debut_p = fields.Date(u"Date début prévue")
     date_debut_r = fields.Date(u"Date début réelle")
 #code ajoute
     datefin_p = fields.Date(u"Date fin prévue")
     datefin_r = fields.Date(u"Date fin réelle")
     retard = fields.Boolean(u"Retard entre dates prevues et reélles")
     inspection = fields.Boolean(u"Nécessité d\'inspection")
     appreciation = fields.Float(u"Appréciation")
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
     realisation = fields.Selection(selection=[(1,u"Mal réalisée"),(2,u"Plus ou moin bien réalisée"),(3,u"Bien réalisée"),(4,u"Très bien réalisée")],string='L\'Action a été')
     progress = fields.Text(u"Progrès accomplis")

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
     
     

#Partie 02 : Suivi 

class projetPlanAction(models.Model):
     _inherit = 'project.project'
     _name = 'phpevaluation.actionplanproject'
     tasks = fields.One2many('phpevaluation.actionplantask','project_id',string=u"Tâches")
     #TODO action niveau d'agregation
class tachePlanAction(models.Model):
     _inherit = 'project.task'
     _name = 'phpevaluation.actionplantask'
     project_id = fields.Many2one('phpevaluation.actionplanproject',string=u"Projet")
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

      
     #Axe 
     #
     #
     #
    
class reunionCoordination(models.Model):
     #_inherit = 'calendar.event'
     _name = 'phpevaluation.reucoor'
     _description = "reunion"
     #TODO date
     date = fields.Date("Date")
     start = fields.Datetime(u"Début")
     stop = fields.Datetime(u"Fin")
     name = fields.Char(u"Objet de la réunion")
     axe = fields.Many2one('phpevaluation.axepnc',string="axe")
     #state = fields.Selection(selection_add=[('done', "Terminée")])
     contributions_ids = fields.One2many('phpevaluation.contribution','reunion_coordination_id',string=u"Contributions")
     contributeurs_presents_ids = fields.Many2many('phpevaluation.contributeur',string=u"Contributeurs Présents")
     contributeurs_invites_ids = fields.Many2many('phpevaluation.contributeur',string=u"Contributeurs invités")
     pv_reunion_ids = fields.Many2one('phpevaluation.pvreunionaction',string=u"PV de la réunion")

class pv_reunion_action(models.Model):
     _name = 'phpevaluation.pvreunionaction'
     date = fields.Date("Date")
     name = fields.Char(u"Intitulé du PV ")

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

     
class DateBudget(models.Model):
     _name = 'phpevaluation.budgetpnc'
     _description = "Budget"
     name = fields.Char(u"Intitulé")
     date = fields.Date(u"Année")
     budget_estime = fields.Float(u"Budget estimé")
     budget_reel = fields.Float(u"Budget réel")
     rubriques_ids = fields.One2many('phpevaluation.rubriquebudget','budget_id',string="Rubriques")
     axe_id = fields.Many2one('phpevaluation.axepnc',string="Axe")
class rubriqueBudget(models.Model):
     _name = 'phpevaluation.rubriquebudget'
     _description = "Rubrique"
     name = fields.Char(u"Intitulé de la rubrique")
     budget_id = fields.Many2one('phpevaluation.budgetpnc',string="Budget")
     estime = fields.Float(u"Estimé")
     reel = fields.Float(u"Réel")










     

