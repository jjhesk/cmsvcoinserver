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
                $jsonq = $json_api->query;
                if (!isset($jsonq->transactionid)) throw new Exception("transactionid id is missing.", 1001);
                if (!isset($jsonq->reference)) throw new Exception("reference is missing.", 1002);
                if (!isset($jsonq->status)) throw new Exception("status is missing.", 1003);
                $t = new Redemption();
                $t->change_status($jsonq->transactionid, $jsonq->reference, $jsonq->status);
                $d = $t->get_result();
                if (isset($d["user_id"]) && isset($d["sms_message"])) {
                    api_cms_server::crosscms("send_sms_to_user", $d);
                }




                api_handler::outSuccess();
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

    }
}