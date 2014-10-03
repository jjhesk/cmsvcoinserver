/**
 * Created by ryo on 14年9月5日.
 */

var approve = approve || {},
    reject = reject || {}, action_view_doc = action_view_doc || {};
var setting_ob = setting_ob || {};
jQuery(function ($) {
    (function (d, interaction, table) {
        var $table = $(table);
        var api_prefix = "http://devcms.vcoinapp.com/api/";

        $table.dataTable({
            processing: true,
            ajax: api_prefix + "comment/comment_table/?type=" + setting_ob.post_type,
            columns: [
                { data: "ID" },
                { data: "app_post_id" },
                { data: "comment"},
                { data: "flagged" },
                { data: "creationtime" },
                { data: "user" },
                { data: "name" }
            ]
        });
        $table.css({
            'text-align': 'center',
            'font-size': '14px'
        });
    }(document, "click tap touch", "#" + setting_ob.comment_table_id));
});