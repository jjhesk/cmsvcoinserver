<?php
/**
 * system admin page menu display extension model for wordpress
 * this module class is designed for adding additional TAB menu as a big core function.
 * User: hesk
 * Date: 2/7/14
 * Time: 11:36 PM
 * positions
 * 2 Dashboard
 * 4 Separator
 * 5 Posts
 * 10 Media
 * 15 Links
 * 20 Pages
 * 25 Comments
 * 59 Separator
 * 60 Appearance
 * 65 Plugins
 * 70 Users
 * 75 Tools
 * 80 Settings
 * 99 Separator
 *
 */
defined('ABSPATH') || exit;
if (!class_exists('adminapp')):
    class adminapp
    {

        private $menu_title, $icon, $position, $cap, $type;
        private $top_level_slug, $title, $sub_id;
        private $script_screening_id, $support_script_id, $support_style_id;
        private $rendering_cb, $script_localizer;

        function __construct($args = array())
        {
            $defaults = array(
                "cap" => 'administrator',
                "type" => "main",
                "cb" => null,
                "script_localize" => null,
                "style" => null,
                "script" => null,
            );
            $args = wp_parse_args($args, $defaults);
            extract($args);
            $this->type = $type;

            if (isset($parent_id))
                $this->top_level_slug = $parent_id;

            if ($this->type == 'main') {
                $this->check_valuable($icon);
                $this->check_valuable($position);
                $this->check_valuable($parent_id);
                $this->icon = $icon;
                $this->position = $position;
            }
            if ($this->type == 'sub') {
                $this->check_valuable($sub_id);
                $this->sub_id = $sub_id;
            }
            if ($this->type == 'user') {
                $this->check_valuable($sub_id);
                $this->sub_id = $sub_id;
                $this->top_level_slug = 'users.php';
            }

            if (isset($script_localize))
                $this->script_localizer = $script_localize;

            $this->cap = $cap;

            $this->title = $title;
            $this->menu_title = $name;
            if (isset($script_screen_id))
                $this->script_screening_id = $script_screen_id;
            else
                $this->setup_auto_screen_id();
            $this->set_script_enqueue($script, $this->support_script_id);
            $this->set_script_enqueue($style, $this->support_style_id);
            if (!isset($cb)) {
                return;
            } else {
                $this->rendering_cb = $cb;
            }
            // do not need it add_action('admin_enqueue_scripts', array('ocscript', 'register'));
            add_action('admin_menu', array(&$this, "register"));
        }

        private function check_valuable(&$slug_id)
        {
            if (!isset($slug_id)) echo "the required slug id is not initalized please go back and check";
        }

        private function setup_auto_screen_id()
        {
            if ($this->type == 'sub') {
                $this->script_screening_id = $this->top_level_slug . '_page_' . $this->sub_id;
            } else if ($this->type == 'main') {
                $this->script_screening_id = 'toplevel_page_' . $this->top_level_slug;
            }
        }

        private function set_script_enqueue($local_script_type, &$local_store_script_id)
        {
            if (isset($local_script_type)) {
                $local_store_script_id = $local_script_type;
            }
        }

        public function add_sub($args = array())
        {
            if ($this->type == 'sub') return;
            $defaults = array(
                "cap" => $this->cap,
                "type" => "sub",
                "parent_id" => $this->top_level_slug,
                "script" => isset($this->support_script_id) ? $this->support_script_id : null,
                "style" => isset($this->support_style_id) ? $this->support_style_id : null,
                "script_localize" => null,
            );
            $args = wp_parse_args($args, $defaults);
            $Instance = new self($args);
        }

        public function register()
        {
            if ($this->type == 'main') {
                add_menu_page(
                    $this->title,
                    $this->menu_title,
                    $this->cap,
                    $this->top_level_slug,
                    $this->rendering_cb,
                    $this->icon,
                    $this->position);
            }
            if ($this->type == 'sub') {
                add_submenu_page(
                    $this->top_level_slug,
                    $this->title,
                    $this->menu_title,
                    $this->cap,
                    $this->sub_id,
                    $this->rendering_cb);
            }

            if ($this->type == 'user') {
                add_users_page(
                    $this->title,
                    $this->menu_title,
                    $this->cap,
                    $this->sub_id,
                    $this->rendering_cb);
            }

            if (isset($this->support_script_id) || isset($this->support_style_id)) {
                add_action('admin_enqueue_scripts', array(&$this, "wp_script"));
            }

        }

        public function wp_script($hook)
        {
            $screen = get_current_screen();
            /* echo '<pre>';
              print_r($screen);

              echo '<br>';
              echo $hook;
              echo '<br>';
              echo $this->script_screening_id;
              echo '</pre>';*/

            if ($this->type == 'main' || $this->type == 'sub') {

                if ($hook == $this->script_screening_id) {
                    if (isset($this->support_style_id)) {
                        //
                        $this->do_enqueue_style($this->support_style_id);
                    }
                    if (isset($this->support_script_id)) {
                        $this->do_enqueue_script($this->support_script_id);
                    }
                    return;

                }
            }

            //   echo "// works 167-" . $hook . " screen id: " . $this->script_screening_id;
            if ($this->type == 'sub' && $screen->id == $this->script_screening_id) {
                if (isset($this->support_style_id))
                    $this->do_enqueue_style($this->support_style_id);

                // echo "works 164";
                if (isset($this->support_script_id)) {
                    //   echo "works 166";
                    $this->do_enqueue_script($this->support_script_id);
                }

                return;
            }

            if ($this->type == 'user' && $hook == $this->script_screening_id) {
                if (isset($this->support_style_id))
                    $this->do_enqueue_style($this->support_style_id);
                // echo "works 164";
                if (isset($this->support_script_id)) {
                    //   echo "works 166";
                    $this->do_enqueue_script($this->support_script_id);
                }
                return;
            }
        }

        private function do_enqueue_style($handler)
        {
            if (is_array($handler)) {
                foreach ($handler as $h) {
                    //  debugoc::upload_bmap_log($h, 180092);
                    wp_enqueue_style($h);
                }
            } else {
                wp_enqueue_style($handler);
            }
        }

        private function do_enqueue_script($handler)
        {
            if (isset($this->script_localizer)) {
                wp_enqueue_script($handler);
                wp_localize_script($handler, $this->script_localizer[0], $this->script_localizer[1]);
            } else
                wp_enqueue_script($handler);
        }
    }
