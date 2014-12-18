/**
 * Created by ryo on 14年12月5日.
 */

var ScanDetails = {};
jQuery(function ($) {
    (function (doc, interactions, M) {
        ScanDetails = function (component, data, $scan_table, domain_api) {
            this.$container = $("#" + component);
            this.data = data;
            this.detailTemplate = Handlebars.compile($("#scan_details_template").html());
            this.vendorQRTemplate = Handlebars.compile($("#vendor_qr_template").html());
            this.domain_api = window.location.origin + "/api/";
            this.$scan_table = $scan_table;
            this.domain_api = domain_api;
            this.tableInit();
        };
        ScanDetails.prototype = {
            tableInit: function () {
                var d = this;
                d.$container.removeClass("hidden");

                var loader = new AJAXLoader($("#toggle_vendor_qr"), "normal", "app_reg");
                var enter = new JAXAPIsupport(d.domain_api + "cms/get_vendor_qr/", {
                    id: d.data.stock_ext_id
                }, d, function (that, json) {
                    $("#vendor_qr", that.$container).html(that.vendorQRTemplate({vendor_qr: json.qr}));
                    var render = {
                        extension: that.data.stock_ext_id,
                        phone_qr: that.data.qr_a,
                        email_qr: that.data.qr_b,
                        action: that.data.action_taken_by,
                        ext_name: json.label,
                        product_name: json.product_name,
                        thumb: json.thumb,
                        user_id: that.data.user,
                        mac: that.data.handle_mac_address
                    };
                    $("#admin_scan_details_table").html(that.detailTemplate(render));

                    var $toggle_button = $(".toggle_qr", that.$container);
                    $.each($toggle_button, function (key, val) {
                        $(this).on(interactions, {that: that}, that.toggle_qr_code);
                    });

                    var $back_button = $("#back", that.$container), $obtain = $("#obtain_status", that.$container);
                    $back_button.on(interactions, {that: that}, that.off_table);

                    $.each($(".hidden_field_switcher"), function (h) {
                        new Switcher($(this));
                    });
                    that.switch_obtain_status(that.data.obtained);
                    $obtain.on(interactions, {that: that}, that.update_obtain_status);
                });
                enter.add_loader(loader);
                enter.init();
            },
            update_obtain_status: function (e) {
                var d = e.data.that;
                var obtain_status = parseInt($("#obtain_store_val", d.$container).val());
                var $back_btn = $("#back");

                M.InputControlSingle($back_btn, true);
                $back_btn.off(interactions);
                var loader = new AJAXLoader($("#obtain_loader"), "normal", "app_reg");
                var enter = new JAXAPIsupport(d.domain_api + "cms/update_obtain/", {
                    id: d.data.ID, status: obtain_status
                }, d, function (that, json) { //success cases
                    $("#action_taken_by", that.$container).html(json.action_taken_by);
                    M.InputControlSingle($back_btn, false);
                    $back_btn.on(interactions, {that: d}, that.off_table);
                    that.$scan_table.fnReloadAjax(that.domain_api + "cms/get_admin_scanner_table_data");
                }, function (that, msg) { //failure cases
                    M.InputControlSingle($back_btn, false);
                    $back_btn.on(interactions, {that: d}, that.off_table);
                    that.switch_obtain_status(!obtain_status);
                });
                enter.add_loader(loader);
                enter.init();
            },
            switch_obtain_status: function ($obtain_status) {
                var d = this;
                if ($obtain_status == 1) {
                    $("#obtain_status", d.$container).prop('checked', true);
                }
                else $("#obtain_status", d.$container).prop('checked', false);
            },
            off_table: function (e) {
                var d = e.data.that;
                d.$container.addClass("hidden");
                $("#page_admin_scanner_wrapper").removeClass("hidden");
                $("#back", d.$container).off(interactions);
                $(".toggle_qr", d.$container).off(interactions);
                $(".log_menu").removeClass("hidden");
            },
            toggle_qr_code: function (e) {
                var d = e.data.that;

                var $td = $(this).closest("td"), $qr_image = $("img", $td),
                    $all_btn = $(".toggle_qr", d.$container) , $all_qr = $(".qr_row img", d.$container);

                if ($(this).hasClass("hide")) {
                    $.each($all_btn, function () {
                        $(this).html("Show QR Code");
                        $(this).removeClass("show");
                        $(this).addClass("hide");
                    });

                    $.each($all_qr, function () {
                        $(this).addClass("hidden");
                    });

                    $(this).html("Hide QR Code");
                    $(this).removeClass("hide");
                    $(this).addClass("show");
                    $qr_image.removeClass("hidden");
                }
                else {
                    $(this).html("Show QR Code");
                    $(this).removeClass("show");
                    $(this).addClass("hide");
                    $qr_image.addClass("hidden");
                }
            }
        }
    }(document, "click tap touch", MetaBoxSupport));
});