<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月21日
 * Time: 下午3:43
 */
class SingleReward extends SingleBase
{

    /**
     * get an array of IDs from the stock count table according to $this->post_id (stock ID)
     */
    private function get_stock_row()
    {
        $j_stock_operation = new StockOperation();
        return $j_stock_operation->list_stock_data($this->post_id);
    }

    protected function isType($type)
    {
        return $type == VPRODUCT;
    }

    public function list_reward_details()
    {
        $comment = new AppComment("getlist");
        $reward_details_arr = $this->content;
        $reward_details_arr["comment"] = $comment->default_comment($this->post_id);
        $reward_details_arr["comment_count"] = $comment->get_count();
        $reward_details_arr["redeem_count"] = 0;
        $reward_details_arr["share_count"] = 0;
        return $reward_details_arr;
    }

    public function get_sq_image()
    {
        return $this->get_product_image("inno_image_thumb");
    }

    protected function queryobject()
    {
        $title = get_the_title($this->post_id);
        $stock_id = intval(get_post_meta($this->post_id, "stock_id", true));
        $vendor_id = intval(get_post_meta($this->post_id, "innvendorid", true));
        $redemption_lock = intval(get_post_meta($this->post_id, "release_redemption", true));
        $vcoin_value = intval(get_post_meta($this->post_id, "v_coin", true));

        $vendor_name = get_the_title($vendor_id);
        $distribution_type = get_post_meta($this->post_id, "stock_system_type", true);
        $exten_arr = get_post_meta($this->post_id, "ext_set", false);
        $extensions = $exten_arr[0];
        $redemption_procedure = get_post_meta($this->post_id, "redemption_procedure", true);
        //redemption_procedure
        $addresses_config = get_post_meta($this->post_id, "assign_location_ids", true);
        $addresses = json_decode($addresses_config, true);
        // foreach($addresses as $asd){}
        $expiration_date = get_post_meta($this->post_id, "inn_exp_date", true);
        $video_url = get_post_meta($this->post_id, "gift_video_url", true);
        $product_url = get_post_meta($this->post_id, "inn_product_url", true);
        $product_description = get_post_meta($this->post_id, "inn_gift_description", true);
        $tnc = get_post_meta($this->post_id, "inno_terms_conditions", true);
        $remarks = get_post_meta($this->post_id, "extra_remarks", true);

        $stock_count = $this->get_stock_row();
        $image_banner = $this->get_product_image("inno_image_banner");
        $image_slider = $this->get_product_image("inno_image_slider");
        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");
        $country = $this->get_terms("country");
        $category = $this->get_terms("category");
        $note_1 = "";
        $note_2 = "";
        $note_3 = "";
        $note_4 = "";
        unset($customer_wp_query);
        unset($query);
        unset($addresses_config);
        unset($exten_arr);

        return get_defined_vars();
    }
} 