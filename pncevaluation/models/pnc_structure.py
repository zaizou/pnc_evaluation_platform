# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api
from odoo import tools, _
from odoo.exceptions import ValidationError
from odoo.modules.module import get_module_resource
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
    numero = fields.Integer(u"Numéro de l axe",required=True)
    description = fields.Char(u"Description de l\'axe")
    color = fields.Integer(u"Couleur",default=1)
    budgets_ids = fields.One2many('pncevaluation.budgetpnc','axe_id',u"Budgets")
    focus = fields.Char('Focus de l\'Axe',required=True, translate=True)
    budget_estime = fields.Float(u"Budget Estimé")
    pnc_program_id = fields.Many2one('pncevaluation.pnc_program',string=u"Programme PNC")
    objectifs_ids = fields.One2many('pncevaluation.objectifpnc','axelie_id',u"Objectifs")
    action_programs_ids = fields.One2many('pncevaluation.pa','axe_id',string="Programmes d\'actions")
    contributions_ids = fields.One2many('pncevaluation.contribution','axe_id',string="Contributions")
    reunion_coor_ids = fields.One2many('pncevaluation.reucoor','axe_id',string=u"Réunions de coordination")
    reunion_eval_ids = fields.One2many('pncevaluation.reueval','axe_id',string=u"Réunions  d\'évaluation")
    fe_ids =  fields.One2many('pncevaluation.fe','axe_id',string=u"Formulaires d\'évaluation")
    fi_ids = fields.One2many('pncevaluation.finspection','axe_id',string=u"Formualires d\'inspection")
    

class ObjectifPNC(models.Model):
    _name = 'pncevaluation.objectifpnc'
    _description = u"Objectif du plan national cancer"
    name = fields.Char(u"Intitulé de de l\'objectif")
    numero = fields.Integer(u"Numéro de l\'objectif",required=True, translate=True)
    description = fields.Char(u"Description")
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
    

    date_debut_p = fields.Date(u"Date début prévue",required=True)
    date_debut_r = fields.Date(u"Date début réelle")
    datefin_p = fields.Date(u"Date fin prévue",required=True)
    datefin_r = fields.Date(u"Date fin réelle")
    #suivi 
    action_program_ids = fields.Many2many('pncevaluation.action_program',string=u"Programmes d\'action")
    forms_eval_subj = fields.One2many('pncevaluation.fe','action_realisee',string=u"Formulaires d\'evaluaion subjective")
    forms_inspection = fields.One2many('pncevaluation.finspection','action_realisee',string=u"Forms Inspection")
    

    


    

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
     structures_ids = fields.One2many('pncevaluation.structure','affiliation_id',string=u"Structures Affiliées")


class pnc_groupe(models.Model):
     _name = 'pncevaluation.groupe'
     _description = u"Les Groupes du Plan Cancer "
     name = fields.Char(u"Intitulé du groupe")
     tag = fields.Selection(selection=[('all','membre'),('inspection','Inspection'),('evaluation_subjective',u"Evaluation Subjective"),('pilotage',u"Comité de pilotage")],string=u"Etiquette")
     partie_prenante_id = fields.Many2one('pncevaluation.partieprenante',string=u"Partie prenante")
     contributeurs_ids = fields.Many2many('pncevaluation.contributeur',string=u"Contributeurs")

