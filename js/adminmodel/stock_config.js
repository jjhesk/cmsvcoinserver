/**
 * Created by ryo on 14年8月13日.
 */
var StockConfigure = StockConfigure || {};

jQuery(function ($) {
    StockConfigure = function (component_name) {
        this.$container = $("#" + component_name);
        var $container = this.$container;
        this.$listtable = $("#stock_count_admin");
/*      this.stock_config_status = stock_config_status;
        this.stock_id = stock_id;*/
        this.$stock_config_status = $("#stock_configuration_complete", $container);
        this.$inn_gift_offer_location = $("#inn_gift_offer_location", $container);
        this.$innvendorid = $("#innvendorid", $container);
        this.$stock_system_type = $("#stock_system_type", $container);
        this.$ext_set = $(".rwmb-text", $container);
        this.$ext_no = $("#ext_no", $container);
        this.$stock_configuration_complete = $("#stock_configuration_complete", $container);
        this.remove_button_clicked = false;
        this.show_loading = false;
        this.status_1 = false;
        this.status_2 = false;
        this.status_3 = false;
        this.status_4 = false;
        this.finding_extensions_result = false;
        this.location_number = 0;
        this.vendor_location_template_output = Handlebars.compile($("#stock_configuration_stock_location_template").html());
        this.Init();
        //console.log($("option:selected", this.$inn_gift_offer_location).val());

    };
    StockConfigure.prototype = {
        Init: function () {
            var d = this;
            d.display_loading_gif();
            d.$inn_gift_offer_location.on("change", {that: d}, d.check_completion);
            d.$innvendorid.on("change", {that: d}, d.check_completion);
            d.$innvendorid.on("change", {that: d}, d.display_locations);
            d.$stock_system_type.on("change", {that: d}, d.check_completion);
            d.$ext_set.on("keyup", {that: d}, d.check_completion);
            d.$container.on("clone", {that: d}, d.check_completion);
            d.$container.on("clone", {that: d}, d.attach_checking_to_extensions);
        },
        getUrlParameter:function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++)
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam)
                {
                    return sParameterName[1];
                }
            }
        },
        display_loading_gif: function () {
            var d = this;
            var $loading = $("<img id='loading' src='./images/loading.gif' style='display:none'>");
            $loading.insertAfter(d.$innvendorid);

            $('#loading').ajaxStart(function () {
                if (parseInt($("option:selected", d.$innvendorid).val()) != -1 && d.$stock_config_status.val() !=2 && d.show_loading) {
                    $(this).show();
                    d.show_loading = false;
                }
            }).ajaxComplete(function () {
                $(this).hide();
            });
        },
        display_locations: function (e) {
            e.preventDefault();
            var d = e.data.that;
            d.show_loading = true;
            $(".display_location_group").remove();

            JAXAPIsupport("http://devcms.vcoinapp.com/api/vendor/stores_locations_choices/", {
                id: parseInt($("option:selected", d.$innvendorid).val())
            }, d, function (that, json) {
                var insert_html = "";

                $("#assign_location_ids", d.$container).val("");
                d.vendor_selected_ids = "";
                d.location_number = 0;

                $.each(json, function (key, value) {
                    var json_obj = {i: d.location_number, loc_id: key, display_text: value}, append = that.vendor_location_template_output(json_obj);
                    insert_html += append;
                    d.location_number++;
                });

                MetaBoxSupport.InsertHTMLFieldSelectAfter("#innvendorid", insert_html);
                $(".vendor_checkbox", d.$container).on("change", {that: d}, d.checkbox_ticked);
            });
        },
        attach_checking_to_extensions: function (e) {
            var d = e.data.that;
            $(".rwmb-text", d.$container).on("keyup", {that: d}, d.check_completion);
            $(".remove-clone").on("click", {that: d}, d.set_remove_button_clicked_status);
            $(".remove-clone").on("click", {that: d}, d.check_completion);
        },
        set_remove_button_clicked_status:function (e) {
            var d = e.data.that;
            d.remove_button_clicked = true;
        },
        checkbox_ticked: function (e) {
            var d = e.data.that;
            var result = {};

            for (var i = 0; i < d.location_number; i++) {
                if ($('#location' + i, d.$container).is(':checked'))
                    result[$('#location' + i, d.$container).val()] = $("#loc_text_" + $('#location' + i, d.$container).val(), d.$container).html();
            }

            var location_json = JSON.stringify(result);
            $("#assign_location_ids", d.$container).val(location_json);
        },

        check_completion: function (e) {
            var d = e.data.that;

            if ($("option:selected", d.$inn_gift_offer_location).val() != "any" && $("option:selected", d.$inn_gift_offer_location).val() != 'na') {
                d.status_1 = true;
            }
            else d.status_1 = false;

            if (parseInt($("option:selected", d.$innvendorid).val()) != -1) {
                d.status_2 = true;
            }
            else d.status_2 = false;

            if ($("option:selected", d.$stock_system_type).val() != "na") {
                d.status_3 = true;
            }
            else d.status_3 = false;

            d.finding_extensions();
            if (d.finding_extensions_result) {
                d.status_4 = true;
            }
            else d.status_4 = false;

            if (d.status_1 && d.status_2 && d.status_3 && d.status_4) {
                d.$stock_configuration_complete.val(1);
                d.$container.trigger("check_validation", [true]);
            }
            else {
                d.$stock_configuration_complete.val(0);
                d.$container.trigger("check_validation", [false]);
            }
        },
        finding_extensions: function () {
            var d = this, extension_list = $(".rwmb-text", d.$container).closest(".rwmb-input"), items = $(".rwmb-clone", extension_list),
                length = items.size();

            if (length > 0) {
                d.finding_extensions_result = true;

                if (!d.remove_button_clicked)
                    d.$ext_no.val(length);
                else {
                    d.$ext_no.val(length-1);
                    d.remove_button_clicked = false;
                }

                $.each(items, function (i) {
                    var $this = $(this), $input = $(".rwmb-text", $this);
                    if ($input.val() == "") {
                        d.finding_extensions_result = false;
                        return false;
                    }
                })
            }
        },
        setTriggerOnCheck: function (callback) {
            var d = this;
            d.$container.on('check_validation', function (e, b) {
                if (typeof b === 'boolean') {
                    callback(e, b);
                } else {
                    console.log("this is not a boolean - type error");
                }
            });
            /*d.checking_interval = setInterval(function () {
             d.check_data_confirmation_post();
             }, 1000);*/
        }
    }
});