<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月25日
 * Time: 下午3:46
 */
//namespace pack;
class view_option_panel
{
    public static function panel_settings()
    {
        $options = get_option('taxonomy_display_options');

        if (isset($_POST['form_submit'])) {

            $options['capability'] = $_POST['capability'];
            $options['autosort'] = isset($_POST['autosort']) ? $_POST['autosort'] : '';
            $options['adminsort'] = isset($_POST['adminsort']) ? $_POST['adminsort'] : '';
            $options['taxonomy_list'] = isset($_POST['taxlist']) ? $_POST['taxlist'] : '';

            echo '<div class="updated fade"><p>' . __('Settings Saved', 'atto') . '</p></div>';

            update_option('taxonomy_display_options', $options);
        }

        //build an array containing the user role and capability
        $user_roles = array();
        $user_roles['Subscriber'] = apply_filters('atto_user_role_capability', 'read', 'Subscriber');
        $user_roles['Contributor'] = apply_filters('atto_user_role_capability', 'edit_posts', 'Contributor');
        $user_roles['Author'] = apply_filters('atto_user_role_capability', 'publish_posts', 'Author');
        $user_roles['Editor'] = apply_filters('atto_user_role_capability', 'publish_pages', 'Editor');
        $user_roles['Administrator'] = apply_filters('atto_user_role_capability', 'install_plugins', 'Administrator');

        $args = array(
            'public' => true,
            '_builtin' => false
        );
        $tax = array();
        $output = 'names'; // or objects
        $operator = 'and'; // 'and' or 'or'
        $taxonomies = get_taxonomies($args, $output, $operator);
        if ($taxonomies) {
            foreach ($taxonomies as $taxonomy) {
                // echo '<p>' . $taxonomy . '</p>';
                $tax[$taxonomy] = isset($options['taxonomy_list'][$taxonomy]) ? $options['taxonomy_list'][$taxonomy] : 0;
            }
        }

        $setup = vtd_util::getcheckbox($tax);
        echo vtd_util::getviewContent("option", $setup);

        //$logic->do_enqueue_script("admin_cat", "profile_button");

        //  echo vtd_util::getview("edit_field");
    }
} 