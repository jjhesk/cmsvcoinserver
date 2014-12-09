/**
 * Created by ryo on 14年12月9日.
 */

var EditAddress = {};
jQuery(function ($) {
    (function (doc, interactions, M) {
        EditAddress = function (component, domain_api, $address_table) {
            this.$container = $("#" + component);
            this.$zh_short = $("#zh_short", this.$container);
            this.$ja_short = $("#ja_short", this.$container);
            this.$en_short = $("#en_short", this.$container);
            this.$zh_full = $("#zh_full", this.$container);
            this.$ja_full = $("#ja_full", this.$container);
            this.$en_full = $("#en_full", this.$container);
            this.$sms_no = $("#sms_no", this.$container);
            this.$contact_no = $("#contact_no", this.$container);
            this.$email = $("#email", this.$container);
            this.$business_hr = $("#business_hr", this.$container);
            this.$country = $("#country", this.$container);
            this.domain_api = domain_api;
            this.$address_table = $address_table;
            this.$add_entry = $("#add_entry", this.$container);
            this.init();
        };
        EditAddress.prototype = {
            init: function () {
                var d = this;

                d.$add_entry.on(interactions, {that: d}, d.insert_address);
            },
            insert_address: function (e) {
                var d = e.data.that;

                $(this).off(interactions);
                M.InputControlSingle($(this), true);

                var loader = new AJAXLoader($(this), "normal", "app_reg");
                var enter = new JAXAPIsupport(d.domain_api + "vendor/insert_address/", {
                    zh_short: d.$zh_short.val(),
                    ja_short: d.$ja_short.val(),
                    en_short: d.$en_short.val(),
                    zh: d.$zh_full.val(),
                    ja: d.$ja_full.val(),
                    en: d.$en_full.val(),
                    sms_no: parseInt(d.$sms_no.val()),
                    contact_no: parseInt(d.$contact_no.val()),
                    email: d.$email.val(),
                    business_hr: d.$business_hr.val(),
                    country: $("option:selected", d.$country).val()
                }, d, function (that, json) {
                    that.$add_entry.on(interactions, {that: that}, that.insert_address);
                    M.InputControlSingle(that.$add_entry, false);
                    that.$address_table.fnReloadAjax(that.domain_api + "vendor/list_vendor_address");
                    that.clear_input();
                }, function (that, msg) {
                    that.$add_entry.on(interactions, {that: that}, that.insert_address);
                    M.InputControlSingle(that.$add_entry, false);
                });
                enter.add_loader(loader);
                enter.init();
            },

            clear_input: function () {
                var d = this;
                var $inputs = $("input", d.$container);
                $.each($inputs, function () {
                    $(this).val("");
                });
                d.$country.val("na");
            }
        }
    }(document, "click tap touch", MetaBoxSupport));
});