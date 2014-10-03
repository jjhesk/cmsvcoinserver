<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年9月12日
 * Time: 下午6:31
 */
class Coupon extends SingleBase
{

    protected function queryobject()
    {
        $title = get_the_title($this->post_id);
        // foreach($addresses as $asd){}
        $expiration_date = get_post_meta($this->post_id, "inn_exp_date", true);
        $video_url = get_post_meta($this->post_id, "gift_video_url", true);
        $product_url = get_post_meta($this->post_id, "inn_product_url", true);
        $product_description = get_post_meta($this->post_id, "inn_gift_description", true);
        $tnc = get_post_meta($this->post_id, "inno_terms_conditions", true);
        $remarks = get_post_meta($this->post_id, "extra_remarks", true);
        $image_banner = $this->get_product_image("inno_image_banner");
        $image_slider = $this->get_product_image("inno_image_slider");
        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");
        $vcoin = intval(get_post_meta($this->post_id, "v_coin", true));
        //   $country = $this->get_terms("country");
        //   $category = $this->get_terms("category");
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