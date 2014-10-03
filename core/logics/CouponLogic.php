<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年9月10日
 * Time: 下午4:53
 */
class CouponLogic
{
    protected $table;

    function __construct()
    {
        global $wpdb;
        $this->table = $wpdb->prefix . "";
    }

    /**
     * check of the coupons is sufficient for the user to redeem
     *
     * @param $coupon_id
     * @return bool
     */
    private function check_sufficient_coupons($coupon_id)
    {
        global $wpdb;
        $pre = $wpdb->prepare("SELECT count(*) FROM imusicworld_transaction_coupon
             WHERE coupon_id=%d AND redeem_agent=-1", intval($coupon_id));
        $result = $wpdb->get_var($pre);
        return intval($result) > 1;
    }

    /**
     * the actual redemption mechanism for processing coupon
     * @param $user_id
     * @param $coupon_id
     * @return bool
     */
    public function do_claim_coupon($user_id, $coupon_id)
    {
        global $wpdb;
        if (!$this->check_sufficient_coupons($coupon_id)) {
            //there more no coupons can be redeem
            return false;
        } else {
            $coin_cost = intval(get_post_meta($coupon_id, "v_coin", true));

            $date = new DateTime();
            $n = intval(get_post_meta($coupon_id, 'rdays', true));
            $day = $n == 1 || $n == -1 ? "day" : "days";
            $date->modify('+' . $n . ' ' . $day);
            $exp = $date->format('Y-m-d');
            $time = current_time('mysql');
            //   inno_log_db::log_redemption_error(-m, 342422, "exp dat set:" . $exp);

            $pre = $wpdb->prepare("SELECT ID FROM imusicworld_transaction_coupon
             WHERE coupon_id=%d AND redeem_agent=-1 LIMIT 0, 1", $coupon_id);
            $available_coupon_id = intval($wpdb->get_var($pre));

            $prepared = $wpdb->prepare("
                 UPDATE imusicworld_transaction_coupon
                 SET
                 redeem_agent=%d,
                 coin_spent=%d,
                 claim_time=%s,
                 exp_date=%s
                 WHERE ID=%d",
                $user_id, $coin_cost,
                $time, $exp,
                $available_coupon_id);
            $r = $wpdb->query($prepared);

            inno_log_db::log_redemption_error(-1, 342422, "row:" . $prepared . "<br>" . print_r($r, true));

            if ($r) {
                return $this->get_coupon_record($user_id, $time, $coupon_id);
            } else {
                return false;
            }

            //   $find_row = $wpdb->get_row($prepared);

        }
    }

    protected function get_coupon_record($user_id, $time, $coupon_id)
    {
        global $wpdb;
        $prepared = $wpdb->prepare("
                            SELECT * FROM imusicworld_transaction_coupon
                            WHERE
                            redeem_agent=%d AND
                            coupon_id=%d AND
                            claim_time=%s
                            ", $user_id, $coupon_id, $time);
        $find_row = $wpdb->get_row($prepared);
        return $find_row;
    }

    /**
     * look up the transaction record with the required information
     * @param $user_id
     * @param $coupon_id
     * @param $code
     * @return mixed
     */
    protected static function find_coupon_record($user_id, $coupon_id, $code)
    {
        global $wpdb;
        $prepared = $wpdb->prepare("
                            SELECT * FROM imusicworld_transaction_coupon
                            WHERE
                            redeem_agent=%d AND
                            coupon_id=%d AND
                            client_redeem_code=%s
                            ", $user_id, $coupon_id, $code);
        $find_row = $wpdb->get_row($prepared);
        // inno_log_db::log_redemption_error(-1, 1010101, "mustach_engine context" . print_r($find_row, true) . "<br>" . $prepared);
        return $find_row;
    }

    protected static function undo_claim_coupon($ID)
    {
        global $wpdb;
        $prepared = $wpdb->prepare("
                            UPDATE imusicworld_transaction_coupon
                            SET
                            redeem_agent = '',
                            coin_spent='',
                            claim_time='',
                            exp_date=''
                            WHERE ID = %d
                            ", $ID);

        $updated = $wpdb->query($prepared);
        return true;
    }

} 