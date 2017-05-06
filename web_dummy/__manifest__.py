{
    'name': 'Dummy',
    'category': 'Hidden',
    'description': """
Bahrsolutions Dummy view.
========================

""",
    'version': '1.0',
    'depends': ['web'],
    'data' : [
        'views/web_dummy.xml',
    ],
    'qweb' : [
        'static/src/xml/*.xml',
    ],
    'auto_install': False
}
