# -*- coding: utf-8 -*-

from datetime import timedelta, date, datetime

import pytz


import time
import math

from odoo.osv import expression, osv, orm
from odoo.exceptions import UserError, ValidationError, Warning
from odoo import api, fields, models, _, tools


import logging
_logger = logging.getLogger(__name__)

class view(osv.osv):
    _inherit = ['ir.ui.view']
    type = fields.Selection(selection_add=[('dummyview', 'DummyView')])

 #   def __init__(self):
 #       super(view).__init__(self)
 #       super(view)._columns['type'].selection.append(('dummyview','DummyView'))
