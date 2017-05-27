# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
_logger = logging.getLogger(__name__)


class action_program(models.Model):
     _name = 'phpevaluation.pa'
     _description = "Programme d\'Action"
     name = fields.Char(u"Intitulé du plan d'action")
     date = fields.Date(u"Date d'établissement du Plan")
    #  TODO ajout du modèle plan d'action 
     action_ids = fields.Many2many('phpevaluation.actionpnc',string = "Actions concernées")
     axe_id = fields.Many2one('phpevaluation.axepnc',string="Axes concernés",ondelete='SET NULL')
     objectifs_ids = fields.Many2many('phpevaluation.objectifpnc',string=u"Objectifs concernés")

     donnees_epidemiologiques = fields.One2many('phpevaluation.de','plan_action_id',string=u"Données Epidémiologiques")
     cancers_ids = fields.One2many('phpevaluation.cancer','plan_action_id',string=u"Cancer Ciblés")
     objectifs_ids = fields.One2many('phpevaluation.objectifpa','plan_action_id',string=u"Objectifs")
     actions_ids = fields.One2many('phpevaluation.actionpa','plan_action_id',string=u"Actions à envisager")
     controles_qualite_ids = fields.One2many('phpevaluation.conrtoleq','plan_action_id',string=u"Controles de qualité")
     dispositions_reglementaires_ids = fields.One2many('phpevaluation.dispreglementaire','plan_action_id',string=u"Dispositions Règlementaires")
     evaluations_ids = fields.One2many('phpevaluation.evaluationpa','plan_action_id',u"Evalutions")
     kpi_ids = fields.One2many('phpevaluation.kpi','plan_action_id',string=u"Indicateurs de performance")
     mediatisation = fields.Many2one('phpevaluation.mediatisation',string=u"Médiatisation")
     structures_pilotage = fields.One2many('phpevaluation.structure','plan_action_id',string=u"Structures de pilotage")

     

class Mediatisation(models.Model):
     _name = 'phpevaluation.mediatisation'
     _description = u"Médiatisation"
     name = fields.Char(u"Intitulé")
     description = fields.Text(u"Description")
     populations_ciblees = fields.One2many('phpevaluation.population','mediatisation_id',string=u"Populations ciblées")
     medias_ids = fields.One2many('phpevaluation.media','mediatisation_id',string=u"Médias")
     


class MoyenMedia(models.Model):
     _name = 'phpevaluation.media'
     _description = u"Médiatisation"
     name = fields.Char(u"Intitulé")
     impact_estime = fields.Float(u"Impact estimé")
     impact_realise = fields.Float(u"Impact réalisé")
     mediatisation_id = fields.Many2one('phpevaluation.mediatisation',string=u"Médiatisation")



class KPI(models.Model):
     _name = 'phpevaluation.kpi'
     _description = u"KPI"
     name = fields.Char(u"Intitulé")
     valeur = fields.Float("Valeur")
     valeur_min = fields.Float("Valeur Min")
     valeu_max = fields.Float("Valeur Max")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class EvaluationPlanAction(models.Model):
     _name = 'phpevaluation.evaluationpa'
     _description = u"Evaluation Plan Action"
     name = fields.Char(u"Intitulé")
     date = fields.Date("Date")
     description = fields.Text(u"Description")
     typeEvaluation = fields.Selection(selection=[("Interne",u"Interne"),("Externe","Externe")],string="Type d\'évaluation")
     structure_chargee_id = fields.Many2one('phpevaluation.structure',string="Structure Chargée")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class Lois(models.Model):
     _name = 'phpevaluation.lois'
     _description = u"Lois"
     name = fields.Char(u"Intitulé")
     texte = fields.Text(u"Description")
     date_elaboraion = fields.Date('Date d\'élaboration')
     code = fields.Char("Code")
     disposition_id = fields.Many2one('phpevaluation.dispreglementaire',string=u"Disposition règlementaire")

