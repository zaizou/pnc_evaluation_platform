# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, models
import logging
_logger = logging.getLogger(__name__)

class Board(models.AbstractModel):
    _name = 'board.board'
    _description = "Board"
    _auto = False

    @api.model
    def create(self, vals):
        return self

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """

        res = super(Board, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        
        custom_view = self.env['ir.ui.view.custom'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        res.update({
            'arch': self._arch_preprocessing(res['arch']),
            'toolbar': {'print': [], 'action': [], 'relate': []}
        })
        return res

    @api.model
    def _arch_preprocessing(self, arch):
        from lxml import etree

        def remove_unauthorized_children(node):
            for child in node.iterchildren():
                if child.tag == 'action' and child.get('invisible'):
                    node.remove(child)
                else:
                    child = remove_unauthorized_children(child)
            return node

    def encode(s):
        if isinstance(s, unicode):
            return s.encode('utf8')
        return s

        archnode = etree.fromstring(encode(arch))
        return etree.tostring(remove_unauthorized_children(archnode), pretty_print=True)

class BoardOne(models.AbstractModel):
    _name = 'board.boardone'
    _description = "Boardone"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """

        res = super(BoardOne, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)

        

        custom_view = self.env['ir.ui.view.customone'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        _logger.warning("res Board one")
        _logger.warning(res)
        _logger.warning("Custom view")
        _logger.warning(custom_view)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        res.update({
            'arch': self._arch_preprocessing(res['arch']),
            'toolbar': {'print': [], 'action': [], 'relate': []}
        })
        return res


    @api.model
    def _arch_preprocessing(self, arch):
        from lxml import etree

        def remove_unauthorized_children(node):
            for child in node.iterchildren():
                if child.tag == 'action' and child.get('invisible'):
                    node.remove(child)
                else:
                    child = remove_unauthorized_children(child)
            return node

        def encode(s):
            if isinstance(s, unicode):
                return s.encode('utf8')
            return s

        archnode = etree.fromstring(encode(arch))
        return etree.tostring(remove_unauthorized_children(archnode), pretty_print=True)

class BoardTwo(models.AbstractModel):
    _name = 'board.boardtwo'
    _description = "Boardtwo"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board two 222")
        res = super(BoardTwo, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board two 222")
        custom_view = self.env['ir.ui.view.customtwo'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        _logger.warning("res Board two 222")
        _logger.warning(res)
        _logger.warning("Custom view")
        _logger.warning(custom_view)
        res.update({
            'arch': self._arch_preprocessing(res['arch']),
            'toolbar': {'print': [], 'action': [], 'relate': []}
        })
        return res


    @api.model
    def _arch_preprocessing(self, arch):
        from lxml import etree

        def remove_unauthorized_children(node):
            for child in node.iterchildren():
                if child.tag == 'action' and child.get('invisible'):
                    node.remove(child)
                else:
                    child = remove_unauthorized_children(child)
            return node

        def encode(s):
            if isinstance(s, unicode):
                return s.encode('utf8')
            return s

        archnode = etree.fromstring(encode(arch))
        return etree.tostring(remove_unauthorized_children(archnode), pretty_print=True)

class custom_view_one(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customone'
    
class custom_view_two(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customtwo'

class custom_view_three(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customthree'
    
class custom_view_four(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customfour'

class custom_view_five(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customfive'
    
class custom_view_six(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customsix'

class custom_view_seven(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customseven'
    
class custom_view_eight(models.Model):
    _inherit = 'ir.ui.view.custom'
    _name = 'ir.ui.view.customeight'