endif;

/*

 sample code

$app_cr_approve = new adminapp(
    array(
        'type' => 'user',
        'sub_id' => 'crapprovals',
        'cap' => 'ocstaff',
        'title' => __('CR Approvals Application', HKM_LANGUAGE_PACK),
        'name' => __('CR Approvals', HKM_LANGUAGE_PACK),
        'script_screen_id' => 'users_page_crapprovals',
        'style' => array('adminsupportcss', 'datatable'),
        'script' => 'page_approve_new_cr',
        'cb' => array('oc_cr', 'render_admin_page_approve_cr')
    )
);

$app_cp_approve = new adminapp(
    array(
        'type' => 'user',
        'sub_id' => 'cpapprovals',
        'cap' => 'ocstaff',
        'title' => __('CP Approvals Application', HKM_LANGUAGE_PACK),
        'name' => __('CP Approvals', HKM_LANGUAGE_PACK),
        'script_screen_id' => 'users_page_cpapprovals',
        'style' => array('adminsupportcss', 'datatable'),
        'script' => 'page_approve_new_cp',
        'cb' => array('oc_cp', 'render_admin_page_approve_cp')
    )
);

$app_cp_panel = new adminapp(
    array(
        'type' => 'main',
        'icon' => EXIMAGE . "adv_3234ng.png",
        'position' => 11,
        'parent_id' => 'joblisting',
        'cap' => 'cp',
        'title' => __('Job List Market', HKM_LANGUAGE_PACK),
        'name' => __('Job List', HKM_LANGUAGE_PACK),
        'cb' => array('oc_job_list', 'render_page_list'),
        'script' => 'page_job_application',
        'style' => array('adminsupportcss', 'datatable', 'dashicons'),

//optional
        'script_localize' => array("jb_tablesource", array(
            "tableurl" => site_url("/api/appaccess/") . "get_my_jobs_market",
        )
//end optional
        )
));

$app_cp_panel->add_sub(array(
    'title' => __('My Jobs In Progress', HKM_LANGUAGE_PACK),
    'name' => __('My Jobs', HKM_LANGUAGE_PACK),
    'sub_id' => 'successoffers',
    'cb' => array('oc_job_list', 'render_page_task'),
    'script_screen_id' => 'job-list_page_successoffers',
    //  'script' => 'joblisttb',
    //   'style' => 'kendo_default',
    'script' => 'page_job_task_history',
    'style' => array('adminsupportcss', 'datatable', 'dashicons'),

//optional
        'script_localize' => array("jb_tablesource", array(
            "tableurl" => site_url("/api/appaccess/") . "get_my_jobs_progress",
        )
//end optional
)

));

*/