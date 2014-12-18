<?php
/*
  Controller name: Vendor
  Controller description: Backend API for presenting the JSON of vendor.<br>Author: Ryo
 */
/**
 * Created by HKM Corporation.
 * User: ryo
 * Date: 14年8月13日
 * Time: 下午3:57
 */

if (!class_exists('JSON_API_Vendor_Controller')) {
    class JSON_API_Vendor_Controller
    {
        /**
         * API Name: api get sliders by reward
         */
        public static function stores_location()
        {
            global $json_api;
            $result = VendorRequest::get_addresses_list_by_post_id($json_api->query->id);
            api_handler::outSuccessData($result);
        }

        /**
         * API Name: api get locations by the vendor
         */
        public static function stores_locations_choices()
        {
            //get_address_list_for_cms_chocies
            global $json_api;
            $result = VendorRequest::get_address_list_for_cms_chocies($json_api->query->id);
            api_handler::outSuccessData($result);
        }

        public static function get_terminal_num()
        {
            global $json_api;
            $result = VendorRequest::get_address_detail($json_api->query->id);
            api_handler::outSuccessData($result);
        }

        public static function list_vendor_address()
        {
            try {
                api_handler::outSuccessDataTable(VendorRequest::get_all_vendor_addresses());
            } catch (Exception $e) {
                api_handler::outFailWeSoft($e->getCode(), $e->getMessage());
            }
        }

        public static function insert_address()
        {
            global $json_api;
            try {
                api_handler::outSuccessData(VendorRequest::insert_vendor_address($json_api->query));
            } catch (Exception $e) {
                api_handler::outFailWeSoft($e->getCode(), $e->getMessage());
            }
        }

        public static function edit_address()
        {
            global $json_api;
            try {
                api_handler::outSuccessData(VendorRequest::edit_vendor_address($json_api->query));
            } catch (Exception $e) {
                api_handler::outFailWeSoft($e->getCode(), $e->getMessage());
            }
        }
    }
}