<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月12日
 * Time: 下午4:53
 */
class messagebox
{
    protected $titan, $must_ache, $lang, $template_keys;

    public function __construct()
    {
        $this->titan = TitanFramework::getInstance('vcoinset');
        $this->must_ache = new Mustache_Engine;
        if (isset($_REQUEST["lang"])) {
            if ($_REQUEST["lang"] == "zh") {
                $this->lang = "zh";
            } elseif ($_REQUEST["lang"] == "en") {
                $this->lang = "en";
            } elseif ($_REQUEST["lang"] == "zh-hant") {
                $this->lang = "zh";
            } elseif ($_REQUEST["lang"] == "ja") {
                $this->lang = "ja";
            } else $this->lang = "en";
        } else  $this->lang = "en";
    }

    public function __destruct()
    {
        $this->titan = NULL;
        $this->must_ache = NULL;
    }

    public function text_template($template_name, $keys)
    {
        $m = $this->titan->getOption($template_name);
        return $this->must_ache->render($m, $keys);
    }

    public static function throwError($message, $error_code)
    {
        $instance = new self();
        throw new Exception($instance->translation_code($message, $error_code), $error_code);
    }

    public static function translateError($message, $error_code)
    {
        $instance = new self();
        return $instance->translation_code($message, $error_code);
    }

    public static function getEmailTemplate($template_name, $keys)
    {
        $instance = new self();
        $text = $instance->text_template($template_name, $keys);
        $instance = NULL;
        return $text;
    }

    public function setKeys($k)
    {
        $this->template_keys = $k;
    }


    private function supportedLanguages()
    {
        return $this->lang == "zh" || $this->lang == "en" || $this->lang == "ja";
    }

    public static function get_message($code)
    {
        $instance = new self();
        return $instance->translate_by_code_only($code);
    }

    public static function get_message_t($code, $output_keys)
    {
        $instance = new self();
        $instance->setKeys($output_keys);
        return $instance->translate_by_code_only($code);
    }

    private function by_key_template($key)
    {
        $template = $this->titan->getOption($key);
        return $this->must_ache->render($template, $this->template_keys);
    }

    private function by_key_template_lang($key)
    {
        if ($this->supportedLanguages()) {
            return $this->by_key_template($key . "_" . $this->lang);
        } else return "";
    }

    private function by_template_lang($key)
    {
        if ($this->supportedLanguages()) {
            $template = $this->titan->getOption($key . "_" . $this->lang);
            return $template;
        } else return "";
    }

    public function translate_by_code_only($code)
    {
        $e = "";

        switch ((int)$code) {
            case 77005:
                $e = $this->by_key_template_lang("success_reward_note");
                break;
            case 77006:
                $e = $this->by_key_template_lang("success_coupon_note");
                break;
            case 77007:
                $e = $this->by_key_template_lang("pickup_reward_note");
                break;
            case 77008:
                $e = $this->by_key_template_lang("pickup_reward_note");
                break;
            case 77009:
                $e = $this->by_key_template_lang("gain_coin");
                break;
            case 77010:
                if ($this->supportedLanguages()) {
                    $e = $this->by_key_template("rcprocedure_" . $this->lang);
                }
                break;
            case 77011:
                $e = $this->by_template_lang("rdprocedure");
                break;

            case 77012:
                $e = $this->by_key_template_lang("rconfirmation");
                break;

            case 77013:
                $e = $this->by_key_template_lang("rsuccess");
                break;

            case 77014:
                $e = $this->by_key_template_lang("rprocessvcoin");
                break;


            case 77015:
                $e = $this->by_key_template_lang("ctnc");
                break;

            case 77016:
                $e = $this->by_key_template_lang("csuccess");
                break;

            case 77017:
                $e = $this->by_key_template_lang("rtnc");
                break;
        }


        return $e;
    }

