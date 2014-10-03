<?php
/*
  Controller name: Email
  Controller description: Backend API for verification process mechanism provided specifically for IOS and Android. <br>Detail please refer to our Google Drive documentation. <br>Author: Heskemo
 */
if (!class_exists('JSON_API_Email_Controller')) {
    class JSON_API_Email_Controller
    {
        /**
         * API Name: api get sliders
         */
        public static function verify()
        {
            new email_confirmation_verify();
        }
        public static function send_log_from(){

        }
        public static function unitTest()
        {
            global $json_api;
            $n1 = $json_api->query->n1;
            $n2 = $json_api->query->n2;
            $op = $json_api->query->op;
            $status = 'failure';
            if ($op == 'addition') {
                $result = $n1 + $n2;
                $status = 'success';
            } else {
                $op = 'no input';
                $result = '';
            }

            return array('status' => $status, 'operation' => $op, 'result' => $result);
        }
    }
}