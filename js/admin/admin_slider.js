/**
 * Created by ryo on 14年11月21日.
 */

var setting_ob = setting_ob || {};
jQuery(function ($) {
    "use strict";
    (function (d, interaction) {
        var screen_option = new WPScreenOptionSupport(),
            status_support = new PublishingSupport(),
            metabox_support = MetaBoxSupport;
        var checker = new SliderCheckCompletion();

        var $slider_setup = $("#slider_setup_status");
        var setup_status = parseInt($slider_setup.val());

        if (setup_status == 0) {
            status_support.PubLabel("Next");
            status_support.setTitle("Proceed to next step");
            status_support.hideContent();
            screen_option.ALL(false);
            screen_option.ON("slider_basic_setup_box");

            new SliderStep1Config(checker);

            status_support.publishEnable(false);
            checker.setTriggerOnCheck(function (e, b) {
                if ($("#slider_setup_status").val() == "1")
                    status_support.publishEnable(true);
                else status_support.publishEnable(false);
            });
        }
        else if (setup_status == 2) {
            status_support.PubLabel("NEXT");
            status_support.setTitle("Proceed to next step");
            status_support.hideContent();
            metabox_support.InputControlSingle($("#payment"), true);
            metabox_support.InputControlSingle($("#platform"), true);
            metabox_support.InputControlSingle($("#time_to_next"), true);
            screen_option.ALL(false);
            screen_option.ON("slider_basic_setup_box");
            metabox_control();
            var cat_id = "", countries_id = "";
            switch ($("option:selected", $("#platform", $("#slider_basic_setup_box"))).val()) {
                case "ios":
                    cat_id = "taxonomy-appcate";
                    countries_id = "taxonomy-countryios_nd";
                    break;
                case "android":
                    cat_id = "taxonomy-appandroid";
                    countries_id = "taxonomy-countryandroid";
                    break;
                case "rewards":
                    cat_id = "taxonomy-category";
                    countries_id = "taxonomy-country";
                    break;
                case "coupons":
                    cat_id = "taxonomy-category";
                    countries_id = "taxonomy-country";
                    break;
            }

            new SliderStep2Config(checker, cat_id, countries_id);

            status_support.publishEnable(false);
            checker.setTriggerOnCheck(function (e, b) {
                if ($("#slider_setup_status").val() == "3")
                    status_support.publishEnable(true);
                else status_support.publishEnable(false);
            });

        }
        else if (setup_status == 4) {
            screen_option.ALL(false);
            screen_option.ON("slid_list_box");
            screen_option.ON("slider_basic_setup_box");
            metabox_control();
            status_support.PubLabel("Publish");
            metabox_support.InputControlSingle($("#payment"), true);
            metabox_support.InputControlSingle($("#platform"), true);
            metabox_support.InputControlSingle($("#time_to_next"), true);

            new SliderStep3Config(checker);

            status_support.publishEnable(false);
            checker.setTriggerOnCheck(function (e, b) {
                if ($("#slider_setup_status").val() == "5")
                    status_support.publishEnable(true);
                else status_support.publishEnable(false);
            });
        }
        else if (setup_status == 6) {
            screen_option.ALL(false);
            screen_option.ON("slid_list_box");
            screen_option.ON("slider_basic_setup_box");
            metabox_control();
            metabox_support.InputControlSingle($("#payment"), true);
            metabox_support.InputControlSingle($("#platform"), true);
            metabox_support.InputControlSingle($("#time_to_next"), true);
        }
        //status_support.PubLabel();

        function metabox_control() {
            switch ($("option:selected", $("#platform", $("#slider_basic_setup_box"))).val()) {
                case "ios":
                    screen_option.ON("countryios_nddiv");
                    screen_option.ON("appcatediv");
                    screen_option.ON("slider_basic_setup_box");
                    break;
                case "android":
                    screen_option.ON("countryandroiddiv");
                    screen_option.ON("appandroiddiv");
                    screen_option.ON("slider_basic_setup_box");
                    break;
                case "rewards":
                    screen_option.ON("categorydiv");
                    screen_option.ON("countrydiv");
                    screen_option.ON("slider_basic_setup_box");
                    break;
                case "coupons":
                    screen_option.ON("categorydiv");
                    screen_option.ON("countrydiv");
                    screen_option.ON("slider_basic_setup_box");
                    break;
            }
        }
    }(document, "click tap touch"));
});