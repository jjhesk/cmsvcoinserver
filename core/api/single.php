<?php
/*
  Controller name: Single
  Controller description: Get reward items details<br>Author: Ryo
 */
/**
 * Created by HKM Corporation.
 * User: ryo
 * Date: 14年8月21日
 * Time: 下午5:01
 */

if (!class_exists('JSON_API_Single_Controller')) {
    class JSON_API_Single_Controller
    {

        /**
         * display a single reward item in json for the mobile app
         */
        public static function reward()
        {
            try {
                global $json_api;
                $id = $json_api->query->id;
                $arr = new SingleReward($id);
                api_handler::outSuccessDataWeSoft($arr->list_reward_details());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * display a single app item in json for the mobile app
         */
        public static function app()
        {
            try {
                global $json_api;
                $id = $json_api->query->id;
                $arr = new SingleApp($id);
                api_handler::outSuccessDataWeSoft($arr->list_reward_details());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * display a single app item in json for the mobile app
         */
        public static function coupon()
        {
            try {
                global $json_api;
                $id = $json_api->query->id;
                $arr = new Coupon($id);
                api_handler::outSuccessDataWeSoft($arr->show_detail());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * 14
         * display the counting summary for the object_id
         */
        public static function accounting_detail()
        {
            try {
                global $json_api;
                $id = $json_api->query->id;
                if (!isset($id)) throw new Exception("ID is missing", 1001);
                $comment = new AppComment($id);
                api_handler::outSuccessDataWeSoft($comment->get_counts_from_id($id));
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * 14.1
         * add share count on the object_id
         */
        public static function add_share_count()
        {
            try {
                global $json_api;
                $id = $json_api->query->id;
                if (!isset($id)) throw new Exception("ID is missing", 1001);
                $comment = new AppComment($id);
                api_handler::outSuccessDataWeSoft($comment->addcountshare($id));
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }
    }
}