/**
 * Created by hesk on 7/19/14.
 */

var OrderConfirmation = {};
jQuery(function ($) {
    "use strict";
    (function (d, status, interaction) {

        OrderConfirmation = function (component_name) {
            var metabox = $("#" + component_name);
            this.$container = metabox;
            this.$odk_phone_remarks = $("#odk_phone_remarks", metabox);
            this.$odk_cr = $("#odk_cr", metabox);
            this.$ui_ref_order_id = $("#ui_ref_order_id", metabox);
            this.$odk_ordermetho = $("#odk_ordermetho", metabox);
            this.$odk_projectid = $("#odk_projectid", metabox);
            this.$odk_address = $("input[name=odk_address]", metabox);
            // this.$odk_start_t = $("input[name=odk_start_t]", metabox);
            // this.$odk_end_t = $("input[name=odk_end_t]", metabox);
            this.$schedule_switcher = $("#odk__time_schedule_setting", metabox);
            this.$daytimemanagement = $("#odk__schedule_day_length", metabox);
            this.daylength_val_selected = $("option:selected", this.$daytimemanagement).val();
            this.schedule_val_selected = $("option:selected", this.$schedule_switcher).val();
            this.order_method = $("option:selected", this.$odk_ordermetho).val();
            this.$schedule_box = $("#schedule", this.$container);
            this.schedule_box_val = $("#schedule", this.$container).val();
            this.$container.data("OrderConfirmation", this);

            this.check_data_success = false;

            this.init();
        }

        OrderConfirmation.prototype = {
            init: function () {
                var d = this;
                if (d.schedule_box_val == '') {
                    d.init_schedule_box();

                } else {
                    //     MetaBoxSupport.InsertHTMLFieldSelectAfter("#odk__time_schedule_setting", d.schedule_box_val);
                    $("#odk__time_schedule_setting_description", d.$container).html("Scheduled at " + d.schedule_box_val);
                    MetaBoxSupport.InputControlSingle(d.$schedule_switcher, true);
                }
            },

            ordertype: function (e) {
                e.preventDefault();

                var $this = $(this),
                    that = e.data.that,
                    selected_val = $this.find("option:selected").val(),
                    $select = $(".supporting-field", that.$container),
                    $order_type_select = $("select", $select),
                    $order_id_input = $("#ui_ref_order_id", that.$container),
                    is_online = selected_val == 'online',
                    is_call = selected_val == 'call',
                    is_default = selected_val == '-1';

                if (is_online) {
                    MetaBoxSupport.InputControlSingle($order_type_select, false);
                    MetaBoxSupport.InputControlSingle($order_id_input, false);
                    that.$inputOrderSystemIDSelection.show();
                    console.log("is_online");
                }

                if (is_call) {
                    MetaBoxSupport.InputControlSingle($order_type_select, true);
                    // MetaBoxSupport.doSelect($order_id_input, '');
                    MetaBoxSupport.InputControlSingle($order_id_input, true);
                    // MetaBoxSupport.InputControlEach(e.data.target_element, true);
                    that.$inputOrderSystemIDSelection.hide();
                    console.log("is_call");
                }

                if (is_default) {
                    // MetaBoxSupport.doSelect($order_id_input, '');
                    MetaBoxSupport.InputControlSingle($order_id_input, true);
                    that.$inputOrderSystemIDSelection.hide();
                    console.log("is_default");
                }

            },
            //get the string from the current status title
            getOrderConfirmationTitle: function () {
                var d = this,
                    daylength_val_selected = $("option:selected", d.$daytimemanagement).val(),
                    selected_method = $("option:selected", d.$odk_ordermetho).val(),
                    projectID = d.$odk_projectid.val(),
                    schedule_val_selected = $("option:selected", d.$schedule_switcher).val(),
                    additional = "";
                $("#work_status_virtual").val("1");

                if (schedule_val_selected == 'range') {
                    additional = ":0";
                }
                return projectID + ":" + daylength_val_selected + " Order:" + selected_method + additional;
            },
            order_confirmation_response: function (d, dataFull) {
                d.MapLocation(dataFull);
                d.fill_data_box(dataFull);
                MetaBoxSupport.doSelect("#odk_ordermetho", "online");
            },
            MapLocation: function (data) {
                var d = this;
                console.log(data);
                if (data.loc == undefined) {
                    d.Map_hide_control(false);
                    return false;
                } else
                    d.Map_hide_control(true);

                var mapController = $(".rwmb-map-field").data("mapController");
                var latLng = new google.maps.LatLng(data.loc.point.k, data.loc.point.A);
                mapController.map.setCenter(latLng);
                mapController.marker.setPosition(latLng);
                mapController.updateCoordinate(latLng);
            },


            fill_data_box: function (data) {
                var d = this;
                if (data.hasOwnProperty("address")) {
                    d.$odk_address.val(data.address);
                }
                if (data.hasOwnProperty("services")) {
                    d.$odk_phone_remarks.val(data.services);
                }
                if (data.hasOwnProperty("cr_id")) {
                    d.$odk_cr.val(data.cr_id);
                }
            },

            panelSwitchTotal: function ($metabox, bool) {
                if (!$metabox.hasClass("postbox"))
                    console.log("wrong tag class location.. postbox class does not find");
                MetaBoxSupport.InputControlEach($('input,select,textarea,.button', $metabox), bool);
            },

            panelSwitch: function ($metabox, bool, $exception) {
                if (!$metabox.hasClass("postbox"))
                    console.log("wrong tag class location.. postbox class does not find");
                MetaBoxSupport.InputControlEach($('input,select,textarea,.button', $metabox).not($exception), bool);
            },

            cb_set_schedule: function (e) {
                e.preventDefault();
                var $this = $(this),
                    that = e.data.that,
                    changedVal = $this.find("option:selected").val();

                console.log("select changed:" + changedVal);
                if (changedVal == '-1') {
                    that.$wraper_range_days.hide();
                    that.$wraper_range_days.hide();
                } else if (changedVal == 'single') {
                    that.$wraper_single_day.show();
                    that.$wraper_range_days.hide();
                } else if (changedVal == 'range') {
                    that.$wraper_single_day.hide();
                    that.$wraper_range_days.show();
                }
            },
            init_schedule_box: function () {
                var d = this,
                    logic = function (currentDateTime) {
                        // 'this' is jquery object datetimepicker
                        if (currentDateTime.getDay() == 6) {
                            this.setOptions({
                                minTime: '11:00'
                            });
                        } else
                            this.setOptions({
                                minTime: '8:00'
                            });
                    },
                    endcontent = "",
                    basic_settings = {
                        allowTimes: [ '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45',
                            '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
                            '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45'],
                        mask: true,
                        /*  datepicker: false,
                         timepicker: false,*/
                        minDate: 0,
                        onChangeDateTime: function (dp, $input) {
                            endcontent = $input.val();
                            d.schedule_val_selected = $("option:selected", d.$schedule_switcher).val();
                            if (d.schedule_val_selected == 'single') {

                            } else if (d.schedule_val_selected == 'range') {
                                var a = $('#odk_t1', d.$wraper_range_days).val(), b = $('#odk_t2', d.$wraper_range_days).val();
                                endcontent = a + " - " + b;
                            } else {
                                endcontent = "";
                            }
                            console.log(endcontent);
                            d.$schedule_box.val(endcontent);
                        }
                    };

                if (status.hasOwnProperty("days_schedule_html")) {
                    MetaBoxSupport.InsertHTMLFieldSelectAfter("#odk__time_schedule_setting", status.days_schedule_html);
                    d.$wraper_range_days = $(".rwmb-field.time-range", d.$container);
                    d.$wraper_single_day = $(".rwmb-field.single-day", d.$container);
                    if ($.fn.datetimepicker) {
                        $('#odk_t1', d.$wraper_range_days).datetimepicker(basic_settings);
                        $('#odk_t2', d.$wraper_range_days).datetimepicker(basic_settings);
                        $('#odk_single', d.$wraper_single_day).datetimepicker(basic_settings);
                    }


                    /*d.$inputOrderSystemIDSelection.on("change.orderref", function (e) {
                     e.preventDefault();
                     console.log("change.orderref");
                     var $this = $(this),
                     selected_val = $("option:selected", $this).val();
                     if (selected_val > 0) {
                     console.log("selected_val>0 .orderref");
                     JAXSupport({
                     action: "get_order_data",
                     led_id: selected_val
                     }, d, d.order_confirmation_response);
                     }
                     if (selected_val == undefined || selected_val == '') {
                     d.Map_hide_control(false);
                     }
                     });*/
                    d.$schedule_switcher.on('change', {that: d}, d.cb_set_schedule);
                    if (parseInt(d.schedule_val_selected) === -1 || d.schedule_val_selected == '') {
                        d.$wraper_range_days.hide();
                        d.$wraper_single_day.hide();
                    }
                } else {
                    alert("schedule box is not init.");
                }

                console.log(d.schedule_val_selected);
                console.log("here is the first one");
                console.log(d.$schedule_switcher);
            },
            init_order_by_field: function (status) {
                var d = this;
                if (status.hasOwnProperty("tpm_normal_field")) {
                    //  console.log(status.recent_orders_html);
                    //  var html = "<select id=\"ui_ref_order_id\"><option val=\"-1\">Select recent orders</option></select>";
                    d.$inputOrderSystemIDSelection = MetaBoxSupport.InsertHTMLFieldSelectNextTo("#odk_ordermetho", status.recent_orders_html);
                    d.$inputOrderSystemIDSelection.on("change.orderref", function (e) {
                        e.preventDefault();
                        console.log("change.orderref");
                        var $this = $(this),
                            selected_val = $("option:selected", $this).val();
                        if (selected_val > 0) {
                            console.log("selected_val>0 .orderref");
                            JAXSupport({
                                action: "get_order_data",
                                led_id: selected_val
                            }, d, d.order_confirmation_response);
                        }
                        if (selected_val == undefined || selected_val == '') {
                            d.Map_hide_control(false);
                        }
                    });
                    if (d.order_method == '-1') {
                        d.$inputOrderSystemIDSelection.hide();
                    }
                }
                // watch_status_doc.on('change.doc', {target_element: cms_element_submission }, watch.select).trigger('change.doc');
                d.$odk_ordermetho.on('change.order', {
                    target_element: $("#odk_client,#odk_cr", d.$container),
                    that: d
                }, d.ordertype).trigger('change.order');
            },

            Map_hide_control: function (bool) {
                var a = $(".rwmb-map-goto-address-button"),
                    b = $(".rwmb-field.rwmb-text-wrapper:has(#odk_reference_loc)");
                if (bool) {
                    a.hide();
                    b.hide();
                } else {
                    a.show();
                    b.show();
                }
            },
            check_data_confirmation_post: function () {
                //  $("option:selected", this.$schedule_switcher).val() != '-1'
                var d = this,
                    a = $("option:selected", d.$schedule_switcher).val() != '-1',
                    b = $("option:selected", d.$odk_ordermetho).val() != '-1',
                    f = $("option:selected", d.$daytimemanagement).val() != '-1',
                    $c = $("#odk_district option:selected", d.$container),
                    c = $c.val() != '-1';
                d.check_data_success = a && b && c && f;
                try {
                    d.$container.trigger("check_validation", [d.check_data_success]);
                } catch (e) {
                    console.log('trigger event is not found');
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
                d.checking_interval = setInterval(function () {
                    d.check_data_confirmation_post();
                }, 1000);
            }
        }
    }(document, jp_status, "click tap touch"));
});