    public function translation_code($message, $code)
    {
        $e = $message;
        if ($this->lang == "zh") {
            switch ((int)$code) {
                case 1001:
                    $e = "imusic account not found in cn";
                    break;

                case 1002:
                    $e = "imusic account not found in cn";
                    break;

                case 1003:
                    $e = "missing keys";
                    break;

                case 1004:
                    $e = "setting is not allow";
                    break;
                case 10979:
                    $e = "the current user does not have valid vcoin account, please go back and with the settings";
                    break;
                case 1010:
                    $e = "Please login";
                    break;

                case 1601:
                    $e = "Invalid ID";
                    break;


                case 1602:
                    $e = "invalid account uuid, please go back and with the settings";
                    break;

                case 1603:
                    $e = "invalid amount";
                    break;

                case 9919:
                    $e = "url is missing";
                    break;


                case 1007:
                    $e = "module not installed";
                    break;


                case 10001:
                    $e = "missing comment id";
                    break;

                case 10002:
                    $e = "missing reference id";
                    break;

                case 10003:
                    $e = "missing comment flag";
                    break;

                case 10004:
                    $e = "missing object id";
                    break;

                case 10005:
                    $e = "missing comment content";
                    break;


                case 10006:
                    $e = "missing feature for vcoin history";
                    break;
                case 10007:
                    $e = "missing action for vcoin";
                    break;
                case 10008:
                    $e = "get history uuid is missing. Check settings on user profile";
                    break;
                case 10009:
                    $e = "missing action id";
                    break;
                case 10010:
                    $e = "appkey is missing";
                    break;
                case 10011:
                    $e = "appkey for vcoinapp not matched";
                    break;
                case 10012:
                    $e = "down_app_key is missing";
                    break;


                case 1552:
                    $e = "you have already downloaded";
                    break;

                case 1553:
                    $e = "sdk appkey is not verified";
                    break;

                case 1554:
                    $e = "you have already got the reward";
                    break;


                case 1021:
                    $e = "Not initiated";
                    break;
                case 1024:
                    $e = "stock_id is not defined";
                    break;
                case 1022:
                    $e = "reward coin nature is not defined, No Vcoin Account";
                    break;
                case 1023:
                    $e = "No Vcoin Account is found";
                    break;

                case 1011:
                    $e = "the request action Point does not exist";
                    break;

                case 1012:
                    $e = "The action point is not ready";
                    break;

                case 1013:
                    $e = "SDK App Key is not selected";
                    break;


                case 1015:
                    $e = "Occurrence is not selected";
                    break;

                case 1016:
                    $e = "Frequency should be more than 1 for both and
         repeatable simple and repeatable continuous";
                    break;


                case 1017:
                    $e = "repeated trigger is not allowed within an interval";
                    break;

                case 1014:
                    $e = "reward have been gained";
                    break;


                case 1018:
                    $e = "no reward to gain and the action is recorded.";
                    break;

                case 1031:
                    $e = "the old password is not presented.";
                    break;

                case 1032:
                    $e = "the password does not match to set the new password.";
                    break;

                case 1019:
                    $e = "no data found.";
                    break;

                case 1088:
                    $e = "user uuid is not set";
                    break;

                case 1720:
                    $e = "wasted key is not presented";
                    break;

                case 1721:
                    $e = "hash for renewal is not presented";
                    break;

                case 1722:
                    $e = "app key for renewal is not presented";
                    break;

                case 1723:
                    $e = "app nouce for renewal is not presented";
                    break;
                case 1725:
                    $e = "token invalid";
                    break;

                case 1726:
                    $e = "this token is not expired";
                    break;

                case 1727:
                    $e = "calculation is invalid";
                    break;

                case 1079:
                    $e = "user does not have valid vcoin account, please go back with the settings of the user profile";
                    break;
                case 6011:
                    $e = "unable to deduct reserved coins for the developer";
                    break;
                case 1901:
                    $e = "you are not login";
                    break;

                case 2005:
                    $e = "imusic account not found in cn";
                    break;
                case 2007:
                    $e = "credit account not found in cn";
                    break;
                case 2006:
                    $e = "debit account not found in cn";
                    break;

                case 2102:
                    $e = "not enough coin in chinese";
                    break;
                case 2010:
                    $e = "account already exist chinese";
                    break;
                case 1440:
                    $e = "This is not Vcoin App.";
                    break;

                    break;
                case 1504:
                    $e = "Token is required for authentication.";
                    break;
                case 1509:
                    $e = "App key is needed.";
                    break;
                case 1505:
                    $e = "Invalid authentication token. Use the `generate_token` Auth API method.";
                    break;
                case 1508:
                    $e = "Unmatched App Key, please go back and double check.";
                    break;
                case 1099:
                    $e = "產品已換領完畢";
                    break;
                case 1610:
                    $e = "產品已換領完畢";
                    break;
                case 77001:
                    $e = "你已成功下載 ";
                    break;
                case 77002:
                    $e = "你已賺取 VCoin";
                    break;
                case 77003:
                    $e = "你己完成";
                    break;
                case 77004:
                    $e = "你已在達到 之中 的獎賞";
                    break;

            }
        }

        if ($this->lang == "en") {
            switch ((int)$code) {
                case 770105:

                    break;
            }
        }

        if ($this->lang == "ja") {
            switch ((int)$code) {
                case 770105:

                    break;
            }
        }

        return $e;
    }

} 