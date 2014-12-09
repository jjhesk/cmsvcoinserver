/**
 * Created by Hesk on 14年11月12日.
 */

jQuery(function ($) {
    (function (doc, M, duration) {

        var domain_api = window.location.origin + "/api/";
        var $listtable = $("#page_admin_scanner");
        var showButtonTemplate = Handlebars.compile($("#show_details_template").html());
        var interaction = "click tap touch";
        var editor_module = null;
        $("#admin_scan_details_table").addClass("hidden");
        TableInit();


        function TableInit() {
            $listtable.dataTable({
                processing: true,
                serverSide: true,
                iDisplayLength: 6,
                order: [ 1, 'desc' ],
                ajax: domain_api + "cms/get_admin_scanner_table_data",
                columns: [
                    {
                        class: "details_editor",
                        orderable: false,
                        render: function (data, type, full, meta) {
                            return showButtonTemplate(full);
                        }
                    },
                    { data: "ID" },
                    { data: "trace_id" },
                    { data: "vstatus" },
                    { data: "distribution" },
                    { data: "action_taken_by" },
                    { data: "user" },
                    { data: "stock_id" }
                ],
                initComplete: function (settings, json) {
                    $listtable.css({
                        'text-align': 'center',
                        'font-size': '14px'
                    });
                    var $log_menu = $("div.log_menu"), $sort_button = $("button", $log_menu);
                    $log_menu.css({"text-align": "center", "padding-top": "20px"});

                    $.each($sort_button, function () {
                        $(this).on(interaction, sort_condition);
                    })
                },
                fnDrawCallback: init_buttons
            });
        }

        function sort_condition(e) {
            var condition = $(this).attr("data-sort");
            $listtable.fnReloadAjax(domain_api + "cms/get_admin_scanner_table_data/" + "?sort=" + condition);
        }

        function init_buttons() {
            var $details_button = $('td.details_editor .view_details', $listtable);

            $.each($details_button, function (key, val) {
                var tr = $(this).closest('tr'),
                    row = $listtable.dataTable().api().row(tr),
                    data = row.data();
                $(this).on(interaction, {row_data: data}, show_scanning_details);
            });
        }

        function show_scanning_details(e) {
            var data = e.data.row_data;
            $("#page_admin_scanner_wrapper").addClass("hidden");
            $(".log_menu").addClass("hidden");
            editor_module = new ScanDetails("admin_scan_details_table", data, $listtable, domain_api);
        }
    }(document, MetaBoxSupport, 1000));
});