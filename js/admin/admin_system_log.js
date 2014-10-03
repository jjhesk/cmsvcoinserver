/**
 * Created by ryo on 14年8月7日.
 */
var approve = approve || {},
    reject = reject || {}, action_view_doc = action_view_doc || {};
var setting_ob = setting_ob || {};
jQuery(function ($) {
    (function (d, interaction, table) {
        /*     var displaysitephoto = function (row) {
         var h = "", d = row, id = row.lid;
         if (d.hasOwnProperty('gf_cp_attachments')) {
         if (d.gf_cp_attachments != null) {
         $.each(d.gf_cp_attachments, function (i, val) {
         */
        /*         var data = {
         attachmentid: val,
         pointer_url: d.gf_cp_attachments + "?attachment_id=" + val
         };*/
        /*
         h += '<input id="action_view_doc-' + id + '' + i + '" type="button" class="button" value="doc-' + i + '" onclick="action_view_doc(' + id + ',' + i + ');"/>';
         });
         }
         }
         return h;
         };

         Handlebars.registerHelper('buttonlist', function () {
         return new Handlebars.SafeString(displaysitephoto(this));
         });
         */
        var $table = $(table);
        var api_prefix = "http://devcms.vcoinapp.com/api/systemlog/";

        $table.dataTable({
            processing: true,
            ajax: api_prefix + "get_admin_stock_management_log",

            columns: [
                /* {
                 class: "details-control",
                 orderable: false,
                 //"data": "lid",
                 //"defaultContent": actionsTemplate,
                 render: function (data, type, full, meta) {
                 return actionsTemplate(full);
                 }
                 },*/
                { data: "ID" },
                { data: "user" },
                { data: "comments",
                    render: function (data, type, full, meta) {
                        return data;
                    }},
                { data: "time" },
                { data: "event_code" },
                { data: "error_code" }
            ],
            "dom": '<"log_menu">lfrtip',
            fnRowCallback: function (nRow, full, iDisplayIndex, iDisplayIndexFull) {
                var $row = $(nRow)

                //  console.log(d.template_used_data);
                //  console.log("fnRowCallback attr");
                $row.attr("id", 'nm' + full.lid);

                return nRow;
            }
        });

        $table.css({
            'text-align' : 'center',
            'font-size': '14px'
        });


        var log_menu_admin_stock_mang = "Admin Stock Management", log_menu_admin_coupon_mang = "Admin Coupon Management",
            log_menu_stock_count_log = "Stock Count Log", log_menu_admin_vendor_mang = "Admin Vendor Management",
            log_menu_developer_app_mang = "Developer App Management", log_menu_redemption = "Redemption";

        $("div.log_menu").html(
            '<button class = "log_button">' + log_menu_admin_stock_mang + '</button>' +
                '<button class = "log_button">' + log_menu_admin_coupon_mang + '</button>' +
                '<button class = "log_button">' + log_menu_stock_count_log + '</button>' +
                '<button class = "log_button">' + log_menu_admin_vendor_mang + '</button>' +
                '<button class = "log_button">' + log_menu_developer_app_mang + '</button>' +
                '<button class = "log_button">' + log_menu_redemption + '</button>'
        );
        $("div.log_menu").css({"text-align": "center", "padding-top": "20px"});

        $(".log_button").click(function (e) {



                switch (e.target.innerHTML) {
                    case log_menu_admin_stock_mang:
                        $table.fnReloadAjax(api_prefix + "get_admin_stock_management_log");
                        break;
                    case log_menu_admin_coupon_mang:
                        $table.fnReloadAjax(api_prefix + "get_admin_coupon_management_log");
                        break;
                    case log_menu_stock_count_log:
                        $table.fnReloadAjax(api_prefix + "get_stock_count_log");
                        break;
                    case log_menu_admin_vendor_mang:
                        $table.fnReloadAjax(api_prefix + "get_admin_vendor_management_log");
                        break;
                    case log_menu_developer_app_mang:
                        $table.fnReloadAjax(api_prefix + "get_developer_app_management_log");
                        break;
                    case log_menu_redemption:
                        $table.fnReloadAjax(api_prefix + "get_redemption_log");
                        break;
                }
            }
        );

    }(document, "click tap touch", "#admin_page_system_log"));
});