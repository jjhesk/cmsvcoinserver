<?php
/*
  Controller name: System Log
  Controller description: Backend API for presenting the JSON of system log. <br>Detail please refer to our Google Drive documentation. <br>Author: Ryo
 */
if (!class_exists('JSON_API_Systemlog_Controller')) {
    class JSON_API_Systemlog_Controller
    {
        /**
         * API Name: api get sliders
         */

        public static function get_admin_stock_management_log()
        {
            global $wpdb;
            $table_app_log = $wpdb->prefix . 'app_log';
            $myrows = $wpdb->get_results("SELECT * FROM $table_app_log WHERE event_code = 920");
            api_handler::outSuccessDataTable($myrows);
        }

        public static function get_admin_coupon_management_log()
        {
            global $wpdb;
            $table_app_log = $wpdb->prefix . 'app_log';
            $myrows = $wpdb->get_results("SELECT * FROM $table_app_log WHERE event_code = 921");
            api_handler::outSuccessDataTable($myrows);
        }

        public static function get_stock_count_log()
        {
            global $wpdb;
            $table_app_log = $wpdb->prefix . 'app_log';
            $myrows = $wpdb->get_results("SELECT * FROM $table_app_log WHERE event_code = 922");
            api_handler::outSuccessDataTable($myrows);
        }

        public static function get_admin_vendor_management_log()
        {
            global $wpdb;
            $table_app_log = $wpdb->prefix . 'app_log';
            $myrows = $wpdb->get_results("SELECT * FROM $table_app_log WHERE event_code = 923");
            api_handler::outSuccessDataTable($myrows);
        }

        public static function get_developer_app_management_log()
        {
            global $wpdb;
            $table_app_log = $wpdb->prefix . 'app_log';
            $myrows = $wpdb->get_results("SELECT * FROM $table_app_log WHERE event_code = 924");
            api_handler::outSuccessDataTable($myrows);
        }

        public static function get_redemption_log()
        {
            global $wpdb;
            $table_app_log = $wpdb->prefix . 'app_log';
            $myrows = $wpdb->get_results("SELECT * FROM $table_app_log WHERE event_code = 925");
            api_handler::outSuccessDataTable($myrows);
        }
    }
}
