<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月28日
 * Time: 上午11:37
 */
abstract class SingleBase
{

    protected $post_id, $lang, $content;

    public function __construct($ID)
    {
        $this->post_id = $ID;
        $this->content = $this->queryobject();

        if (isset($_GET['lang']))
            $this->lang = $_GET['lang'];

        if (!$this->isType(get_post_type($this->post_id))) throw new Exception("post type check failed. this object_id is not valid for this post type or this id is not exist", 1047);
    }

    protected function isType($type)
    {
        return true;
    }

    abstract protected function queryobject();

    protected function get_terms($tax)
    {
        $terms = $tax == "category" ? get_the_category($this->post_id) : get_the_terms($this->post_id, $tax);
        return $terms;
    }

    /**
     * wordpress: wp_get_attachment_image_src
     * @param $key
     * @return mixed
     */
    protected function get_product_image($key)
    {
        $list = get_post_meta($this->post_id, $key, true);
        // inno_log_db::log_stock_count(-1, 19000, "display attachment ID -> int? " . $list);
        $optionpost = wp_get_attachment_image_src($list, 'large');
        return $optionpost[0];
    }
} 