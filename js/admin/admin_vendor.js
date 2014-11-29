/**
 * Created by ryo on 14年8月18日.
 */
/**
 * Created by Hesk on 14年8月12日.
 */
/**
 * Created by hesk on 2/22/14.
 */

var RedemptionCenters = RedemptionCenters || {};
jQuery(function ($) {
    RedemptionCenters = function (component_name) {
        this.$container = $("#" + component_name);
        var $container = this.$container;
        this.$redemption_centers_location = $(".rwmb-select", $container);
        this.is_clone = false;
        this.domain = window.location.origin + "/api/";

        this.Init();
        //console.log($("option:selected", this.$inn_gift_offer_location).val());

    };
    RedemptionCenters.prototype = {
        Init: function () {
            var d = this;
            d.display_terminal_box();
            d.$container.on("clone", {that: d}, d.display_terminal_box_onclone);
        },
        attach_onchange_to_redemption_center: function ($selector) {
            var d = this;
            $selector.on("change", {that: d, k: $selector}, this.change_location_terminal);
        },

        change_location_terminal: function (e) {
            var d = e.data.that, $selector = e.data.k;

            if ($selector.attr('id') == "location_ids")
                var $terminal_holder = $("#terminal_0", d.$container);

            else {
                var which = $selector.attr('id').slice(-1);
                var $terminal_holder = $("#terminal_" + which, d.$container);
            }

            if (parseInt($("option:selected", $selector).val()) != -1) {
                d.get_terminal_no($terminal_holder, parseInt($selector.val()));
            }
            else $terminal_holder.val("Terminal: ");
        },
        display_terminal_box: function () {
            var d = this, redemption_list = d.$redemption_centers_location.closest(".rwmb-input"),
                items = $(".rwmb-clone", redemption_list), length = items.size(), k = 0;

            if (!d.is_clone) {
                $.each(items, function (i) {
                    var $this = $(this);
                    if (k == 0)
                        var $input = $("#location_ids", $this);
                    else
                        var $input = $("#location_ids_" + k, $this);

                    var $holder = $("<input type='text' class='location_details' disabled name='terminal[" + k + "]' " +
                        "id='terminal_" + k + "'>").insertAfter($input);

                    d.get_terminal_no($holder, parseInt($input.val()));
                    d.attach_onchange_to_redemption_center($input);
                    k++;
                })
                d.is_clone = true;
            }
            else {
                var last_one = $(".location_details", items.last());
                var new_terminal_no = parseInt(last_one.attr("id").slice(-1)) + 1;
                var $input = $("#location_ids_" + new_terminal_no, items);
                var $holder = $("<input type='text' class='location_details' disabled name='terminal[" + new_terminal_no + "]' " +
                    "id='terminal_" + new_terminal_no + "'>").insertAfter($input);

                last_one.remove();
                d.get_terminal_no($holder, parseInt($input.val()));
                d.attach_onchange_to_redemption_center($input);
            }

        },
        display_terminal_box_onclone: function (e) {
            var d = e.data.that;
            d.display_terminal_box();
        },
        get_terminal_no: function ($text_input, selected_value) {
            var d = this;
            console.log(d.domain + "vendor/get_terminal_num/");
            var loader = new AJAXLoader($text_input, "normal", "app_reg");
            var enter = new JAXAPIsupport(d.domain + "vendor/get_terminal_num/", {
                id: selected_value
            }, $text_input, function ($input, json) {
                $input.val(
                    "Terminal: " + json.terminal
                    //+ " " + json.country + " " + json.contact_number
                );
            });
            enter.add_loader(loader);
            enter.init();
        }
    }
});

//$clone.insertAfter( $clone_last );


//var json_vendor_list = new Object();
jQuery(function ($) {
    (function (d, c, duration) {
        var screen_option = new WPScreenOptionSupport(),
            status_support = new PublishingSupport(),
            postbox_handler = new PostBoxWatch(),
            redemption_centers = new RedemptionCenters("post_vendor_meta");


    }(document, 'gform_wrapper', 1000));
});