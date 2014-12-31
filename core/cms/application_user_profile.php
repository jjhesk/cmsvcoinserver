<?php
/**
 * Created by PhpStorm.
 * User: ryo
 * Date: 14年8月6日
 * Time: 下午12:42
 */

defined('ABSPATH') || exit;
if (!class_exists('application_user_profile')):
    class application_user_profile
    {
        protected $user_profile_render;
        protected $fields;
        protected $profile_config;

        /**
         * fields for profile settings.
         *
         * @param array $meta_list_input
         */
        function __construct($meta_list_input = array())
        {

            $this->profile_config = array(
                array(
                    "title" => "Store Staff Profile Settings",
                    "role" => "store_staff",
                    "editable_field" => array(
                        "company_association"
                    ),
                    "display_fields" => array(
                        "company_association" => "Company Association",
                        "last_login_lastlogintime" => "Last Login",
                    )
                )
            );
            $this->profile_config = wp_parse_args($meta_list_input, $this->profile_config);
            add_filter("UserFieldRender", array(__CLASS__, "app_user_filter"), 10, 3);
            add_action('show_user_profile', array(&$this, "add_profile_options"), 10, 1);
            add_action('edit_user_profile', array(&$this, "add_profile_options"), 10, 1);
            add_action('edit_user_profile_update', array(&$this, 'update'), 99, 1);
            add_action('personal_options_update', array(&$this, 'update'), 99, 1);
        }

        /**
         * @param $user_id
         */
        public function update($user_id)
        {
            $this->creation_profile(new WP_User($user_id));
            foreach ($this->fields as $field_id) {
                user_profile_editor::withUpdateField($user_id, $field_id);
            }
        }

        /**
         *
         * @param WP_User $user
         */
        private function creation_profile(WP_User $user)
        {
            //user - previewing user object
            $this->user_profile_render = new user_profile_editor();
            foreach ($this->profile_config as $profile_setting) {
                if (in_array($profile_setting["role"], $user->roles)) {
                    inno_log_db::log_admin_stock_management(-1, 8888, print_r($profile_setting["role"], true));
                    $this->user_profile_render->init($user, $profile_setting["title"], array($profile_setting["role"]), $profile_setting["editable_field"]);
                    $this->user_profile_render->add_box($profile_setting["display_fields"], true);
                    break;
                }
            }
            $this->fields = $this->user_profile_render->get_fields();
        }

        public function add_profile_options($user_object)
        {
            $this->creation_profile($user_object);
            $this->user_profile_render->render_end();
        }

        public static function app_user_filter(user_profile_editor $editor, $key, $var)
        {
            switch ($key) {
                case "company_association":
                    if (userBase::has_role("store_staff")) {
                        return $editor->input_field($var, $key, true);
                    } else if (userBase::has_role("administrator")) {
                        $listing_vendor = hkm_cross_reference::meta_box_enhance_list_post(VENDOR);
                        return $editor->input_selection($var, $key, $listing_vendor);
                    }
                    break;

                case "last_login_lastlogintime":
                    return $editor->apply_built_in_filter($var, $key);
                    break;


                default:
                    return "";
            }
        }
    }
endif;