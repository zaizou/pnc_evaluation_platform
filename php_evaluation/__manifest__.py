# -*- coding: utf-8 -*-
{
    'name': "pnc_evaluation",

    'summary': """
        Le module permettant de realiser 
        l'évaluation du Plan National Cancer
        """,

    'description': """
        Evaluation du Plan National Cancer
    """,

    'author': "ESI",
    'website': "http://www.esi.dz",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base,survey'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}