/**
 * Created by ryo on 14年12月9日.
 */

jQuery(function ($) {
    (function (doc, M, duration) {

        var domain_api = window.location.origin + "/api/";
        var $listtable = $("#admin_vendor_address_table");
        var editAddressTemplate = Handlebars.compile($("#edit_address_template").html());
        var interaction = "click tap touch";
        var $entry_table = $("#datainput");
        TableInit();
        new EditAddress("datainput", domain_api, $listtable);

        function TableInit() {
            $listtable.dataTable({
                processing: true,
                serverSide: false,
                order: [ 1, 'desc' ],
                ajax: domain_api + "vendor/list_vendor_address",
                columns: [
                    {
                        class: "details_editor",
                        orderable: false,
                        render: function (data, type, full, meta) {
                            return editAddressTemplate(full);
                        }
                    },
                    { data: "ID" },
                    { data: "short_zh" },
                    { data: "zh" },
                    { data: "short_ja" },
                    { data: "ja" },
                    { data: "short_en" },
                    { data: "en" },
                    { data: "date" }
                ],
                initComplete: function (settings, json) {
                    $listtable.css({
                        'text-align': 'center',
                        'font-size': '14px'
                    });
                    //var $log_menu = $("div.log_menu"), $sort_button = $("button", $log_menu);
                    //$log_menu.css({"text-align": "center", "padding-top": "20px"});

                    var $add_entry = $(".newentry");
                    $add_entry.on(interaction, function () {
                        if ($(this).hasClass("hide")) {
                            $(this).html("Hide Table");
                            $(this).removeClass("hide");
                            $(this).addClass("show");
                            $entry_table.removeClass("hidden");
                        }
                        else {
                            $(this).html("Add New Entry");
                            $(this).removeClass("show");
                            $(this).addClass("hide");
                            $entry_table.addClass("hidden");
                        }
                    });
                }
                //fnDrawCallback: init_buttons
            });
        }

    }(document, MetaBoxSupport, 1000));
});