class DispositionReglementaire(models.Model):
     _name = 'phpevaluation.dispreglementaire'
     _description = u"Disposition Règlementaire"
     name = fields.Char(u"Intitulé")
     date = fields.Date("Date")
     texte = fields.Text(u"Description")
     lois_ids = fields.One2many('phpevaluation.lois','disposition_id',string=u"Lois")
     etat = fields.Selection(selection=[(u"Achevée",u"Achevée"),(u"En cours",u"En cours"),(u"Non acceptée",u"Non acceptée")],string="Type de contrôle")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class ControleQualite(models.Model):
     _name = 'phpevaluation.conrtoleq'
     _description = u"Controle de Qualité"
     name = fields.Char(u"Intitulé")
     description = fields.Text(u"Description")
     periodicite = fields.Integer(u"Périodicité (mois)")
     typeControle = fields.Selection(selection=[('Interne','Interne'),(u"Externe",u"Externe")],string="Type de contrôle")
     structure_chargee_id =fields.Many2one('phpevaluation.structure',string=u"Structure Chargée")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class Structure(models.Model):
     _name = 'phpevaluation.structure'
     _description = u"Structure"
     name = fields.Char(u"Intitulé")
     responsable_id = fields.Many2one('phpevaluation.contributeur',string="Responsable")
     #personnel
     affiliation_id = fields.Many2one('phpevaluation.partieprenante',string=u"Affiliation")
     controle_qualite_ids = fields.One2many('phpevaluation.conrtoleq','structure_chargee_id',string=u"Contrôles de qualité")
     evaluations_pa_ids = fields.One2many('phpevaluation.evaluationpa','structure_chargee_id',string=u"Evaluation Plan d\'action")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class ActionPlanAction(models.Model):
     _name = 'phpevaluation.actionpa'
     _description = u"Action"
     name = fields.Char(u"Intitulé")
     description = fields.Text(u"Description de l\'action")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class ObjectifPlanAction(models.Model):
     _name = 'phpevaluation.objectifpa'
     _description = u"Cancer"
     name = fields.Char(u"Intitulé")
     description = fields.Text("Description")
     donnes_epi_ciblees = fields.One2many('phpevaluation.de','objectif_plan_action_id',string=u"Données Epidémiologques Ciblées")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class critereExclusion(models.Model):
     _name = 'phpevaluation.critereexc'
     _description = u"Critère d\'exclusion"
     name = fields.Char(u"Intitulé")
     population_ciblee_id = fields.Many2one('phpevaluation.population',string=u"Population ciblée")

class Cancer(models.Model):
     _name = 'phpevaluation.cancer'
     _description = u"Cancer"
     name = fields.Char(u"Intitulé")
     plan_action_id = fields.Many2one('phpevaluation.pa',string=u"Plan d\'action")

class DonneeEpidemiologique(models.Model):
     _name = 'phpevaluation.de'
     _description = u"donnée épidémiologique"
     typeDonnee = fields.Many2one('phpevaluation.typede',string=u"Type")
     valeur_reelle = fields.Float(u"Valeur réelle")
     valeur_chaine = fields.Char(u"Valeur Chaine")
     plan_action_id = fields.Many2one('phpevaluation.pa',string="Programme d\'action")
     objectif_plan_action_id = fields.Many2one('phpevaluation.objectifpa',string=u"Objectif Plan d\'action")

class typeDonneeEpidemiologique(models.Model):
     _name = 'phpevaluation.typede'
     _description = u"Type données épidémiologiques"
     name = fields.Char(u"Intitulé")
     unite = fields.Char(u"Unité")
     population_concernees = fields.One2many('phpevaluation.population','type_donnee_epi_id',string=u"Populations concernées")

class population(models.Model):
     _name = 'phpevaluation.population'
     _description = u"Population"
     name = fields.Char(u"Intitulé")
     tranches_age_ids = fields.One2many('phpevaluation.trancheage','population_id',string="Tranches d\'age")
     sexe = fields.Selection(selection=[('Masculin','Masculin'),(u"Féminin",u"Féminin")],string="Sexe")
     type_donnee_epi_id = fields.Many2one('phpevaluation.typede',string=u"Type données épidémiologiques")
     mediatisation_id = fields.Many2one('phpevaluation.mediatisation',string=u"Médiatisation")
class trancheAge(models.Model):
     _name = 'phpevaluation.trancheage'
     _description = u"Tranche d\'age"
     name = fields.Char(u"Intitulé")
     age_min = fields.Float("Age min")
     age_max = fields.Float("Age max")
     population_id = fields.Many2one("phpevaluation.population",string="Population")
     
    