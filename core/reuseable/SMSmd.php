<?php

/**
 * This is the Push Server Gateway for MD server SMS service
 * @source : http://www.md-sms.com/download/SMSOpenAPI.SMS.MD.5.05.pdf
 * http://www.md-sms.com/main.jsp;jsessionid=262e2a82045e7f78c1f7d0e04032?l=c#mainTabPanel:TabAPIH
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年9月11日
 * Time: 上午10:08
 */
if (!class_exists("SMSmd")):
    class SMSmd
    {
        public static function he2str($he)
        {
            $tmpHe = $he;
            $output = "";
            for ($i = 0; $i < strlen($tmpHe); $i = $i + 1) {
                if ($i < strlen($tmpHe) - 6) {
                    $tmpCh = substr($tmpHe, $i, 2);
                } else {
                    $tmpCh = "";
                }
                if ($tmpCh == "%u") {
                    $output = $output . "&#x" . substr($tmpHe, $i + 2, 4) . ";";
                    $i = $i + 5;
                } else {
                    $output = $output . substr($tmpHe, $i, 1);
                }
            }

            return $output;
        }

        public static function html_entity_decode_utf8($string)
        {
            static $trans_tbl;

            // replace numeric entities
            $string = preg_replace('~&#x([0-9a-f]+);~ei', 'code2utf(hexdec("\\1"))', $string);
            $string = preg_replace('~&#([0-9]+);~e', 'code2utf(\\1)', $string);

            // replace literal entities
            if (!isset($trans_tbl)) {
                $trans_tbl = array();

                foreach (get_html_translation_table(HTML_ENTITIES) as $val => $key)
                    $trans_tbl[$key] = utf8_encode($val);
            }

            return strtr($string, $trans_tbl);
        }

        public static function code2utf($num)
        {
            if ($num < 128) return chr($num);
            if ($num < 2048) return chr(($num >> 6) + 192) . chr(($num & 63) + 128);
            if ($num < 65536) return chr(($num >> 12) + 224) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
            if ($num < 2097152) return chr(($num >> 18) + 240) . chr((($num >> 12) & 63) + 128) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
            return '';
        }


        public static function uniord($ch)
        {

            $n = ord($ch{0});

            if ($n < 128) {
                return $n; // no conversion required
            }

            if ($n < 192 || $n > 253) {
                return false; // bad first byte || out of range
            }

            $arr = array(1 => 192, // byte position => range from
                2 => 224,
                3 => 240,
                4 => 248,
                5 => 252,
            );

            foreach ($arr as $key => $val) {
                if ($n >= $val) { // add byte to the 'char' array
                    $char[] = ord($ch{$key}) - 128;
                    $range = $val;
                } else {
                    break; // save some e-trees
                }
            }

            $retval = ($n - $range) * pow(64, sizeof($char));

            foreach ($char as $key => $val) {
                $pow = sizeof($char) - ($key + 1); // invert key
                $retval += $val * pow(64, $pow); // dark magic
            }

            return $retval;
        }

        public static function fillZero($str)
        {
            if (strlen($str) < 1) {
                return "0000";
            } else if (strlen($str) < 2) {
                return "000" . $str;
            } else if (strlen($str) < 3) {
                return "00" . $str;
            } else if (strlen($str) < 4) {
                return "0" . $str;
            } else {
                return $str;
            }
        }

        public static function getUTF8($str)
        {
            $output = "";
            $encStr = $str;
            for ($i = 0; $i < strlen($str); $i = $i + 1) {
                $tmpCh = uniord($encStr);
                if ($tmpCh) {
                    if ($tmpCh > 254) {
                        $encStr = substr($encStr, 3, strlen($encStr) - 3);
                        $i = $i + 2;
                    } else {
                        $encStr = substr($encStr, 1, strlen($encStr) - 1);
                    }
                    $tmpCh = strtoupper(dechex($tmpCh));
                    $tmpCh = fillZero($tmpCh);
                    $output = $output . "&#x" . $tmpCh . ";";
                } else { //Unknown charaters
                    $output = $output . substr($encStr, 0, 1);
                    $encStr = substr($str, 1, strlen($encStr) - 1);
                }
            }
            return $output;
        }

        private $md_server_domains = array();
        private $md_secured_domains = array();
        private $exceptions = array();
        private $send_number, $password, $username, $message_return, $status, $message_send;
        private $_server = 0, $use_server, $destination;

        function __construct()
        {

            $this->md_secured_domains = array(
                "https://www.mdtechcorp.com/",
                "https://mail.d-information.com/",
            );

            $this->md_server_domains = array(
                "http://openapi2.mdtechcorp.com:20000/",
                "http://openapi.mdtechcorp.com:20000/",
                "http://openapi.md-sms.net:20000/",
            );
            $this->exceptions = array(
                "success",
                "wrong destinations address",
                "invalid account information/username/password",
                "content ID incorrect",
                "destination number not all correct",
                "", "",
                "destination number block by OFTA",
                "wrong origination address",
                "internal error, please contact support",
            );
            $this->_server = 0;
            $this->use_server = $this->md_server_domains;
            $this->password = "xhz6i8ly";
            // $this->password = apply_filters("md_sms_password", "xhz6i8ly");
            $this->username = "56923181";
            // iMusicTech
            // $this->destination = "56923181";
            $this->destination = "";
            //  $this->password = apply_filters("md_sms_username", "56923181");
        }

        public function setDestination($number)
        {
            $this->send_number = $number;
        }

        public function setSMSContent($message)
        {
            $this->message_send = $message;
        }

        public function send()
        {

            $configuration = array(
                "username" => $this->username,
                "password" => $this->password,
                "destinatingAddress" => $this->send_number,
                "originatingAddress" => "",
                //$this->destination,
                "returnMode" => 1,
                "type" => 1,
                //   "sendDirect" => 1,
                "SMS" => $this->message_send,
            );
            $server_now = $this->use_server[$this->_server];
            $code = api_handler::curl_post($server_now . "openapi/", $configuration, array(
                CURLOPT_TIMEOUT => 10,
            ));

            $query = http_build_query($configuration);
            // inno_log_db::log_vcoin_third_party_app_transaction(-1, 10012, $server_now . "openapi/?" . $query);
            $c = abs(intval($code));
            // inno_log_db::log_vcoin_third_party_app_transaction(-1, 10012, "code: " . $code);
            if (intval($code) >= 0) {
                $this->status = "success";
                $this->message_return = $this->exceptions[0];
            } else {
                if ($c === 100) {
                    if ($this->_server < count($this->use_server)) {
                        $this->_server++;
                        $this->send();
                    } else {
                        $this->status = "error";

                        $this->message_return = $this->exceptions[9];
                    }
                } elseif ($c > 0) {
                    $this->status = "error";
                    $message = isset($this->exceptions[$c]) ? $this->exceptions[$c] : "unknown error";
                    $this->message_return = $message;
                }
            }
            if ($this->status == "error") {
                throw new Exception($this->message_return, 5000 + $c);
            }
        }

        /**
         * example for multiple numbers
         *
         * array[
         *      (optional) delimit: ;
         *      numbers:213123 23123 12312 123123 123123 12312 342423 234234
         *      content:foinaiofnien iosnif nsnef nsnf ineof nnfsndfnsid fnosn fosinf osind fisd
         * ]
         *
         * example for single number
         *
         * array[
         *      number:213123
         *      content:foinaiofnien iosnif nsnef nsnf ineof nnfsndfnsid fnosn fosinf osind fisd
         * ]
         *
         * @param array $args
         * @throws Exception
         */
        public static function InitiateSMS($args = array())
        {
            try {
                if (isset($args["numbers"])) {
                    if (!isset($args["numbers"])) throw new Exception("there is no numbers presented", 1081);
                    if (!isset($args["content"])) throw new Exception("there is no content presented", 1082);
                    if (isset($args["delimit"])) $delimit = $args["delimit"]; else $delimit = " ";
                    $numbers = explode($delimit, $args["numbers"]);
                    foreach ($numbers as $n) {
                        $post = new self();
                        $post->setDestination($n);
                        $post->setSMSContent(urlencode($args["content"]));
                        $post->send();
                    }
                } else {
                    if (!isset($args["number"])) throw new Exception("there is no number presented", 1081);
                    if (!isset($args["content"])) throw new Exception("there is no content presented", 1082);
                    $post = new self();
                    //  inno_log_db::log_vcoin_third_party_app_transaction(-1, 10171, "step1");
                    $post->setDestination($args["number"]);
                    //   inno_log_db::log_vcoin_third_party_app_transaction(-1, 10172, "step2");
                    $post->setSMSContent($args["content"]);
                    //  inno_log_db::log_vcoin_third_party_app_transaction(-1, 10173, "step3");
                    $post->send();
                }
            } catch (Exception $e) {
                throw $e;
            }
        }
    }
endif;