class pnc_contributeur(models.Model):
     #_inherit = 'res.partner'
     _inherit = ['mail.thread']
     _name = 'pncevaluation.contributeur'
     _description = u"Contributeur Plan Cancer "
     name = fields.Char(u"Nom")
     prenom = fields.Char(u"Prénom")
     fonction = fields.Char(u"Fonction")
     specialite = fields.Char(u"Spécialité")
     poids = fields.Float(u"Poids du contributeur")
     #informations PNC
     groups_ids = fields.Many2many('pncevaluation.groupe',string=u"Groupes")
     structure_id = fields.Many2one('pncevaluation.structure',string=u"Affiliation (Structure) ")

     user_id = fields.Many2one('res.users',string=u"Utilisateur lié")

     contributions_ids = fields.One2many('pncevaluation.contribution','contributeur_id',string=u"Contributions")
     reunions_coordination_ids = fields.Many2many('pncevaluation.reucoor',string=u"Réunions de coordinnations")
     reunions_coordination_invitation_ids = fields.Many2many('pncevaluation.reucoor',string=u"Invitations aux Réunions de coordinnations")
     reunions_evaluation_ids = fields.Many2many('pncevaluation.reueval',string=u"Réunions d évaluation ")
     reunions_evaluation_invitation_ids = fields.Many2many('pncevaluation.reueval',string=u"Invitations aux réunions d évaluation")

     @api.model
     def _default_image(self):
        image_path = get_module_resource('hr', 'static/src/img', 'default_image.png')
        return tools.image_resize_image_big(open(image_path, 'rb').read().encode('base64'))

     _mail_post_access = 'read'
     country_id = fields.Many2one('res.country', string='Nationnalité (Pays)')
     birthday = fields.Date('Date de naissance')
     gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
     ],string=u"Sexe")
     marital = fields.Selection([
        ('single', 'Célibataire'),
        ('married', 'Marié(e)'),
        ('widower', 'Veuf(ve)'),
        ('divorced', 'Divorcé(e)')
    ], string='Situation Familiate')
     address_id = fields.Many2one('res.partner', string='Addresse professionnelle')
     address_home_id = fields.Many2one('res.partner', string='Addresse personnelle')
     work_phone = fields.Char(u'téléphone professionnel ')
     mobile_phone = fields.Char(u'Tél portable')
     work_email = fields.Char(u'Addresse électronique professionnelle')
     work_location = fields.Char('Lieu de travail')
     notes = fields.Text('Notes')
     color = fields.Integer('Color Index', default=0)
     city = fields.Char(related='address_id.city')
     login = fields.Char(related='user_id.login', readonly=True)
     last_login = fields.Datetime(related='user_id.login_date', string=u'Dernière connexion', readonly=True)

     # image: all image fields are base64 encoded and PIL-supported
     image = fields.Binary("Photo", default=_default_image, attachment=True,
        help="This field holds the image used as photo for the pnc_contributeur, limited to 1024x1024px.")
     image_medium = fields.Binary("Medium-sized photo", attachment=True,
        help="Medium-sized photo of the pnc_contributeur. It is automatically "
             "resized as a 128x128px image, with aspect ratio preserved. "
             "Use this field in form views or some kanban views.")
     image_small = fields.Binary("Small-sized photo", attachment=True,
        help="Small-sized photo of the pnc_contributeur. It is automatically "
             "resized as a 64x64px image, with aspect ratio preserved. "
             "Use this field anywhere a small image is required.")

     @api.onchange('address_id')
     def _onchange_address(self):
        self.work_phone = self.address_id.phone
        self.mobile_phone = self.address_id.mobile
     @api.onchange('user_id')
     def _onchange_user(self):
        self.work_email = self.user_id.email
        self.name = self.user_id.name
        self.image = self.user_id.image

     @api.model
     def create(self, vals):
        tools.image_resize_images(vals)
        return super(pnc_contributeur, self).create(vals)

     @api.multi
     def write(self, vals):
        tools.image_resize_images(vals)
        return super(pnc_contributeur, self).write(vals)

     

     @api.multi
     def action_follow(self):
        """ Wrapper because message_subscribe_users take a user_ids=None
            that receive the context without the wrapper.
        """
        return self.message_subscribe_users()

     @api.multi
     def action_unfollow(self):
        """ Wrapper because message_unsubscribe_users take a user_ids=None
            that receive the context without the wrapper.
        """
        return self.message_unsubscribe_users()
     @api.model
     def _message_get_auto_subscribe_fields(self, updated_fields, auto_follow_fields=None):
        """ Overwrite of the original method to always follow user_id field,
            even when not track_visibility so that a user will follow it's pnc_contributeur
        """
        if auto_follow_fields is None:
            auto_follow_fields = ['user_id']
        user_field_lst = []
        for name, field in self._fields.items():
            if name in auto_follow_fields and name in updated_fields and field.comodel_name == 'res.users':
                user_field_lst.append(name)
        return user_field_lst



     @api.multi
     def get_contributs(self):
        #    compose_form = self.env.ref('pncevaluation.contributeur_form_view', False)
        #    return {
        #     'name': "Contributeurs",
        #     'type': 'ir.actions.act_window',
        #     'view_type': 'form',
        #     'view_mode': 'form',
        #     'res_model': 'pncevaluation.contributeur',
        #     'views': [(compose_form.id, 'form')],
        #     'view_id': compose_form.id,
        #     'target': 'new',
        # }
        return {
            'type': 'ir.actions.act_window',
            'res_model': 'pncevaluation.contributeur',
            'view_type': 'form',
            'view_mode': 'form',
            'target': 'new',
        }

class User(models.Model):
     _inherit = ['res.users']
     contributeurs_ids = fields.One2many('pncevaluation.contributeur','user_id',string="Contributeurs liés")



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