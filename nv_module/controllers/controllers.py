# -*- coding: utf-8 -*-
from odoo import http

# class NvModule(http.Controller):
#     @http.route('/nv_module/nv_module/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/nv_module/nv_module/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('nv_module.listing', {
#             'root': '/nv_module/nv_module',
#             'objects': http.request.env['nv_module.nv_module'].search([]),
#         })

#     @http.route('/nv_module/nv_module/objects/<model("nv_module.nv_module"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('nv_module.object', {
#             'object': obj
#         })