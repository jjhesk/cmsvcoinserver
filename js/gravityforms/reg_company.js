/**
 * Created by hesk on 5/23/14.
 *
 *   "head" => $head,
 "nc_comfullname" => $head . nc_comfullname,
 "nc_conshortname" => $head . nc_conshortname,
 "nc_contactemail" => $head . nc_contactemail,
 "nc_contactfax" => $head . nc_contactfax,
 "nc_contactnumber" => $head . nc_contactnumber,
 "nc_contactname" => $head . nc_contactname,

 "nc_cr_reg_info_json" => $head . nc_cr_reg_info_json,


 "nc_brfile" => $head . nc_brfile,
 "nc_brissuedate" => $head .  nc_brissuedate,
 "nc_brnumber" => $head . nc_brnumber,



 */


var gfsetting = gfsetting || {};
var formcontroller = formcontroller || {};
console.log(gfsetting);
jQuery(function ($) {
    (function (d, wrapper, h, interactions, t) {
        formcontroller.field_registration_cr = function (body, field_negviation) {
            var tmpl = $('#missing_part_cr_entry').html();
            body.append(tmpl);
            var create_btn = $("#create_new_cr", body);
            create_btn.off(interactions).on(interactions, function (e) {
                var last_cr = $(".cr_input", body),
                    has = last_cr.size() > 0;
                if (has) {
                    //does the checking of the last one in here
                    var the_last = last_cr.first();
                    var controller = the_last.data("crInputController");
                    controller.$container.trigger("check");
                    if (controller.input_field_check_success) {
                        formcontroller.add_new_cr(body);
                    }
                } else {
                    formcontroller.add_new_cr(body);
                }
            });
            var submit = $("#gform_submit_button_" + h.form_id, field_negviation);
            submit.hide();

        }
        formcontroller.add_new_cr = function (body) {
            var tmpl = $('#template_cr_row').html(),
                ul = $("#new_cr_registration", body);
            ul.prepend(tmpl);
            var new_row = $(".cr_input.datastack.row", body).first(),
                controller = new field_cr(new_row);
            controller.init();
            new_row.data("crInputController", controller);
        }
        formcontroller.prepare_field = function () {
            var field = $(h.nc_cr_reg_info_json, wrapper),
                crs = $(".cr_input.datastack.row", wrapper),
                fieldvalo = [], x = true,
                submit = $("#gform_submit_button_" + h.form_id);
            $.each(crs, function (i) {
                var control = $(this).data("crInputController");
                if (control.input_field_check_success) {
                    fieldvalo.push(control.getObject());

                } else x = false;
            });
            if (x) {
                var dc = JSON.stringify(fieldvalo);
                console.log(dc)
                field.val(new String(dc));
                submit.show()
            } else {
                field.val("");
            }
        }
        $(d).bind("gform_post_render", function (event, form_id, current_page) {
            var field_body = $("#gform_page_" + form_id + "_" + current_page + ".gform_page ul.gform_fields"),
                field_negviation = $("#gform_page_" + form_id + "_" + current_page + ".gform_page .gform_page_footer");
            if (form_id == h.form_id) {
                switch (parseInt(current_page)) {
                    case 1:
                        console.log("start init_page_1");
                        break;
                    case 4:
                        formcontroller.field_registration_cr(field_body, field_negviation);
                        break;
                    case 3:
                        console.log("start BR section");
                        break;
                    default :
                        console.log("nothing can be init .. " + current_page);
                        break;
                }
            }
        });

        'use strict';
        var field_cr = function ($rowField) {
            this.$container = $rowField;
            this.$name = $(".input_cr_name input", $rowField);
            this.$phone = $(".input_cr_phone input", $rowField);
            this.$email = $(".input_cr_email input", $rowField);
            this.$notification = $(".notification", $rowField);
            this.$removeBut = $(".destroybut", $rowField);
            this.check_field_url = "http://onecallapp.imusictech.net/api/crapi/form_cr_check/";
            this.input_field_check_success = false;
        }
        field_cr.prototype = {
            init: function () {
                var that = this;
                this.$container.bind("check", {dat: that}, that.check);
                this.$name.on('blur', function () {
                    that.$container.trigger("check");
                });
                this.$email.on('blur', function () {
                    that.$container.trigger("check");
                });
                this.$removeBut.off(interactions).on(interactions, {dat: that}, function (e) {
                    var that = e.data.dat;
                    that.$container.fadeOut("slow", function () {
                        that.$container.remove();
                    });
                });
            },
            loadui: function (bool) {

            },
            jax: function (data, callback) {
                var that = this;
                that.loadui(true);
                $.post(that.check_field_url, data, function (response) {
                    that.input_field_check_success = response.result == 'success';
                    if (!that.input_field_check_success) {
                        that.$notification.addClass("warning");
                        that.$notification.html(response.message);
                    } else {
                        that.$notification.removeClass("warning");
                        that.$notification.html("");
                    }
                    //  console.log("check done");
                    //  console.log(response);
                    formcontroller.prepare_field();
                    that.loadui(false);
                });
            },
            check: function (e) {
                e.preventDefault();
                var that = e.data.dat,
                    emptypass = that.$name.val() == "" || that.$phone.val() == "" || that.$email.val() == "";
                console.log(emptypass);
                if (emptypass) {
                    that.input_field_check_success = false;
                    return false;
                }
                that.jax({
                    email: that.$name.val(),
                    username: that.$email.val()
                });
            },
            getObject: function () {
                var that = this;
                return {
                    name: that.$name.val(),
                    email: that.$email.val(),
                    phone: that.$phone.val()
                }
            }
        }

    }(document, ".gform_wrapper", gfsetting, "click tap touch", 1000));
});