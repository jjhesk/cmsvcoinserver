/**
 * Created by ryo on 14年11月10日.
 */

var StockTagging = {};
jQuery(function ($) {
    StockTagging = function (next_element, extension_obj, clickable) {
        this.$next_element = next_element;
        this.$extension_obj = extension_obj;
        this.clickable = clickable;
        this.init();
    };
    StockTagging.prototype = {
        init: function () {
            var d = this;
            var $tag_holder = $('<div class="features_group"></div>'), html = '<table class="features_table form-table">';
            var $view_features = $('<div><input type="button" class="button" value="Hide Features"></div>');
            var features_collection = $.parseJSON(d.$extension_obj);

            if (d.clickable) var click_class = " features";
            else var click_class = "";
            $.each(features_collection, function (key_1, feature) {
                html += '<tr><td>' + feature.label_new_name + '</td><td>';
                $.each(feature.tags, function (key_2, tag) {
                    html += '<div class="tag' + click_class + '">' +
                        '<span>#</span>' + tag +
                        '<input type="hidden" name="taggone[]" value="' + tag + '">' +
                        '</div>';
                });
                html += '</td></tr>';
            });
            html += '</table>';
            $tag_holder.html(html);
            d.$next_element.before($tag_holder);
            $tag_holder.before($view_features);
            $("input", $view_features).on("click", {that: d}, d.toggle_view);
        },
        toggle_view: function (e) {
            var d = e.data.that;
            var $features_table = $(this).parent().next();
            if ($features_table.hasClass("hidden")) {
                $features_table.removeClass("hidden");
                $("input", $(this)).val("Hide Features");
            }
            else {
                $features_table.addClass("hidden");
                $("input", $(this)).val("Show Features");
            }
        }
    }
});