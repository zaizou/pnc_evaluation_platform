import json
from odoo import models, api, _, fields
from odoo.tools.misc import formatLang


class agregation_level(models.Model):
    _inherit = "php_evaluation.agregation_level"

    @api.one
    def _kanban_dashboard(self):
        self.kanban_dashboard = json.dumps(self.get_journal_dashboard_datas())

    @api.one
    def _kanban_dashboard_graph(self):
        self.kanban_dashboard_graph = json.dumps(self.get_bar_graph_datas())
        
    kanban_dashboard = fields.Text(compute='_kanban_dashboard')
    kanban_dashboard_graph = fields.Text(compute='_kanban_dashboard_graph')
    show_on_dashboard = fields.Boolean(string='Show journal on dashboard', help="Whether this agregation level should be displayed on the dashboard or not", default=True)

    @api.multi
    def toggle_favorite(self):
        self.write({'show_on_dashboard': False if self.show_on_dashboard else True})
        return False

    @api.multi
    def get_bar_graph_datas(self):
        data = []
        for agreg in self:
            for indic in agreg.indicateur_ids:
                ker=indic.valeur
                data.append({'label': _('Past'), 'value':ker, 'type': 'past'})
        return [{'values': data}]

    @api.one
    def get_journal_dashboard_datas(self):
            return {'title':'hello'}