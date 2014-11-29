<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月17日
 * Time: 下午6:02
 */
class CouponFIFO extends CouponLogic
{
    protected $result;

    public function __construct()
    {
        parent::__construct();
    }

    public function get_list_submission_fifo($me_id)
    {
        // game_type =3
        // redeem_agent = $me_id
        // claim_time = 0

        $table_post = $this->db->posts;
        $pre = $this->db->prepare("
             SELECT
                Y.ID AS post_id,
                Y.post_title AS post_name,
                T.client_redeem_code AS rdcode,
                T.claim_time AS ctime
             FROM $this->table AS T
             LEFT JOIN $table_post AS Y ON T.coupon_id=Y.ID
             WHERE T.redeem_agent=%d AND T.game_type=3", $me_id);
        inno_log_db::log_admin_coupon_management($me_id, 10011, $pre);
        $this->result = $this->db->get_results($pre);
    }

    public function claim($Q)
    {
        $pre = $this->db->prepare("SELECT COUNT(*) AS t FROM $this->winner WHERE coupon_id=%d", $Q->post_id);
        $pre2 = $this->db->prepare("SELECT COUNT(*) AS t FROM $this->winner WHERE coupon_id=%d AND code=%s", $Q->post_id, $Q->code);
        $n = (int)$this->db->get_var($pre);
        $exist = (int)$this->db->get_var($pre2);
        $m = (int)get_post_meta($Q->post_id, "stock_available_total", true);
        if ($exist > 0) {
            throw new Exception("Sorry, you have previous registered your data for this item", 9012);
        }
        if ($m > $n) {
            $this->result = array(
                "user" => $Q->user,
                "coupon_id" => $Q->post_id,
                "code" => $Q->code,
                "address" => -1,
                "idname" => $Q->id_name,
                "idcode" => $Q->hk_id,
                "cell" => $Q->phone_cell
            );
            $this->db->insert($this->winner, $this->result);
        } else throw new Exception("Sorry, the available items are all reserved or sold out", 9011);
    }

    public function get_result()
    {
        return $this->result;
    }
} 