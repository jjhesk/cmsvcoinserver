<?php
/*
  Controller name: Vcoin transaction
  Controller description: Backend API for presenting the JSON of system log. <br>Detail please refer to our Google Drive documentation. <br>Author: Hesk
 */
if (!class_exists('JSON_API_Vcoin_Controller')) {
    class JSON_API_Vcoin_Controller
    {
        /**
         * transaction api
         * @return array
         */
        public static function notify_transaction_status()
        {
            global $json_api;
            try {
                $Q = $json_api->query;
                if (!isset($Q->transactionid)) throw new Exception("transactionid id is missing.", 1001);
                if (!isset($Q->reference)) throw new Exception("reference is missing.", 1002);
                if (!isset($Q->status)) throw new Exception("status is missing.", 1003);
                $t = new Redemption();
                $t->change_status($Q->transactionid, $Q->reference, $Q->status);
                $d = $t->get_result();

                inno_log_db::log_developer_app_management(-1, 15000, "call back transaction vcoin adjustment" . $Q->transactionid . " - " . $Q->reference . " detail:" . print_r($d, true));


                if (isset($d["user_id"]) && isset($d["sms_message"])) {
                    inno_log_db::log_developer_app_management(-1, 15000, "call back send_sms_to_user");
                    api_cms_server::crosscms("send_sms_to_user", $d);
                }

                if (isset($d["user_id"]) && isset($d["push_message"])) {
                    inno_log_db::log_developer_app_management(-1, 15000, "call back send_push_to_user");
                    api_cms_server::crosscms("send_push_to_user", $d);
                }


                api_handler::outSuccess();
            } catch (Exception $e) {

                inno_log_db::log_developer_app_management(-1, 15000, "transaction CB failed" . $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

    }
}