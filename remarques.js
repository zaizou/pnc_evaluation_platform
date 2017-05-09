lignes: 242, 245
instance.web.auto_date_to_str()

var form_common = require('web.form_common');
avant
var pop = new instance.web.form.FormOpenPopup(self);
var pop = new instance.web.form.SelectCreatePopup(this);
après
var pop = new form_common.FormViewDialog(self, {
    res_model: self.node,
    res_id: node_id,
    context: self.context || self.dataset.context,
    title: _t("Open: ") + title
}).open();