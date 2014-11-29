<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月7日
 * Time: 上午10:54
 */
class CouponPrizer extends listBase
{

    private $result = array();
    private $message = "";

    public function __construct($arr)
    {

        $this->result = array();
        $input_config=wp_parse_args($arr, array(
            'post_type' => VCOUPON,
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ));
        inno_log_db::log_admin_coupon_management(-1, 13921, print_r($input_config, true));

        $this->doQuery($input_config);
    }

    protected function inDaLoop($post_id, $args = array())
    {
        $tag = get_the_title($post_id);
        $message = "Item name: " . $tag . ". Lucky draw has been drawn and the lucky ones are revealed in these codes: ";
        $id = $post_id;
        unset($post_id);
        unset($args);
        unset($tag);
        return get_defined_vars();
    }
} 