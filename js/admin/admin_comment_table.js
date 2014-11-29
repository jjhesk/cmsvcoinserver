/**
 * Created by ryo on 14年9月5日.
 */

var setting_ob = setting_ob || {};
jQuery(function ($) {
    (function (d, interaction, table) {
        var $table = $(table);
        var api_prefix = window.location.origin + "/api/";

        $table.dataTable({
            processing: true,
            order: [ 1, 'desc' ],
            ajax: api_prefix + "cms/comment_table/?type=" + setting_ob.post_type,
            columns: [
                {
                    mDataProp: null,
                    sClass: "",
                    sDefaultContent: '<input type="checkbox" class="remove_app_comment">'
                },
                { data: "ID" },
                { data: "post_id" },
                { data: "comment"},
                { data: "flagged" },
                { data: "creationtime" },
                { data: "user" },
                { data: "name" }
            ],
            dom: '<"H"lfr>t<"F"<"remove">ip>',
            fnDrawCallback: init_checkboxes
        });
        $table.css({
            'text-align': 'center',
            'font-size': '14px'
        });

        function init_checkboxes() {
            var tbody = $("tbody", $table);
            var single_checkbox = tbody.find("[type=checkbox]");
            single_checkbox.each(function (index) {
                var tr = $(this).closest('tr'), row = $table.dataTable().api().row(tr), data = row.data();
                $(this).val(data.ID);
            });

            $(".remove").html('<input type="checkbox" class="check_all">Check All&nbsp;&nbsp;' +
                '<button class="button_remove_checked_comment">Remove selected comment</button>');

            var check_all = $(".check_all");

            check_all.on("click", function (e) {
                var d = $("tbody"), checkbox = d.find("[type=checkbox]");
                checkbox.each(function (index) {
                    var d = $(this);
                    if (check_all.is(':checked'))
                        d.prop('checked', true);
                    else d.prop('checked', false);
                });
            })

            $(".button_remove_checked_comment").on("click", function (e) {
                var d = $("tbody"), checkbox = d.find("[type=checkbox]"), which_boxes = "";
                checkbox.each(function (index) {
                    var d = $(this);
                    if (d.is(':checked'))
                        which_boxes += d.val() + ",";
                });
                which_boxes = which_boxes.substring(0, which_boxes.length - 1);
                //var loader = new AJAXLoader(this, "normal", "app_reg");

                if (which_boxes == "")
                    alert("No comment is selected.");
                else {
                    var loader = new AJAXLoader($(this), "normal", "app_reg");
                    var reload = new JAXAPIsupport(api_prefix + "api/cms/delete_comments", {"ids": which_boxes}, d,
                        function (that, json) {
                            $table.fnReloadAjax(api_prefix + "api/cms/comment_table/?type=" + setting_ob.post_type);
                        });
                    reload.add_loader(loader);
                    reload.init();
                }
            });
        }
    }(document, "click tap touch", "#admin_comment_table"));
});