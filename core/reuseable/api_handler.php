<?php
defined('ABSPATH') || exit;
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年1月6日
 * Time: 上午10:38
 */
if (!class_exists('api_handler')) {
    class api_handler
    {
        public static function outPreJsonArray($data)
        {
            $d = new DateTime();
            return array("obtain" => $data, "result" => "success", "code" => 1, "timestamp" => $d->getTimestamp());
        }

        public static function outputJson($mix)
        {
            header('Content-Type: application/json');
            status_header(200);
            echo json_encode($mix);
            die();
        }

        public static function outSuccessDataWeSoft($data)
        {
            $d = new DateTime();
            self::outputJson(array("data" => $data, "result" => 1, "status" => "success", "timestamp" => $d->getTimestamp()));
        }

        public static function outSuccessData($data)
        {
            $d = new DateTime();
            self::outputJson(array("obtain" => $data, "result" => "success", "code" => 1, "timestamp" => $d->getTimestamp()));
        }

        public static function outSuccessDataTable($data)
        {
            $d = new DateTime();
            self::outputJson(array("data" => $data, "result" => "success", "code" => 1, "timestamp" => $d->getTimestamp()));
        }

        /**
         * This is for the use of server-side datatable.js(paging)
         * @param $data
         */
        public static function outSuccessPagingDataTable($data)
        {
            $d = new DateTime();
            $meta = array("result" => "success", "code" => 1, "timestamp" => $d->getTimestamp());
            $data = array_merge($data, $meta);
            $d = NULL;
            self::outputJson($data);
        }

        public static function outSuccess($return = false)
        {
            $d = new DateTime();
            $out = array("result" => 1, "timestamp" => $d->getTimestamp(), "data" => "");
            if (!$return) self::outputJson($out); else return $out;
        }

        public static function outFailWeSoft($code, $message, $return = false)
        {
            $out = array(
                "msg" => $message,
                "result" => $code,
                "timestamp" => -1,
                "status" => "failure",
                "data" => ""
            );
            if (!$return) self::outputJson($out); else return $out;
        }

        public static function outFail($code, $message, $return = false)
        {
            $out = array(
                "msg" => $message,
                "result" => $code,
                "code" => $code,
                "timestamp" => -1,
                "data" => "failure"
            );
            if (!$return) self::outputJson($out); else return $out;
        }

        public static function curl_posts($url, array $post = NULL, array $options = array())
        {
            try {
                $options = wp_parse_args(array(
                    CURLOPT_TIMEOUT => 10,
                    CURLOPT_SSL_VERIFYPEER => true,
                    CURLOPT_CAINFO => CERT_PATH,
                ), $options);
                return self::curl_post($url, $post, $options);
            } catch (Exception $e) {
                throw $e;
            }
        }

        /**
         * Send a POST requst using cURL
         * @param string $url to request
         * @param array $post values to send
         * @param array $options for cURL
         * @throws Exception
         * @return string
         */
        public static function curl_post($url, array $post = NULL, array $options = array())
        {
            $defaults = array(
                CURLOPT_POST => 1,
                CURLOPT_HEADER => 0,
                CURLOPT_URL => $url,
                CURLOPT_FRESH_CONNECT => 1,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_FORBID_REUSE => 1,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_POSTFIELDS => http_build_query($post),
                CURLOPT_SSL_VERIFYPEER => false,
            );

            $ch = curl_init();
            // $final_set = wp_parse_args($options, $defaults);
            curl_setopt_array($ch, ($options + $defaults));
            if (!$result = curl_exec($ch)) {
                // trigger_error(curl_error($ch));
                //                self::outFail(955, curl_error($ch));
                throw new Exception(curl_error($ch), 955);
                //   inno_log_db::log_login_china_server_info(-1, 955, curl_error($ch), "-");
            } else
                curl_close($ch);
            return $result;
        }


        /**
         * Send a GET requst using cURL
         * @param string $url to request
         * @param array $get values to send
         * @param array $options for cURL
         * @return string
         */
        public static function curl_get($url, array $get = NULL, array $options = array())
        {
            $defaults = array(
                CURLOPT_URL => $url . (strpos($url, '?') === FALSE ? '?' : '') . http_build_query($get),
                CURLOPT_HEADER => 0,
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_TIMEOUT => 4,
                CURLOPT_SSL_VERIFYPEER => false,
            );

            $ch = curl_init();
            curl_setopt_array($ch, ($options + $defaults));
            if (!$result = curl_exec($ch)) {
                // trigger_error(curl_error($ch));
                self::outFail(955, curl_error($ch));
                // inno_log_db::log_login_china_server_info(-1, 955, curl_error($ch), "-");
            } else
                curl_close($ch);
            return $result;
        }

        /**
         *
         * @param $url
         * @param array $data
         * @param array $options
         * @return mixed
         */
        public static function curl_post_json($url, array $data = NULL, array $options = array())
        {

            $data_string = json_encode($data);

            $defaults = array(
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $data_string,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen($data_string)
                ),
                CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_SSL_VERIFYPEER => false,
            );

            $ch = curl_init($url);
            curl_setopt_array($ch, ($options + $defaults));

            if (!$result = curl_exec($ch)) {
                // trigger_error(curl_error($ch));
                self::outFail(955, curl_error($ch));
                // inno_log_db::log_login_china_server_info(-1, 955, curl_error($ch), "-");
            } else
                curl_close($ch);
            return json_decode($result);
        }
    }
}