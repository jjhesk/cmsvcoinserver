/**
 * Created by ryo on 14年12月9日.
 */

var EditAddress = {};
jQuery(function ($) {
    (function (doc, interactions, M) {
        EditAddress = function () {
            this.$container = $("#datainput");
            this.$listtable = $("#admin_vendor_address_table");
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
            this.domain_api = window.location.origin + "/api/";
            this.$add_entry = $("#add_entry", this.$container);
            this.$update_entry = $("#update_entry", this.$container);
            this.$cancel_update = $("#cancel_update", this.$container);
            this.$address_id = $("#address_id", this.$container);
            this.editAddressTemplate = Handlebars.compile($("#edit_address_template").html());
            this.tableInit();
        };
        EditAddress.prototype = {
            tableInit: function () {
                var d = this;

                d.$listtable.dataTable({
                    processing: true,
                    serverSide: false,
                    order: [ 1, 'desc' ],
                    ajax: d.domain_api + "vendor/list_vendor_address",
                    columns: [
                        {
                            class: "details_editor",
                            orderable: false,
                            render: function (data, type, full, meta) {
                                return d.editAddressTemplate(full);
                            }
                        },
                        { data: "ID" },
                        { data: "short_zh" },
                        { data: "zh" },
                        { data: "short_ja" },
                        { data: "ja" },
                        { data: "short_en" },
                        { data: "en" },
                        { data: "date" }
                    ],
                    initComplete: function (settings, json) {
                        d.$listtable.css({
                            'text-align': 'center',
                            'font-size': '14px'
                        });

                        d.$add_entry.on(interactions, {that: d, which: "insert"}, d.insert_edit_address);
                        d.$update_entry.on(interactions, {that: d, which: "update"}, d.insert_edit_address);
                        d.$cancel_update.on(interactions, {that: d}, function (e) {
                            var d = e.data.that;
                            d.clear_input();
                            $(this).addClass("hidden");
                            d.$update_entry.addClass("hidden");
                            d.$add_entry.removeClass("hidden");
                            $("#admin_vendor_address_table_wrapper").removeClass("hidden");
                        });
                    },
                    fnDrawCallback: function () {
                        var $edit_address_btn = $(".edit_address");
                        $.each($edit_address_btn, function () {
                            $(this).off(interactions);
                            $(this).on(interactions, function () {
                                var tr = $(this).closest('tr'),
                                    row = d.$listtable.dataTable().api().row(tr), data = row.data();
                                d.$address_id.val(data.ID);
                                d.$zh_short.val(data.short_zh);
                                d.$ja_short.val(data.short_ja);
                                d.$en_short.val(data.short_en);
                                d.$zh_full.val(data.zh);
                                d.$ja_full.val(data.ja);
                                d.$en_full.val(data.en);
                                d.$sms_no.val(data.terminal);
                                d.$contact_no.val(data.contact_number);
                                d.$email.val(data.email);
                                d.$business_hr.val(data.business_hour);
                                d.$country.val(data.country);

                                d.$add_entry.addClass("hidden");
                                d.$update_entry.removeClass("hidden");
                                d.$cancel_update.removeClass("hidden");

                                $("#admin_vendor_address_table_wrapper").addClass("hidden");
                            });
                        });
                    }
                });
            },
            insert_edit_address: function (e) {
                var d = e.data.that;
                var which = e.data.which;

                if (which == "insert") {
                    var api_controller = "insert_address";
                    var $btn = d.$add_entry;
                }
                else {
                    var api_controller = "edit_address";
                    var $btn = d.$update_entry;
                }

                $(this).off(interactions);
                M.InputControlSingle($(this), true);

                var loader = new AJAXLoader($(this), "normal", "app_reg");
                var enter = new JAXAPIsupport(d.domain_api + "vendor/" + api_controller + "/", {
                    id: d.$address_id.val(),
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
                    $btn.on(interactions, {that: that, which: which}, that.insert_edit_address);
                    M.InputControlSingle($btn, false);
                    that.$listtable.fnReloadAjax(that.domain_api + "vendor/list_vendor_address");
                    that.clear_input();

                    if (which == "update") {
                        $("#admin_vendor_address_table_wrapper").removeClass("hidden");
                        that.$add_entry.removeClass("hidden");
                        that.$update_entry.addClass("hidden");
                        that.$cancel_update.addClass("hidden");
                    }
                }, function (that, msg) {
                    $btn.on(interactions, {that: that, which: which}, that.insert_edit_address);
                    M.InputControlSingle($btn, false);
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