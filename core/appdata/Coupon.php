<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年9月12日
 * Time: 下午6:31
 */
class Coupon extends SingleBase
{
    function __contruct($ID)
    {
        parent::__construct($ID);
    }

    private function get_count_claim()
    {
        $_table = $this->db->prefix . "post_coupon_claim";
        $query = $this->db->prepare("SELECT COUNT(*) FROM $_table where coupon_id=%d AND redeem_agent<>-1", $this->post_id);
        return (int)$this->db->get_var($query);
    }

    protected function queryobject()
    {
        $title = get_the_title($this->post_id);
        // foreach($addresses as $asd){}
        $expiration_date = get_post_meta($this->post_id, "inn_exp_date", true);
        $video_url = get_post_meta($this->post_id, "coupon_video_url", true);
        $product_url = get_post_meta($this->post_id, "inn_product_url", true);
        $product_description = get_post_meta($this->post_id, "inn_gift_description", true);
        $n_day = (int)get_post_meta($this->post_id, "rdays", true);
        $vendor_id = (int)get_post_meta($this->post_id, "innvendorid", true);
        $vendor_name = get_the_title($vendor_id);
        $remarks = get_post_meta($this->post_id, "extra_remarks", true);
        $uuid_key = get_post_meta($this->post_id, "uuid_key", true);
        $image_banner = $this->get_product_image("inno_image_banner");
        $image_slider = $this->get_image_series("inno_image_slider");
        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");
        $game_type = get_post_meta($this->post_id, "game_type", true);


        $_comment = new AppComment($this->post_id);
        $comment = $_comment->default_comment();
        $comment_count = $_comment->get_count();
        $v_coin_payout = (int)get_post_meta($this->post_id, "v_coin_payout", true);
        $vcoin = (int)get_post_meta($this->post_id, "v_coin", true);
        $share_count = $_comment->get_share_count();
        unset($_comment);
        $redeem_count = $this->get_count_claim();
        $country = $this->get_terms_images("country");
        $category = $this->get_terms_images("category");


        $note_77012 = messagebox::get_message_t(77012, array(
            "amount" => $vcoin
        ));

        $tnc = messagebox::get_message_t(77015, array(
            "exp_date" => $expiration_date,
            "vendor_name" => $vendor_name,
            "nday" => $n_day,
            "additional" => get_post_meta($this->post_id, "inno_terms_conditions", true)
        ));

        $note_success = messagebox::get_message_t(77016, array(
            "product_name" => $title,
            "exp_date" => $expiration_date
        ));

        return get_defined_vars();
    }

    protected function isType($type)
    {
        return $type == VCOUPON;
    }

    /**
     * @return array
     */
    public function show_detail()
    {
        return $this->content;
    }
}