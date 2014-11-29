/**
 * Created by ryo on 14年8月13日.
 */
var StockConfigure = StockConfigure || {};

jQuery(function ($) {
    StockConfigure = function (component_name, checker) {
        this.$container = $("#" + component_name);
        var $container = this.$container;
        this.$listtable = $("#stock_count_admin");
        this.$innvendorid = $("#innvendorid", $container);
        this.$stock_system_type = $("#stock_system_type", $container);
        this.$assign_location_ids = $("#assign_location_ids", $container);
        this.$stock_configuration_complete = $("#stock_configuration_complete", $container);
        this.show_loading = false;
        this.location_number = 0;
        this.domain = window.location.origin + "/api/";
        this.vendor_location_template_output = Handlebars.compile($("#stock_configuration_stock_location_template").html());
        this.$extension_obj = $("#ext_v2").val();
        this.checker = checker;
        this.Init();
    };
    StockConfigure.prototype = {
        Init: function () {
            var d = this;
            d.$innvendorid.on("change", {that: d}, d.display_locations);
            d.$stock_system_type.on("change", {that: d}, d.call_checker);
        },
        call_checker: function (e) {
            var d = e.data.that;
            d.checker.check_stock_type();
        },
        display_locations: function (e) {
            e.preventDefault();
            var d = e.data.that;
            d.show_loading = true;
            $(".display_location_group").remove();

            var loader = new AJAXLoader(d.$innvendorid, "normal", "app_reg");
            var enter = new JAXAPIsupport(d.domain + "vendor/stores_locations_choices/", {
                id: parseInt($("option:selected", d.$innvendorid).val())
            }, d, function (that, json) {
                var insert_html = "";

                d.$assign_location_ids.val("");
                d.vendor_selected_ids = "";
                d.location_number = 0;

                $.each(json, function (key, value) {
                    var json_obj = {i: d.location_number, loc_id: key, display_text: value}, append = that.vendor_location_template_output(json_obj);
                    insert_html += append;
                    d.location_number++;
                });

                MetaBoxSupport.InsertHTMLFieldSelectAfter("#innvendorid", insert_html);
                $("input.vendor_checkbox", d.$container).on("change", {that: d}, d.checkbox_ticked);
            });
            enter.add_loader(loader);
            enter.init();
        },
        checkbox_ticked: function (e) {
            var d = e.data.that;
            var result = [];
            for (var i = 0; i < d.location_number; i++) {
                if ($('#location' + i, d.$container).is(':checked'))
                //result[$('#location' + i, d.$container).val()] = $("#loc_text_" + $('#location' + i, d.$container).val(), d.$container).html();
                    result.push($('#location' + i, d.$container).val());
            }
            //var location_json = JSON.stringify(result);
            var location_json = result.join(",");
            d.$assign_location_ids.val(location_json);
            d.checker.check_address();
        }
    }
})
;