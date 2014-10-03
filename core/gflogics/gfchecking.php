<?php
/**
 * Created by PhpStorm.
 * User: hesk
 * Date: 5/24/14
 * Time: 2:21 PM
 */
defined('ABSPATH') || exit;
if (!class_exists("gfchecking")):
    class gfchecking extends gformBase
    {
        private static function outErrorCheck(Exception $e)
        {
            return array(
                "watch_order" => $e->getCode(),
                "message" => $e->getMessage()
            );
        }

        public static function check_field_exist_brNO($fields, $br_no_field_id)
        {
            global $wpdb;
            try {
                $watch_order = 0;
                foreach ($fields as $field) {
                    if ($field['id'] == $br_no_field_id) {
                        $sql = "SELECT IF(COUNT(*)>0,'T','F') FROM " . $wpdb->postmeta . " AS A RIGHT JOIN
                        " . $wpdb->posts . " AS B ON A.post_id = B.ID where A.meta_key='combrno' AND B.post_type =
                        '" . HKM_COM . "' AND A.meta_value='" . parent::getPostVal($br_no_field_id) . "'";
                        if ($wpdb->get_var($sql) == "T")
                            throw new Exception(__("This BR no has already registered, please use a different one.", HKM_LANGUAGE_PACK), $watch_order);
                    }
                    $watch_order++;
                }
                return false;
            } catch (Exception $e) {
                return self::outErrorCheck($e);
            }
        }

        public static function check_field_user_account($fields, $user_name_field_id, $email_field_id)
        {
            try {
                $watch_order = 0;
                foreach ($fields as $field) {
                    if ($field['id'] == $user_name_field_id) {
                        $check = parent::getPostVal($user_name_field_id);
                        if (username_exists($check)) throw new Exception(__("This user name is in use", HKM_LANGUAGE_PACK), $watch_order);
                    }
                    if ($field['id'] == $email_field_id) {
                        $check = parent::getPostVal($email_field_id);
                        if (email_exists($check)) throw new Exception(__("This user email is in use", HKM_LANGUAGE_PACK), $watch_order);
                    }
                    $watch_order++;
                }
                return false;
            } catch (Exception $e) {
                return self::outErrorCheck($e);
            }
        }

        public static function check_issue_dates($fields, $issue_field, $exp_field)
        {
            try {
                $watch_order = 0;
                $issue_field_val = parent::getPostVal($issue_field);
                $exp_field_val = parent::getPostVal($exp_field);
                foreach ($fields as $field) {
                    if ($field['id'] == $exp_field) {
                        if (self::GetDeltaTime($issue_field_val, $exp_field_val) < 0) {
                            throw new Exception("Expiration date is earlier than Issuance date." . $issue_field_val, $watch_order);
                        }
                    }
                    $watch_order++;
                }
                return false;
            } catch (Exception $e) {
                return self::outErrorCheck($e);
            }
        }


        public function GetDeltaTime($dtTime1, $dtTime2)
        {
            /*   $start = strtotime($dtTime1);
               $end = strtotime($dtTime2);
               DateTime::diff($start, $end);*/
            $datetime1 = new DateTime($dtTime1);
            $datetime2 = new DateTime($dtTime2);
            $interval = $datetime1->diff($datetime2);
            //  echo $interval->format('%R%a days');
            $strDeltaTime = $interval->format('%R%a');
            return intval($strDeltaTime);
        }

    }
endif;