<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月28日
 * Time: 上午11:34
 */
class SingleApp extends SingleBase
{
    /**
     * get an array of IDs from the stock count table according to $this->post_id (stock ID)
     */
    private function get_stock_row()
    {
        $j_stock_operation = new StockOperation();
        return $j_stock_operation->list_stock_data($this->post_id);
    }

    /**
     * @return array
     */
    public function list_reward_details()
    {
        $comment = new AppComment("getlist");
        $reward_details_arr = $this->content;
        $reward_details_arr["comment"] = $comment->default_comment($this->post_id);
        return $reward_details_arr;
    }

    protected function isType($type)
    {
        return $type == APPDISPLAY;
    }

    /**
     * @return array
     */
    protected function queryobject()
    {
        $title = get_the_title($this->post_id);
        $icon_url = get_post_meta($this->post_id, "_icon", true);
        $store_id = get_post_meta($this->post_id, "_storeid", true);
        $description = get_post_meta($this->post_id, "_description", true);
        $platform = get_post_meta($this->post_id, "_platform", true);
        $developer_id = intval(get_post_meta($this->post_id, "_developer", true));
        $app_name = get_post_meta($this->post_id, "_appname", true);
        $comment_count = intval(get_post_meta($this->post_id, "comment_count", true));
        $share_count = intval(get_post_meta($this->post_id, "share_count", true));
        $download_count = intval(get_post_meta($this->post_id, "dl_count", true));


        /*
         *
        $image_banner = $this->get_product_image("inno_image_banner");
        $image_slider = $this->get_product_image("inno_image_slider");
        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");*/
        $country = $platform == 'ios' ? $this->get_terms("countryios") : $this->get_terms("countryandroid");
        $category = $platform == 'ios' ? $this->get_terms("appcate") : $this->get_terms("appandroid");
        return get_defined_vars();
    }
} 