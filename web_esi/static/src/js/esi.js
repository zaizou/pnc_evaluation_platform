odoo.define('web_esi.esi', function (require) {
	var core = require('web.core');
	var View = require('web.View');
	var _lt = core._lt;
	var MyView= View.extend({
		icon: 'fa-briefcase',
		display_name: _lt("ESI view"),
	});
	

	core.view_registry.add('esi', MyView);


});