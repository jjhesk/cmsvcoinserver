/**
 * Created by ryo on 14年11月21日.
 */

var SliderStep1Config = {};
var SliderStep2Config = {};
var SliderStep3Config = {};
jQuery(function ($) {
    SliderStep1Config = function (checker) {
        this.$container = $("#slider_basic_setup_box");
        this.checker = checker;
        this.$payment = $("#payment", this.$container);
        this.$platform = $("#platform", this.$container);
        this.$time_to_next = $("#time_to_next", this.$container);
        this.init();
    };
    SliderStep1Config.prototype = {
        init: function () {
            var d = this;
            d.$payment.on("change keyup", {that: d, which: "payment"}, d.call_checker);
            d.$platform.on("change", {that: d, which: "platform"}, d.call_checker);
            d.$time_to_next.on("change keyup", {that: d, which: "time"}, d.call_checker);
        },
        call_checker: function (e) {
            var d = e.data.that, check_method = e.data.which;

            switch (check_method) {
                case "payment":
                    d.checker.check_payment();
                    break;
                case "platform":
                    d.checker.check_platform();
                    break;
                case "time":
                    d.checker.check_time();
                    break;
            }
        }
    }

    SliderStep2Config = function (checker, cat_id, countries_id) {
        this.checker = checker;
        this.cat_id = cat_id;
        this.countries_id = countries_id;
        this.init();
    };
    SliderStep2Config.prototype = {
        init: function () {
            var d = this;
            var cat_checkboxes = d.find_checkboxes(d.cat_id),
                countries_checkboxes = d.find_checkboxes(d.countries_id);

            $.each(cat_checkboxes, function (key, val) {
                $(this).on("change", {that: d, which: "cat", checkbox: $(this)}, d.call_checker);
            });

            $.each(countries_checkboxes, function (key, val) {
                $(this).on("click", {that: d, which: "countries", checkbox: $(this)}, d.call_checker);
            });
        },
        find_checkboxes: function (id) {
            var d = this;
            var checkboxes_list = $("#" + id + " li");
            return checkboxes_list.find("[type=checkbox]");
        },
        call_checker: function (e) {
            var d = e.data.that, check_method = e.data.which, checkbox = e.data.checkbox;

            switch (check_method) {
                case "cat":
                    d.checker.check_cat(checkbox);
                    break;
                case "countries":
                    d.checker.check_countries(checkbox);
                    break;
            }
        }
    }

    SliderStep3Config = function (checker) {
        this.$container = $("#slid_list_box");
        this.checker = checker;
        this.init();
    };
    SliderStep3Config.prototype = {
        init: function () {
            var d = this;
            var $image_field = $(".rwmb-field", d.$container);

            $.each($image_field, function (key, val) {
                var $delete_file = $("a.rwmb-delete-file", $(this));

                $.each($delete_file, function (key, val) {
                    $(this).on("click", {that: d, $image_field: $image_field}, d.call_checker);
                });

                $(this).on("update.rwmbFile", {that: d, $image_field: $image_field}, d.call_checker);
            });
        },
        call_checker: function (e) {
            var d = e.data.that, $field = e.data.$image_field;
            d.checker.check_image_content($field);
        }
    }
});