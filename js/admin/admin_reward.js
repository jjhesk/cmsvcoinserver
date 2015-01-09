/**
 * Created by Hesk on 14年8月12日.
 */
/**
 * Created by hesk on 2/22/14.
 */
var product_extension = {
    option: [
        {
            en: "color",
            cn: "XX",
            ja: "XX"
        },
        {
            en: "size",
            cn: "XX",
            ja: "XX"
        },
        {
            en: "network",
            cn: "網絡類型",
            ja: "XX"
        },
        {
            en: "version",
            cn: "版本",
            ja: "XX"
        },
        {
            en: "body color",
            cn: "機身顏色",
            ja: "XX"
        },
        {
            en: "deal type",
            cn: "套餐類型",
            ja: "XX"
        },
        {
            en: "battery capacity",
            cn: "電池容量",
            ja: "XX"
        },
        {
            en: "service package",
            cn: "服務承諾",
            ja: "XX"
        },
        {
            en: "memory size",
            cn: "機身內存",
            ja: "XX"
        }
    ],
    extension_output: [
        {
            ID: "0M",
            label: "red|M"
        },
        {
            ID: "1M",
            label: "blue|M"
        },
        {
            ID: "0H",
            label: "red|L"
        },
        {
            ID: "0H",
            label: "red|L"
        }
    ],
    extension_structure: [
        {
            labels: [
                {
                    ext_id: "0",
                    name_: "red"
                },
                {
                    ext_id: "1",
                    name: "blue"
                }
            ],
            attribute_en: "Color",
            attribute_cn: "顏色分類",
            attribute_ja: "カラー"
        },
        {
            labels: [
                {
                    ext_id: "M",
                    name: "M"
                },
                {
                    ext_id: "H",
                    name: "L"
                }
            ],
            attribute_en: "Size",
            attribute_cn: "顏色分類",
            attribute_ja: "カラー"
        }
    ]
}


/**
 * save in the hidden field includes:
 * {
 *    extension_output
 *    extension_structure
 * }
 */
var json_vendor_list = new Object();
var setting_ob = setting_ob || {};
jQuery(function ($) {
    (function (d, M, duration) {
        var checker = new CheckCompletion();
        var screen_option = new WPScreenOptionSupport(),
            status_support = new PublishingSupport(),
            postbox_handler = new PostBoxWatch(),
            stock_config = new StockConfigure("post_sc_meta", checker);
        var stock_config_status = parseInt($("#stock_configuration_complete").val());
        var $extension = $("#ext_v2");
        var $extension_obj = $extension.val();
        var $icl_table = $("#icl_translate_options"), $icl_header = $("table tbody tr th:nth-child(2)", $icl_table),
            $icl_content = $("table tbody tr td:nth-child(2)", $icl_table);

        /*$icl_header.addClass("hidden");
         $.each($icl_content, function () {
         $(this).addClass("hidden");
         });*/

        $extension.addClass("hidden");

        if (stock_config_status == 2) {
            var stock_count = new StockCountAdmin("stock_count", $("#stock_id").val());
            screen_option.ON("stock_count");
            $(".rwmb-button.button.remove-clone").remove();
            $(".rwmb-button.button-primary.add-clone").remove();
            M.InputControlSingle($("#inn_gift_offer_location"), true);
            M.InputControlSingle($("#innvendorid"), true);
            M.InputControlSingle($("#stock_system_type"), true);
            M.InputControlSingle($(".rwmb-text"), true);
            M.InputControlSingle($("#gift_video_url"), false);

            if (setting_ob.role == "store_staff") {
                $("#show-settings-link").hide();
                $("#screen-options-link-wrap").hide();
                screen_option.ALL(false);
                screen_option.ON("stock_count");
                $("#submitdiv").hide();
                $("#edit-slug-box").hide();
                $(".add-new-h2").hide();
            }

            //screen_option.OFF("post_sc_meta");
            screen_option.OFF("icl_div_config");

            if ($extension_obj != "na") new StockTagging($extension, $extension_obj, false);
            else $extension.parent().parent().addClass("hidden");

        } else if (stock_config_status == 0) {
            $extension.val("na");
            status_support.publishEnable(false);
            checker.setTriggerOnCheck(function (e, b) {
                if ($("#stock_configuration_complete").val() == "1")
                    status_support.publishEnable(true);
                else status_support.publishEnable(false);
            });
            screen_option.OFF("stock_count");
            new StockExtensionBox({extension_config: product_extension, checker: checker});
        }
    }(document, MetaBoxSupport, 1000));
});