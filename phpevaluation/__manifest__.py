# -*- coding: utf-8 -*-
{
    'name': "pnc_evaluation",
    'version' :'1.0',
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
    'category': 'Health Management',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','web_esi','web_gantt8','board','document','hr','calendar','project'], 

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/pnc_documents.xml',
        'views/pnc_stakeholders.xml',
        'views/pnc_menus.xml',
        'views/php_templates.xml',
        'views/indicator_report.xml'
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
    'sequence': 105,
    

}