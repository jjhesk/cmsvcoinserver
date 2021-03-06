<?php
/**
 * Plugin Name: Categories Images
 * Plugin URI: http://zahlan.net/blog/2012/06/categories-images/
 * Description: Categories Images Plugin allow you to add an image to category or any custom term.
 * Author: Muhammad Said El Zahlan, Hesk Kam
 * Version: 2.5.1
 * Author URI: http://zahlan.net/, http://hkmlab.wordpress.com
 */
?>
<?php
if (!defined('Z_PLUGIN_URL'))
    define('Z_PLUGIN_URL', untrailingslashit(plugins_url('', __FILE__)));

define('Z_IMAGE_PLACEHOLDER', Z_PLUGIN_URL . "/images/placeholder.png");
define('Z_JS', Z_PLUGIN_URL . "/js/button.js");
// l10n
load_plugin_textdomain('zci', FALSE, 'categories-images/languages');
add_action('admin_init', 'z_init');
add_action('admin_enqueue_scripts', 'cate_image_script_register');
function cate_image_script_register()
{
    wp_register_script('cat_button', Z_JS, array(), '1.5', false);
}

function z_init()
{
    $z_taxonomies = get_taxonomies();
    if (is_array($z_taxonomies)) {
        $zci_options = get_option('zci_options');
        if (empty($zci_options['excluded_taxonomies']))
            $zci_options['excluded_taxonomies'] = array();

        foreach ($z_taxonomies as $z_taxonomy) {
            if (in_array($z_taxonomy, $zci_options['excluded_taxonomies']))
                continue;
            add_action($z_taxonomy . '_add_form_fields', 'z_add_texonomy_field');
            add_action($z_taxonomy . '_edit_form_fields', 'z_edit_texonomy_field');
            add_filter('manage_edit-' . $z_taxonomy . '_columns', 'z_taxonomy_columns');
            add_filter('manage_' . $z_taxonomy . '_custom_column', 'z_taxonomy_column', 10, 3);
        }
    }
}

