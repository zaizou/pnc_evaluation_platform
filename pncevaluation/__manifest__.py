# -*- coding: utf-8 -*-
{
    'name': "Plan Cancer Suivi et Evaluation",
    'version' :'1.0',
    'summary': "Le module permettant de realiser l\'évaluation du Plan National Cancer",
    'version': "0.2",
    'category': 'Plan Cancer Evaluation et Suivi',
    'description': 'Evaluation du Plan National Cancer',
    'author': "Bouzid MEDJDOUB , Aicha BACHIRI ",
    'website': "http://www.esi.dz",
    "license": "LGPL-3",
    
    'depends': ['base','web_esi','web_gantt8','board','document','calendar'],

    'data': [
      'security/ir.model.access.csv',
        'views/pnc_documents.xml',
        'views/plan_action.xml',
        'views/pnc_menus.xml',
        'views/pnc_evaluation_templates.xml',
         'data/pnc_groups.xml'
    ],
    'demo': [
        'demo/demo.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
    'sequence': 105,   

}