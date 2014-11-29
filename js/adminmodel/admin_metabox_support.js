/**
 * Created by Hesk on 14年10月14日.
 */
var metabox_add_button = {};
//ext_set
jQuery(function ($) {
    "use strict";
    (function (c, interaction) {
        metabox_add_button = function (field_id) {
            var d = this;
            d.$row = $("#" + field_id).closest(".rwmb-field.rwmb-text-wrapper");
            this.init();
        }
        metabox_add_button.prototype = {
            init: function () {
                var d = this;
                var text = '<div class="rwmb-field rwmb-text-wrapper"><div class="rwmb-label"></div><div class="rwmb-input"><button>Manage Extensions</button></div></div>';
                d.$row.before(text);
            }
        }
    });
});