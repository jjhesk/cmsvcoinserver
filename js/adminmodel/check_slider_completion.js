/**
 * Created by ryo on 14年11月21日.
 */

var SliderCheckCompletion = {};
jQuery(function ($) {
    SliderCheckCompletion = function () {
        this.payment_status = false;
        this.platform_status = false;
        this.time_status = false;
        this.cat_status = false;
        this.countries_status = false;
        this.count_cat = 0;
        this.count_countries = 0;
        this.image_status = false;
        this.$container = $("#slider_basic_setup_box");
        this.$slider_configuration_complete = $("#slider_setup_status", this.$container);
    };
    SliderCheckCompletion.prototype = {
        check_payment: function () {
            var d = this;
            d.payment_status = Number($("#payment", d.$container).val()) > 0;
            d.check_step1_complete();
        },
        check_platform: function () {
            var d = this;
            d.platform_status = $("option:selected", $("#platform", d.$container)).val() != "na";
            d.check_step1_complete();
        },
        check_time: function () {
            var d = this;
            d.time_status = Number($("#time_to_next", d.$container).val()) > 0;
            d.check_step1_complete();
        },
        check_step1_complete: function () {
            var d = this;
            if (d.payment_status && d.platform_status && d.time_status) {
                d.$slider_configuration_complete.val(1);
                d.$container.trigger("check_validation", [true]);
            }
            else {
                d.$slider_configuration_complete.val(0);
                d.$container.trigger("check_validation", [false]);
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
        },
        check_cat: function (checkbox) {
            var d = this;

            if (checkbox.is(':checked')) {
                d.count_cat++;
            }
            else d.count_cat--;

            d.cat_status = d.count_cat > 0;
            d.check_step2_complete();
        },
        check_countries: function (checkbox) {
            var d = this;

            if (checkbox.is(':checked')) {
                d.count_countries++;
            }
            else d.count_countries--;

            d.countries_status = d.count_countries > 0;
            d.check_step2_complete();
        },
        check_step2_complete: function () {
            var d = this;

            if (d.cat_status && d.countries_status) {
                d.$slider_configuration_complete.val(3);
                d.$container.trigger("check_validation", [true]);
            }
            else {
                d.$slider_configuration_complete.val(2);
                d.$container.trigger("check_validation", [false]);
            }
        },
        check_image_content: function ($image_field) {
            var d = this;
            d.image_status = true;
            $.each($image_field, function (key, val) {
                var $ul = $("ul", $(this)), $image = $("img", $ul);
                if ($image.size() == 0)
                    d.image_status = false;
            });
            d.check_step3_complete();
        },
        check_step3_complete: function () {
            var d = this;

            if (d.image_status) {
                d.$slider_configuration_complete.val(5);
                d.$container.trigger("check_validation", [true]);
            }
            else {
                d.$slider_configuration_complete.val(4);
                d.$container.trigger("check_validation", [false]);
            }
        }
    }
});