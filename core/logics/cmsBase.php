<?php
/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月12日
 * Time: 下午3:42
 */
defined('ABSPATH') || exit;

abstract class cmsBase
{
    protected $panel_metabox;
    protected $titan;
    protected $post_type;

    public function __construct()
    {
        $this->titan = TitanFramework::getInstance('vcoinset');
    }

    public function __destruct()
    {
        $this->titan = NULL;
        $this->post_type = NULL;
    }

    abstract protected function add_tab();

    abstract public function addRWMetabox($meta_boxes);

    abstract protected function addAdminSupportMetabox();

    protected static function withUpdateFieldN($postid, $name_field_from_post, $val)
    {
        if (isset($_POST[$name_field_from_post]))
            update_post_meta($postid, $name_field_from_post, $val, get_post_meta($postid, $name_field_from_post, true));
    }

    /**
     * @param $post_id
     * @throws Exception
     */
    protected static function create_vcoin_merchant_account($post_id)
    {
        if (!isset($_POST['innvendorid'])) throw new Exception("vendor id is not presented", 50211);
        if (!isset($_POST['post_title'])) throw new Exception("post title is not presented", 50212);
        /**
         * VCoin account UUID
         */
        $vendor_id = $_POST['innvendorid'];
        $display_name = $_POST['post_title'];

        $get_uuid = api_handler::curl_posts(VCOIN_SERVER . '/api/account/createmer', array(
            "reward_id" => $post_id,
            "vendor_id" => $vendor_id,
            "displayname" => $display_name
        ), array(
            CURLOPT_TIMEOUT => 30
        ));
        $get_uuid = json_decode($get_uuid);
        if (intval($get_uuid->result) > 0) throw new Exception($get_uuid->msg, $get_uuid->result);

        //update the and save into the field for the vcoin account id
        self::withUpdateFieldN($post_id, 'uuid_key', $get_uuid->data->accountid);
        /**
         * END VCOIN SERVER INJECTION
         */
    }



    protected function isDebug()
    {
        return true;
    }

    protected function debug_field_type()
    {
        return $this->isDebug() ? "text" : "hidden";
    }

    protected static function json_decode_nice($json, $assoc = FALSE)
    {
        $json = str_replace(array("\n", "\r"), "", $json);
        $json = preg_replace('/([{,]+)(\s*)([^"]+?)\s*:/', '$1"$3":', $json);
        $json = preg_replace('/(,)\s*}$/', '}', $json);
        return json_decode($json, $assoc);
    }
}
