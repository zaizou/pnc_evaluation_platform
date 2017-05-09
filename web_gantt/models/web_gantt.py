from odoo import fields, models


class View(models.Model):
    _inherit = 'ir.ui.view'
    type = fields.Selection(selection_add=[('gantt', "Gantt")])
class ActWindowView(models.Model):
    _inherit = 'ir.actions.act_window.view'
    view_mode = fields.Selection(selection_add=[('gantt', "Gantt")])