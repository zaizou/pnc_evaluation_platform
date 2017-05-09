# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Base ESI',
    'category': 'Hidden',
    'description': """
Odoo Web ESI view.
========================

""",
    'version': '1.0',
    'depends': ['web'],
    'data' : [
        'views/web_esi_templates.xml',
    ],
    # 'qweb' : [
    #     'static/src/xml/*.xml',
    # ],
    'auto_install': False
}
