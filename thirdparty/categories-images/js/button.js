/**
 * Created by Hesk on 14年9月24日.
 */
var wordpress_ver = wordpress_ver || {};
var imager = imager = {};
var page_cate_image_holder = page_cate_image_holder || {};
jQuery(document).ready(function ($) {
    imager = function (uploadbutton, remove_button, field_attachment) {
        this.$upload_button = uploadbutton;
        this.$field_attachment = field_attachment;
        this.$removebutton = remove_button;
        this.Z_IMAGE_PLACEHOLDER = "";
        // this.$editinline = editinline;
        this.init_buttons();
    }
    imager.prototype = {
        init_buttons: function () {
            var d = this;
            d.$upload_button.on("click", function (event) {
                var frame;
                //    if (wordpress_ver >= "3.5") {
                event.preventDefault();
                if (frame) {
                    frame.open();
                    return;
                }
                frame = window.wp.media();
                frame.on("select", function () {
                    // Grab the selected attachment.
                    var attachment = frame.state().get("selection").first();
                    frame.close();
                    if (d.$upload_button.parent().prev().children().hasClass("tax_list")) {
                        d.$upload_button.parent().prev().children().val(attachment.attributes.url);
                        d.$upload_button.parent().prev().prev().children().attr("src", attachment.attributes.url);
                    }
                    else
                        d.$field_attachment.val(attachment.attributes.url);
                });
                frame.open();
                /*  } else {
                 tb_show("", "media-upload.php?type=image&amp;TB_iframe=true");
                 return false;
                 }*/
            });
            d.$removebutton.on("click", function (event) {
                d.$field_attachment.val("");
                $(this).parent().siblings(".title").children("img").attr("src", d.Z_IMAGE_PLACEHOLDER);
                $(".inline-edit-col :input[name=\'taxonomy_image\']").val("");
                return false;
            });
        }
    }
    var editor_single = function () {
        var $single_box = $(".image_input_editor");
        $.each($single_box, function (i, item) {
            var upload = $(".z_upload_image_button", item), remove = $(".z_remove_image_button", item), edit_image = $(".input_field", item);
            new imager(upload, remove, edit_image);
        });
    }
    var editor_taxonomy_list = function () {
        var $single_box = $(".blockholder");
        $.each($single_box, function (i, item) {
            var upload = $(".z_upload_image_button", item), remove = $(".z_remove_image_button", item), edit_image = $(".input_field", item);
            new imager(upload, remove, edit_image);
        });
    }
    if (page_cate_image_holder == "list") {
        editor_taxonomy_list();
    } else if (page_cate_image_holder == "single") {
        editor_single();
    }
});