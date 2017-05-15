# -*- coding: utf-8 -*-
{
    'name': "Plan Cancer Suivi et Evaluation",
    'version' :'1.0',
    'summary': "Le module permettant de realiser l\'évaluation du Plan National Cancer",
    'version': "0.2",
    'category': 'Health Management',
    'description': 'Evaluation du Plan National Cancer',
    'author': "Bouzid MEDJDOUB , Aicha BACHIRI ",
    'website': "http://www.esi.dz",
    "license": "LGPL-3",
    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    
    

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