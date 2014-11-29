<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年9月11日
 * Time: 上午11:37
 */
defined('ABSPATH') || exit;
if (!class_exists('api_cms_server')) {
    class api_cms_server
    {
        /**
         * @param $method
         * @param array $params
         * @param bool $associated
         * @param bool $check_bool
         * @throws Exception
         * @internal param bool $out_in_array
         * @return bool
         */
        public static function crosscms($method, $params = array(), $associated = true, $check_bool = false)
        {
            //except using the wesoft data output format
            $d = api_handler::curl_post(AUTH_SERVER . "/api/cms/" . $method, $params);
            $object = json_decode($d);
            if (intval($object->result) > 1) throw new Exception($object->msg, $object->result);
            if (!$check_bool) {
                if (!isset($object->data))
                    throw new Exception("api done but there is no return on the key \"data\", please go back and check the source code", 1079);
            } else {
                return true;
            }
            if ($associated) {
                $obj = json_decode($d, true);
                return $obj["data"];
            } else {
                unset($object->data);
                return $object->data;
            }
        }


    }
}