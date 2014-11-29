/**
 * Created by ryo on 14年8月7日.
 */
var approve = approve || {},
    reject = reject || {}, action_view_doc = action_view_doc || {};
var setting_ob = setting_ob || {};
jQuery(function ($) {
    (function (d, interaction, table) {
        var $table = $(table),
            api_prefix = window.location.origin + "/api/systemlog/";

        $table.dataTable({
            processing: true,
            order: [ 0, 'desc' ],
            ajax: api_prefix + "get_admin_stock_management_log",
            columns: [
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
            dom: 'lfrtip',
            fnRowCallback: function (nRow, full, iDisplayIndex, iDisplayIndexFull) {
                var $row = $(nRow)
                $row.attr("id", 'nm' + full.lid);
                return nRow;
            }
        });

        $table.css({
            'text-align': 'center',
            'font-size': '14px'
        });


        var log_menu_admin_stock_mang = "Admin Stock Management", log_menu_admin_coupon_mang = "Admin Coupon Management",
            log_menu_stock_count_log = "Stock Count Log", log_menu_admin_vendor_mang = "Admin Vendor Management",
            log_menu_developer_app_mang = "Developer App Management", log_menu_redemption = "Redemption";
        $(".log_button").on(interaction, function (e) {
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