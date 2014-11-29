/**
 * Created by ryo on 14年11月25日.
 */

jQuery(function ($) {

    $.each($(".hidden_field_switcher"), function (h) {
        new Switcher($(this));
    });
});