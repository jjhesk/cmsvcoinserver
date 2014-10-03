/**
 * Created by Hesk on 14年8月12日.
 */
/**
 * Created by hesk on 2/22/14.
 */
var json_vendor_list = new Object();
jQuery(function ($) {
    (function (d, c, duration) {
        var screen_option = new WPScreenOptionSupport(),
            status_support = new PublishingSupport(),
            postbox_handler = new PostBoxWatch(),
            stock_config = new StockConfigure("post_sc_meta");

        var stock_config_status = parseInt($("#stock_configuration_complete").val());

        if (stock_config_status == 2) {
            var stock_count = new StockCountAdmin("stock_count", $("#stock_id").val());

            screen_option.ON("stock_count");
            $(".rwmb-button.button.remove-clone").remove();
            $(".rwmb-button.button-primary.add-clone").remove();
            MetaBoxSupport.InputControlSingle($("#inn_gift_offer_location"), true);
            MetaBoxSupport.InputControlSingle($("#innvendorid"), true);
            MetaBoxSupport.InputControlSingle($("#stock_system_type"), true);
            MetaBoxSupport.InputControlSingle($(".rwmb-text"), true);

        }
        else if (stock_config_status == 0) {

            stock_config.setTriggerOnCheck(function (e, b) {
                if(stock_config.status_1 && stock_config.status_2 && stock_config.status_3 && stock_config.status_4)
                    status_support.publishEnable(true);
                else status_support.publishEnable(false);
            });

            status_support.publishEnable(false);
            screen_option.OFF("stock_count");
        }

        //console.log("trigger change rwmb-select-wrapper");
    }(document, 'gform_wrapper', 1000));
});