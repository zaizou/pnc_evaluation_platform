# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, models
import logging
_logger = logging.getLogger(__name__)

class BoardThree(models.AbstractModel):
    _name = 'board.boardthree'
    _description = "Boardthree"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board BoardThree 222")
        res = super(BoardThree, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board BoardThree 222")
        custom_view = self.env['ir.ui.view.customthree'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
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
class BoardFour(models.AbstractModel):
    _name = 'board.boardfour'
    _description = "Boardfour"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board BoardFour 222")
        res = super(BoardFour, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board BoardFour 222")
        custom_view = self.env['ir.ui.view.customfour'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        _logger.warning("res Board BoardFour 222")
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

class BoardFive(models.AbstractModel):
    _name = 'board.boardfive'
    _description = "Boardfive"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board BoardFive 222")
        res = super(BoardFive, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board BoardFive 222")
        custom_view = self.env['ir.ui.view.customfive'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
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

class BoardSix(models.AbstractModel):
    _name = 'board.boardsix'
    _description = "Boardsix"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board BoardSix 222")
        res = super(BoardSix, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board BoardSix 222")
        custom_view = self.env['ir.ui.view.customsix'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        _logger.warning("res Board BoardSix 222")
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

class BoardSeven(models.AbstractModel):
    _name = 'board.boardseven'
    _description = "Boardseven"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board BoardSeven 222")
        res = super(BoardSeven, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board BoardSeven 222")
        custom_view = self.env['ir.ui.view.customseven'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        _logger.warning("res Board BoardSeven 222")
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

class BoardEight(models.AbstractModel):
    _name = 'board.boardeight'
    _description = "Boardeight"
    _auto = False

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        """
        Overrides orm field_view_get.
        @return: Dictionary of Fields, arch and toolbar.
        """
        _logger.warning("res Board BoardEight 222")
        res = super(BoardEight, self).fields_view_get(view_id=view_id, view_type=view_type, toolbar=toolbar, submenu=submenu)
        _logger.warning("res Board BoardEight 222")
        custom_view = self.env['ir.ui.view.customeight'].search([('user_id', '=', self.env.uid), ('ref_id', '=', view_id)], limit=1)
        if custom_view:
            res.update({'custom_view_id': custom_view.id,
                        'arch': custom_view.arch})
        _logger.warning("res Board BoardEight 222")
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

