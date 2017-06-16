# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from xml.etree import ElementTree
import logging
from odoo.http import Controller, route, request
_logger = logging.getLogger(__name__)

class Board(Controller):

    # @route('/board/get_view', type='html', auth='user')
    # def get_view(self):
    #     return 0

    @route('/board/add_to_dashboard', type='json', auth='user')
    def add_to_dashboard(self, action_id, context_to_save, domain, view_mode,board_name, name=''):
        # Retrieve the 'My Dashboard_name' action from its xmlid
        _logger.warning("board :: "+board_name)
        _logger.warning("board_name :: "+board_name)
        _logger.warning("board_name :: "+board_name)
        _logger.warning("board_name :: "+board_name)
        _logger.warning("board_name :: "+board_name)
        
        strAction = str("board.open_board_my_dash_action")+board_name
        _logger.warning("strAction :: "+strAction)
        action = request.env.ref(strAction)
        _logger.warning("Action")
        _logger.warning(action)


        if action  and action['views'][0][1] == 'form' and action_id:
            # Maybe should check the content instead of model board.board ?
            view_id = action['views'][0][0]

            strBoard = str("board.board")+board_name
            _logger.warning("strBoard :: "+strBoard)
            board = request.env[strBoard].fields_view_get(view_id, 'form',False,False)
            _logger.warning("Board")
            _logger.warning(board)
            if board and 'arch' in board:
                xml = ElementTree.fromstring(board['arch'])
                column = xml.find('./board/column')
                if column is not None:
                    new_action = ElementTree.Element('action', {
                        'name': str(action_id),
                        'string': name,
                        'view_mode': view_mode,
                        'context': str(context_to_save),
                        'domain': str(domain)
                    })
                    column.insert(0, new_action)
                    arch = ElementTree.tostring(xml, 'utf-8')
                    strView = str('ir.ui.view.custom')+board_name
                    _logger.warning("strView :: "+strView)
                    request.env[strView].create({
                        'user_id': request.session.uid,
                        'ref_id': view_id,
                        'arch': arch
                    })
                    return True

        return False
