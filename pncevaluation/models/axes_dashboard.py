from odoo import fields, models


class View(models.Model):
	_inherit = 'ir.ui.view'
	type = fields.Selection(selection_add=[('axe_one', "axe_one"),('axe_two', "axe_two"),('axe_three', "axe_three"),
	('axe_four', "axe_four"),('axe_five', "axe_five"),('axe_six', "axe_six"),('axe_seven', "axe_seven"),('axe_eight', "axe_eight")])
class ActWindowView(models.Model):
	_inherit = 'ir.actions.act_window.view'
	view_mode = fields.Selection(selection_add=[('axe_one', "axe_one"),('axe_two', "axe_two"),('axe_un', "axe_un"),
	('axe_four', "axe_four"),('axe_five', "axe_five"),('axe_six', "axe_six"),('axe_seven', "axe_seven"),('axe_eight', "axe_eight")])