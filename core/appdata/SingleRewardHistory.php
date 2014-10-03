<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年9月30日
 * Time: 上午11:53
 */
class SingleRewardHistory extends SingleBase
{
    protected function isType($type)
    {
        return $type == VPRODUCT;
    }

    protected function queryobject()
    {
        $title = get_the_title($this->post_id);
        $stock_id = intval(get_post_meta($this->post_id, "stock_id", true));
        $vendor_id = intval(get_post_meta($this->post_id, "innvendorid", true));
        $vendor_name = get_the_title($vendor_id);
        $exp_date = get_post_meta($this->post_id, "inn_exp_date", true);

        // $redemption_lock = intval(get_post_meta($this->post_id, "release_redemption", true));
        // $vcoin_value = intval(get_post_meta($this->post_id, "v_coin", true));

        // $addresses_config = get_post_meta($this->post_id, "assign_location_ids", true);
        // $addresses = json_decode($addresses_config, true);

        $video_url = get_post_meta($this->post_id, "gift_video_url", true);
        $product_url = get_post_meta($this->post_id, "inn_product_url", true);
        $product_description = get_post_meta($this->post_id, "inn_gift_description", true);


        $image_banner = $this->get_product_image("inno_image_banner");
        // $image_slider = $this->get_product_image("inno_image_slider");
        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");
        $country = $this->get_terms("country");
        $category = $this->get_terms("category");
        return get_defined_vars();
    }

    public function get_result()
    {
        return $this->content;
    }
}