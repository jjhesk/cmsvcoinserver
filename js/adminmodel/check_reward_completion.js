/**
 * Created by ryo on 14年11月11日.
 */

var CheckCompletion = {};
jQuery(function ($) {
    CheckCompletion = function () {
        this.address_status = false;
        this.stock_type_status = false;
        this.$container = $("#post_sc_meta");
        this.$stock_configuration_complete = $("#stock_configuration_complete", this.$container);
    };
    CheckCompletion.prototype = {
        check_address: function () {
            var d = this;
            d.address_status = $("#assign_location_ids", d.$container).val() != "";
            d.check_all_complete();
        },
        check_stock_type: function () {
            var d = this;
            d.stock_type_status = $("option:selected", $("#stock_system_type")).val() != "na";
            d.check_all_complete();
        },
        check_extension: function () {
            var d = this;
            var $extension = $("#ext_v2");
            if ($extension.val() == "[]") $extension.val("na");
            d.check_all_complete();
        },
        check_all_complete: function () {
            var d = this;
            if (d.address_status && d.stock_type_status) {
                d.$stock_configuration_complete.val(1);
                d.$container.trigger("check_validation", [true]);
            }
            else {
                d.$stock_configuration_complete.val(0);
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
        }
    }
});