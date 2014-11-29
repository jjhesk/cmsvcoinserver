<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月28日
 * Time: 上午11:34
 */
class SingleApp extends SingleBase
{
    protected $comment;

    /**
     * get an array of IDs from the stock count table according to $this->post_id (stock ID)
     */
    private function get_stock_row()
    {
        $this->stock_operation = new StockOperation();
        return $this->stock_operation->list_stock_data($this->post_id);
    }

    /**
     * @return array
     */
    public function list_reward_details()
    {
        return $this->content;
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
        $developer_name = get_post_meta($this->post_id, "_developer_name", true);
        $app_name = get_post_meta($this->post_id, "_appname", true);
        $app_key = get_post_meta($this->post_id, "_appkey", true);
        $coin = intval(get_post_meta($this->post_id, "price", true));
        $images_list_str = get_post_meta($this->post_id, "_screen_shot", true);
        $app_key = get_post_meta($this->post_id, "_appkey", true);
        $screenshot = $images_list_str == "" ? array() : explode(";_;", $images_list_str);
        /*
         *
        $image_banner = $this->get_product_image("inno_image_banner");

        $image_small_thumb = $this->get_product_image("inno_image_thumb");
        $image_video_cover = $this->get_product_image("inno_video_cover_image");*/
        $country = $platform == 'ios' ? $this->get_terms("countryios_nd") : $this->get_terms("countryandroid");
        $category = $platform == 'ios' ? $this->get_terms("appcate") : $this->get_terms("appandroid");
        $image_slider = $this->get_image_series("inno_image_slider");

        $this->app_comment = new AppComment($this->post_id);
        $comment = $this->app_comment->default_comment();
        $comment_count = $this->app_comment->get_count();
        $share_count = $this->app_comment->get_share_count();
        $download_count = intval(get_post_meta($this->post_id, "dl_count", true));

        unset($images_list_str);
        return get_defined_vars();
    }
} 