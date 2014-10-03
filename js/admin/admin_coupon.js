/**
 * Created by ryo on 14年8月29日.
 */

jQuery(function ($) {
    (function (d, c, duration) {
        var screen_option = new WPScreenOptionSupport(),
            status_support = new PublishingSupport(),
            postbox_handler = new PostBoxWatch();


        var coupon_config_status = parseInt($("#coupon_configuration_complete").val());
        if (coupon_config_status != 1) {
            $("#coupon_configuration_complete").val(0);

            screen_option.OFF("coupon_redemption_analysis");
        }
        else {
            screen_option.ON("coupon_redemption_analysis");

            var coupon_analysis = new CouponAnalysis("coupon_redemption_analysis", 1, 2, 3);
        }

    }(document, 'gform_wrapper', 1000));
});