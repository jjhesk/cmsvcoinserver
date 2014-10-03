/**
 * ff_cr_id: "#input_9_5"…}
 ff_cr_id: "#input_9_5"
 ff_expectdate: "#input_9_2"
 ff_expectedtime: "#input_9_3"
 ff_geoloc: "#input_9_10"
 field_value_cr_id: ""
 head: "#input_9_"
 * @type {gfsetting|*|{}}
 */
var gfsetting = gfsetting || {};
var formcontroller = formcontroller || {};
var map = null, geodata = {}, geodefault = {
    l: 22.25,
    L: 114.1667
};
console.log(gfsetting);
jQuery(function ($) {
    (function (d, wrapper, h, interactions, t) {
        $(wrapper).bind('init_gmap', function (e) {
            if (typeof GMaps === "function") {
                //  var point = new google.maps.LatLng(-12.043333, -77.028333, false);

                var gfield = $(".gfield:has(" + h.ff_geoloc + ")"),
                    gmaphtml = $('#gmapmock').html();

                gfield.hide().before(gmaphtml);
                if (map != null) {
                    console.log("found the map");
                    console.log(map);
                    map = {};
                }
                /*                console.log(geodata);
                 console.log("rez the map");*/
                var isdefault = $.isEmptyObject(geodata.point);
                map = new GMaps({
                    el: '#map',
                    lat: isdefault ? geodefault.l : geodata.point.k,
                    lng: isdefault ? geodefault.L : geodata.point.A
                });
                // map.setCenter(-12.043333, -77.028333, null);
                map.addMarker({
                    lat: isdefault ? geodefault.l : geodata.point.k,
                    lng: isdefault ? geodefault.L : geodata.point.A,
                    draggable: true,
                    dragend: formcontroller.support_gmap_drag
                });
                if (!isdefault) {
                    google.maps.event.trigger(map, 'resize');
                }
                /*   map.drawOverlay({
                 lat: 22.25,
                 lng: 114.1667,
                 content: '<div class="overlay">Lima</div>'
                 });
                 */
                $('#geocoding_form').submit(function (e) {
                    e.preventDefault();
                    GMaps.geocode({
                        address: $('#address').val().trim(),
                        callback: function (results, status) {
                            if (status == 'OK') {
                                var latlng = results[0].geometry.location;
                                map.removeMarkers();
                                map.addMarker({
                                    lat: latlng.lat(),
                                    lng: latlng.lng(),
                                    draggable: true,
                                    dragend: formcontroller.support_gmap_drag
                                });
                                map.setCenter(latlng.lat(), latlng.lng());
                            }
                        }
                    });
                });
            }
        });
        $(d).bind("gform_post_render", function (event, form_id, current_page) {
            var field_body = $("#gform_page_" + form_id + "_" + current_page + ".gform_page ul.gform_fields");
            var field_negviation = $("#gform_page_" + form_id + "_" + current_page + ".gform_page .gform_page_footer");
            if (form_id == h.form_id) {
                switch (parseInt(current_page)) {
                    case 1:
                        console.log("start init_page_1");
                        break;
                    case 2:
                        formcontroller.field_geo_location(field_body);
                        if (parseInt(form_id) === h.form_type.service_order_internal) {
                            formcontroller.field_member_id(field_body, h.ff_staff_id, h.field_value_staff_id);
                            formcontroller.field_client_company(field_body, h.ff_client_id, h.company_selection_html);
                        }
                        if (parseInt(form_id) === h.form_type.service_order_cr) {
                            formcontroller.field_member_id(field_body, h.ff_cr_id, h.field_value_cr_id);
                        }
                        break;
                    case 3:
                        formcontroller.field_service_order(field_body, field_negviation);
                        break;
                    default :
                        console.log("nothing can be init .. " + current_page);
                        break;
                }
            }
        });

        formcontroller.field_client_company = function (body, field_id, selection_html) {
            var ele = $(field_id),
                eleval = ele.val();
            ele.after(selection_html);
        }

        formcontroller.field_member_id = function (body, field_id, value) {
            var ele = $(field_id);
            ele.val(value);
            ele.prop('readonly', true);
        }

        formcontroller.field_geo_location = function (body) {
            var ele = $(h.ff_geoloc),
                eleval = ele.val();
            geodata.point = {};
            if (eleval == "") {
                h.pre_submit_check_code = 2;
            } else {
                geodata = $.parseJSON(eleval);
            }
            console.log(geodata);
            $(wrapper).trigger("init_gmap");
        }

        formcontroller.support_gmap_drag = function (e) {
            var ele = $(h.ff_geoloc);
            geodata.point = e.latLng;
            ele.val(JSON.stringify(geodata));
            console.log(geodata);
        }

        formcontroller.field_service_order = function (body, negviation) {
            var tmpl = $('#field_service_order').html();
            body.append(tmpl);
            var table_of_service = $("#table_of_service", body),
                placeorder_btn = $(".gform_button, .gform_next_button", negviation),
                prev_step_btn = $(".gform_previous_button", negviation),
                method1_select = $("#method1_select", table_of_service),
                method2_select = $("#method2_select", table_of_service);

            var check_number_item = function (el, elcheck, isOn) {
                if (typeof isOn === 'boolean') {
                    var On = !isOn;
                    if (On) {
                        elcheck.trigger('change').prop('checked', true);
                        el.addClass("success");
                    } else {
                        elcheck.trigger('change').removeAttr('checked');
                        el.removeClass("success");
                    }
                } else {
                    console.log("error boolean expected");
                }
            }
            var field_fill = function () {

                var $check_items = $("label.checkbox.column1 input:checked", table_of_service),
                    sub_items = "";

                $check_items.each(function (i) {
                    var parent = $(this).closest("tr.tcontent"),
                        order_detail_items = $(".column2 input:checked", parent),
                        order_detail_inputs = $(".column2 input:not([type=checkbox]), .column2 select", parent);
                    sub_items += "<p>" + $(this).closest("label.checkbox").text().trim() + ":<br>";
                    order_detail_items.each(function (i) {
                        sub_items += $(this).closest("label.checkbox").text().trim() + " , ";
                    });
                    order_detail_inputs.each(function (i) {
                        var $self = $(this),
                            val = $self.val(),
                            selectedval = $self.find(":selected").html(),
                            text = "";
                        switch ($self.prop("id")) {
                            case "input_3_number":
                                text = val + " Hours for the all Selected Service Option.";
                                break;
                            case "method1_select":
                                text = " Client will pay via " + selectedval + ".";
                                break;
                            case "input_4_number":
                                text = "Expected Survey Area " + val + "sq.m.";
                                break;
                            case "method2_select":
                                text = " Client will pay via " + selectedval + ".";
                                break;
                        }
                        sub_items += text;
                    });
                    sub_items += ". </p>";
                });

                $(h.ff_order_service_detail).val(sub_items);
            }, enable_submit = function () {
                var A = $("label.checkbox.column1 input:checked", table_of_service).size() > 0;
                if (A) {
                    placeorder_btn.removeClass("hide");
                } else
                    placeorder_btn.addClass("hide");
                field_fill();
                console.log("triggered 206");
            }, event_triggered = function (e) {
                e.preventDefault();
                enable_submit();

            }

            //initialize the table of service
            $("td.column1", table_of_service).on("click.togglev tap.togglev", function (e) {
                e.preventDefault();
                var $self = $(this).closest("tr.tcontent"),
                    $checkbox_el = $("label.checkbox.column1 input", $self);
                check_number_item($self, $checkbox_el, $checkbox_el.is(':checked'));
                enable_submit();
            });
          //  $("td.column2", table_of_service).on(interactions, event_triggered);
            $("td.column2 :checkbox", table_of_service).on('change', event_triggered);
            $("td.column2 input[type='number']", table_of_service).on("keyup change", event_triggered);
            $("td.column2 select", table_of_service).on("change", event_triggered);
            enable_submit();
        }
    }(document, ".gform_wrapper", gfsetting, "click tap touch", 1000));
});