<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月21日
 * Time: 下午3:43
 */
class SingleReward extends SingleBase
{

    private function get_stock_row($schema)
    {
        $this->stock_operation = new StockOperation();
        return $this->stock_operation->list_stock_data_v2((int)$this->post_id, $schema);
    }

    protected function isType($type)
    {
        return $type == VPRODUCT;
    }

    public function list_reward_details()
    {
        $this->app_comment = new AppComment($this->post_id);
        $reward_details_arr = $this->content;
        $reward_details_arr["comment"] = $this->app_comment->default_comment();
        $reward_details_arr["comment_count"] = $this->app_comment->get_count();
        $reward_details_arr["redeem_count"] = 0;
        return $reward_details_arr;
    }

    public function get_sq_image()
    {
        return $this->get_product_image("inno_image_thumb");
    }

    protected function queryobject()
    {
        $title = get_the_title($this->post_id);
        $stock_id = (int)get_post_meta($this->post_id, "stock_id", true);
        $vendor_id = (int)get_post_meta($this->post_id, "innvendorid", true);
        $redemption_lock = (int)get_post_meta($this->post_id, "release_redemption", true);
        $vcoin_value = (int)get_post_meta($this->post_id, "v_coin", true);
        $vendor_name = get_the_title($vendor_id);
        //$distribution_type = get_post_meta($this->post_id, "stock_system_type", true);

        $isCentral = get_post_meta($this->post_id, "stock_system_type", true) == "perpetual";

        $distribution = $isCentral ? "CENTRAL" : "DECEN";
        $redemption_procedure = (int)get_post_meta($this->post_id, "redemption_procedure", true);
        $v_coin_payout = (int)get_post_meta($this->post_id, "v_coin_payout", true);

        //redemption_procedure
        $addresses = explode(",", get_post_meta($this->post_id, "assign_location_ids", true));
        // foreach($addresses as $asd){}
        $expiration_date = get_post_meta($this->post_id, "inn_exp_date", true);
        $video_url = get_post_meta($this->post_id, "gift_video_url", true);
        $product_url = get_post_meta($this->post_id, "inn_product_url", true);
        $product_description = get_post_meta($this->post_id, "inn_gift_description", true);

        $remarks = get_post_meta($this->post_id, "extra_remarks", true);
        $uuid_key = get_post_meta($this->post_id, "uuid_key", true);
        $n_day = (int)get_post_meta($this->post_id, "rdays", true);
        //   $stock_count = $this->get_stock_row();
        $image_banner = $this->get_product_image("inno_image_banner");
        $image_slider = $this->get_image_series("inno_image_slider");
        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");
        $country = $this->get_terms_images("country");
        $category = $this->get_terms_images("category");

        $tnc = messagebox::get_message_t(77017, array(
            "additional" => get_post_meta($this->post_id, "inno_terms_conditions", true)
        ));


        $note_1 = "";
        $note_2 = messagebox::get_message_t(77013, array(
            "product_name" => $title,
            "procedure" => $isCentral ? "CENTRAL" : "DECENTRAL",
            "exp_date" => $expiration_date,
            "n_day" => $n_day
        ));

        $note_3 = $isCentral ? messagebox::get_message_t(77010, array(
            "address_group" => $addresses
        )) : messagebox::get_message(77011);

        $note_4 = messagebox::get_message_t(77012, array(
            "amount" => $vcoin_value
        ));
        $note_vcoin_process = messagebox::get_message_t(77014, array("product_name" => $title));

        $share_count = (int)get_post_meta($this->post_id, "share_count", true);
        $stock_id = (int)get_post_meta($this->post_id, "stock_id", true);
        list($ext_output, $totalcount) = $this->get_stock_row($this->get_structure());

        unset($ext_output);
        unset($isCentral);
        unset($customer_wp_query);
        unset($query);
        return get_defined_vars();
    }
} 