<?php

/**
 * Created by PhpStorm.
 * User: ryo
 * Date: 14年8月6日
 * Time: 下午3:29
 */

defined('ABSPATH') || exit;
if (!class_exists('system_log_display')) {
    class system_log_display
    {

        private $system_log;

        public function __construct()
        {

            global $system_script_manager;

            $this->system_log = new adminapp(
                array(
                    'type' => 'main',
                    'icon' => VCOIN_IMAGES_PATH . "system_log_icon.png",
                    'position' => 11,
                    'parent_id' => 'sys_log',
                    'cap' => 'administrator',
                    'title' => __('System Log', HKM_LANGUAGE_PACK),
                    'name' => __('System Log', HKM_LANGUAGE_PACK),
                    'cb' => array(__CLASS__, 'render_admin_page_system_log'),
                    'script' => 'page_admin_system_log',
                    'style' => array('adminsupportcss', 'datatable', 'dashicons'),
                    //--- get_environoment_config
                    'script_localize' =>
                        array(
                            "setting_ob",
                            array("url" => DOMAIN_API)
                        )
                    //----  get
                    /*   'script_localize' =>
                           array("setting_ob",
                               $system_script_manager->get_environoment_config()
                           )*/
                    //array(
                    //     "tableurl" => site_url("/api/appaccess/") . "get_my_jobs_market",
                    //)
//optional
                    //  'script_localize' => array("jb_tablesource", array(
                    //     "tableurl" => site_url("/api/appaccess/") . "get_my_jobs_market",
                    //)
//end optional
                )
            //  )
            );


            /*$this->system_log->add_sub(array(
                    'title' => __('API Login Log', HKM_LANGUAGE_PACK),
                    'name' => __('API Login Log', HKM_LANGUAGE_PACK),
                    'sub_id' => 'api_login_log',
                    'cb' => array(__CLASS__, 'render_admin_page_system_log'),
                    'script_screen_id' => 'job-list_page_successoffers',
                    //  'script' => 'joblisttb',
                    //   'style' => 'kendo_default',
                    'script' => 'page_job_task_history',
                    'style' => array('adminsupportcss', 'datatable', 'dashicons'),*/

//optional
            /*'script_localize' => array("jb_tablesource", array(
                "tableurl" => site_url("/api/appaccess/") . "get_my_jobs_progress",
            )*/
//end optional
            //)
            //);
        }

        public static function render_admin_page_system_log()
        {

            echo get_oc_template("admin_page_system_log");
        }
    }
}