function z_add_style()
{
    echo '<style type="text/css" media="screen">
		th.column-thumb {width:60px;}
		.form-field img.taxonomy-image {border:1px solid #eee;max-width:300px;max-height:300px;}
		.inline-edit-row fieldset .thumb label span.title {width:48px;height:48px;border:1px solid #eee;display:inline-block;}
		.column-thumb span {width:48px;height:48px;border:1px solid #eee;display:inline-block;}
		.inline-edit-row fieldset .thumb img,.column-thumb img {width:48px;height:48px;}
	</style>';
}

// add image field in add form
function z_add_texonomy_field()
{
    if (get_bloginfo('version') >= 3.5) {
        wp_enqueue_media();
       // wp_enqueue_script('cat_button');
    } else {
        wp_enqueue_style('thickbox');
        wp_enqueue_script('thickbox');
    }

    echo '<div class="form-field">
		<label for="taxonomy_image">' . __('Image', 'zci') . '</label>
		<div class="blockholder">
		<input class="input_field" type="text" placeholder="image 1 (unpress)" name="taxonomy_image" id="taxonomy_image" value="" />
		<button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image button">' . __('Remove image', 'zci') . '</button>
		</div>
		<div class="blockholder">
		<input  class="input_field" type="text" placeholder="image 2 (press)" name="taxonomy_image_2" id="taxonomy_image_2" value="" />
		<button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image button">' . __('Remove image', 'zci') . '</button>
		</div>
		<div class="blockholder">
		<input  class="input_field" type="text" placeholder="image 3 (unpress_s)" name="taxonomy_image_3" id="taxonomy_image_3" value="" />
		<button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image button">' . __('Remove image', 'zci') . '</button>
		</div>
		<div class="blockholder">
		<input class="input_field"  type="text" placeholder="image 4 (press_s)" name="taxonomy_image_4" id="taxonomy_image_4" value="" />
		<button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image button">' . __('Remove image', 'zci') . '</button>
		</div>
	</div><script type="text/javascript">var page_cate_image_holder = "list";</script>';
}

// add image field in edit form
function z_edit_texonomy_field($taxonomy)
{
    if (get_bloginfo('version') >= 3.5) {
        wp_enqueue_script('underscore');
        wp_enqueue_media();
        wp_enqueue_script('cat_button');
    } else {
        wp_enqueue_style('thickbox');
        wp_enqueue_script('thickbox');
    }

    echo '<tr class="form-field image_input_editor">
		<th scope="row" valign="top"><label for="taxonomy_image">' . __('Image 1', 'zci') . '</label></th>
		<td><img class="taxonomy-image" src="' . z_taxonomy_image_url($taxonomy->term_id, 1, NULL, TRUE) . '"/><br/>
		<input  class="input_field" type="text" name="taxonomy_image" id="taxonomy_image" value="' . get_z_edit_image_url($taxonomy, 1) . '" /><br />
		<button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image_button button">' . __('Remove image', 'zci') . '</button>
		</td>
	</tr>
	<tr class="form-field image_input_editor">
		<th scope="row" valign="top"><label for="taxonomy_image">' . __('Image 2', 'zci') . '</label></th>
		<td><img class="taxonomy-image" src="' . z_taxonomy_image_url($taxonomy->term_id, 2, NULL, TRUE) . '"/><br/>
		<input  class="input_field" type="text" name="taxonomy_image_2" id="taxonomy_image_2" value="' . get_z_edit_image_url($taxonomy, 2) . '" /><br />
	    <button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image_button button">' . __('Remove image', 'zci') . '</button>
		</td>
	</tr>
	<tr class="form-field image_input_editor">
		<th scope="row" valign="top"><label for="taxonomy_image">' . __('Image 3', 'zci') . '</label></th>
		<td><img class="taxonomy-image" src="' . z_taxonomy_image_url($taxonomy->term_id, 3, NULL, TRUE) . '"/><br/>
		<input class="input_field"  type="text" name="taxonomy_image_3" id="taxonomy_image_3" value="' . get_z_edit_image_url($taxonomy, 3) . '" /><br />
	    <button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image_button button">' . __('Remove image', 'zci') . '</button>
		</td>
	</tr>
	<tr class="form-field image_input_editor">
		<th scope="row" valign="top"><label for="taxonomy_image">' . __('Image 4', 'zci') . '</label></th>
		<td><img class="taxonomy-image" src="' . z_taxonomy_image_url($taxonomy->term_id, 4, NULL, TRUE) . '"/><br/>
		<input  class="input_field" type="text" name="taxonomy_image_4" id="taxonomy_image_4" value="' . get_z_edit_image_url($taxonomy, 4) . '" /><br />
	    <button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
		<button class="z_remove_image_button button">' . __('Remove image', 'zci') . '</button>
		</td>
	</tr><script type="text/javascript">var page_cate_image_holder = "single";</script>
	';
}

function get_z_edit_image_url($taxonomy, $image_index)
{
    if (z_taxonomy_image_url($taxonomy->term_id, $image_index, NULL, TRUE) == Z_IMAGE_PLACEHOLDER)
        $image = "";
    else
        $image = z_taxonomy_image_url($taxonomy->term_id, $image_index, NULL, TRUE);

    return $image;
}

// upload using wordpress upload
function z_script($field_id = "taxonomy_image")
{
    return '<script type="text/javascript">
	    jQuery(document).ready(function($) {
			var wordpress_ver = "' . get_bloginfo("version") . '", upload_button;
			$(".z_upload_image_button").click(function(event) {
				upload_button = $(this);
				var frame;
				if (wordpress_ver >= "3.5") {
					event.preventDefault();
					if (frame) {
						frame.open();
						return;
					}
					frame = wp.media();
					frame.on( "select", function() {
						// Grab the selected attachment.
						var attachment = frame.state().get("selection").first();
						frame.close();
						if (upload_button.parent().prev().children().hasClass("tax_list")) {
							upload_button.parent().prev().children().val(attachment.attributes.url);
							upload_button.parent().prev().prev().children().attr("src", attachment.attributes.url);
						}
						else
							$("#' . $field_id . '").val(attachment.attributes.url);
					});
					frame.open();
				}
				else {
					tb_show("", "media-upload.php?type=image&amp;TB_iframe=true");
					return false;
				}
			});
			
			$(".z_remove_image_button").click(function() {
				$("#' . $field_id . '").val("");
				$(this).parent().siblings(".title").children("img").attr("src","' . Z_IMAGE_PLACEHOLDER . '");
				$(".inline-edit-col :input[name=\'taxonomy_image\']").val("");
				return false;
			});
			
			if (wordpress_ver < "3.5") {
				window.send_to_editor = function(html) {
					imgurl = $("img",html).attr("src");
					if (upload_button.parent().prev().children().hasClass("tax_list")) {
						upload_button.parent().prev().children().val(imgurl);
						upload_button.parent().prev().prev().children().attr("src", imgurl);
					}
					else
						$("#' . $field_id . '").val(imgurl);
					tb_remove();
				}
			}
			
			$(".editinline").live("click", function(){  
			    var tax_id = $(this).parents("tr").attr("id").substr(4);
			    var thumb = $("#tag-"+tax_id+" .thumb img").attr("src");
				if (thumb != "' . Z_IMAGE_PLACEHOLDER . '") {
					$(".inline-edit-col :input[name=\'taxonomy_image\']").val(thumb);
				} else {
					$(".inline-edit-col :input[name=\'taxonomy_image\']").val("");
				}
				$(".inline-edit-col .title img").attr("src",thumb);
			    return false;  
			});  
	    });
	</script>';
}

// save our taxonomy image while edit or save term
add_action('edit_term', 'z_save_taxonomy_image');
add_action('create_term', 'z_save_taxonomy_image');
function z_save_taxonomy_image($term_id)
{
    if (isset($_POST['taxonomy_image']))
        update_option('z_taxonomy_image' . $term_id, $_POST['taxonomy_image']);
    z_update_image($term_id, 2);
    z_update_image($term_id, 3);
    z_update_image($term_id, 4);
}

function z_update_image($term_id, $index)
{
    if (isset($_POST['taxonomy_image_' . $index])) {
        update_option('z_taxonomy_image_' . $term_id . '_' . $index, $_POST['taxonomy_image_' . $index]);
    }
}

// get attachment ID by image url
function z_get_attachment_id_by_url($image_src)
{
    global $wpdb;
    $query = "SELECT ID FROM {$wpdb->posts} WHERE guid = '$image_src'";
    $id = $wpdb->get_var($query);
    return (!empty($id)) ? $id : NULL;
}

/**
 *
 * get taxonomy image url for the given term_id (Place holder image by default)
 * @param null $term_id
 * @param int $image_col
 * @param null $size
 * @param bool $return_placeholder
 * @return string
 */
function z_taxonomy_image_url($term_id = NULL, $image_col = 1, $size = NULL, $return_placeholder = FALSE)
{
    if (!$term_id) {
        if (is_category())
            $term_id = get_query_var('cat');
        elseif (is_tax()) {
            $current_term = get_term_by('slug', get_query_var('term'), get_query_var('taxonomy'));
            $term_id = $current_term->term_id;
        }
    }
    if ($image_col > 1) {
        $taxonomy_image_url = get_option('z_taxonomy_image_' . $term_id . '_' . $image_col);
    } else
        $taxonomy_image_url = get_option('z_taxonomy_image' . $term_id);

    if (!empty($taxonomy_image_url)) {
        $attachment_id = z_get_attachment_id_by_url($taxonomy_image_url);
        if (!empty($attachment_id)) {
            if (empty($size))
                $size = 'full';
            $taxonomy_image_url = wp_get_attachment_image_src($attachment_id, $size);
            $taxonomy_image_url = $taxonomy_image_url[0];
        }
    }

    if ($return_placeholder) {
        $out = ($taxonomy_image_url != '') ? $taxonomy_image_url : Z_IMAGE_PLACEHOLDER;
    } else {
        $out = $taxonomy_image_url;
    }
    return !$out ? "" : $out;
}

function z_quick_edit_custom_box($column_name, $screen, $name)
{
    if ($column_name == 'thumb')
        echo '<fieldset>
		<div class="thumb inline-edit-col">
			<label>
				<span class="title"><img src="" alt="Thumbnail"/></span>
				<span class="input-text-wrap"><input type="text" name="taxonomy_image" value="" class="tax_list" /></span>
				<span class="input-text-wrap">
					<button class="z_upload_image_button button">' . __('Upload/Add image', 'zci') . '</button>
					<button class="z_remove_image_button button">' . __('Remove image', 'zci') . '</button>
				</span>
			</label>
		</div>
		<div class="thumb inline-edit-col">
			<label>
				<span class="title"><img src="" alt="Thumbnail"/></span>
				<span class="input-text-wrap"><input type="text" name="taxonomy_image_2" value="" class="tax_list" /></span>
			</label>
		</div>
		<div class="thumb inline-edit-col">
			<label>
				<span class="title"><img src="" alt="Thumbnail"/></span>
				<span class="input-text-wrap"><input type="text" name="taxonomy_image_2" value="" class="tax_list" /></span>
			</label>
		</div>
	</fieldset>';
}

/**
 * Thumbnail column added to category admin.
 *
 * @access public
 * @param mixed $columns
 * @return void
 */
function z_taxonomy_columns($columns)
{
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['thumb'] = __('Image', 'zci');
    unset($columns['cb']);
    return array_merge($new_columns, $columns);
}

/**
 * Thumbnail column value added to category admin.
 *
 * @access public
 * @param mixed $columns
 * @param mixed $column
 * @param mixed $id
 * @return void
 */
function z_taxonomy_column($columns, $column, $id)
{
    if ($column == 'thumb')
        $columns = '<span><img src="' . z_taxonomy_image_url($id, 1, NULL, TRUE) . '" alt="' . __('Thumbnail', 'zci') . '" class="wp-post-image" /></span>';

    return $columns;
}

// change 'insert into post' to 'use this image'
function z_change_insert_button_text($safe_text, $text)
{
    return str_replace("Insert into Post", "Use this image", $text);
}

// style the image in category list
if (strpos($_SERVER['SCRIPT_NAME'], 'edit-tags.php') > 0) {
    add_action('admin_head', 'z_add_style');
    add_action('quick_edit_custom_box', 'z_quick_edit_custom_box', 10, 3);
    add_filter("attribute_escape", "z_change_insert_button_text", 10, 2);
}

// New menu submenu for plugin options in Settings menu
add_action('admin_menu', 'z_options_menu');
function z_options_menu()
{
    add_options_page(__('Categories Images settings', 'zci'), __('Categories Images', 'zci'), 'manage_options', 'zci-options', 'zci_options');
    add_action('admin_init', 'z_register_settings');
}

// Register plugin settings
function z_register_settings()
{
    register_setting('zci_options', 'zci_options', 'z_options_validate');
    add_settings_section('zci_settings', __('Categories Images settings', 'zci'), 'z_section_text', 'zci-options');
    add_settings_field('z_excluded_taxonomies', __('Excluded Taxonomies', 'zci'), 'z_excluded_taxonomies', 'zci-options', 'zci_settings');
}

// Settings section description
function z_section_text()
{
    echo '<p>' . __('Please select the taxonomies you want to exclude it from Categories Images plugin', 'zci') . '</p>';
}

// Excluded taxonomies checkboxs
function z_excluded_taxonomies()
{
    $options = get_option('zci_options');
    $disabled_taxonomies = array('nav_menu', 'link_category', 'post_format');
    foreach (get_taxonomies() as $tax) : if (in_array($tax, $disabled_taxonomies)) continue; ?>
        <input type="checkbox" name="zci_options[excluded_taxonomies][<?php echo $tax ?>]"
               value="<?php echo $tax ?>" <?php checked(isset($options['excluded_taxonomies'][$tax])); ?> /> <?php echo $tax; ?>
        <br/>
    <?php endforeach;
}

// Validating options
function z_options_validate($input)
{
    return $input;
}

// Plugin option page
function zci_options()
{
    if (!current_user_can('manage_options'))
        wp_die(__('You do not have sufficient permissions to access this page.', 'zci'));
    $options = get_option('zci_options');
    ?>
    <div class="wrap">
        <?php screen_icon(); ?>
        <h2><?php _e('Categories Images', 'zci'); ?></h2>

        <form method="post" action="options.php">
            <?php settings_fields('zci_options'); ?>
            <?php do_settings_sections('zci-options'); ?>
            <?php submit_button(); ?>
        </form>
    </div>
<?php
}