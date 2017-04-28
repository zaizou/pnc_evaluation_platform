# -*- coding: utf-8 -*-
from odoo import http

# class PncEvaluation(http.Controller):
#     @http.route('/pnc_evaluation/pnc_evaluation/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/pnc_evaluation/pnc_evaluation/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('pnc_evaluation.listing', {
#             'root': '/pnc_evaluation/pnc_evaluation',
#             'objects': http.request.env['pnc_evaluation.pnc_evaluation'].search([]),
#         })

#     @http.route('/pnc_evaluation/pnc_evaluation/objects/<model("pnc_evaluation.pnc_evaluation"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('pnc_evaluation.object', {
#             'object': obj
#         })