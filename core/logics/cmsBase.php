<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月12日
 * Time: 下午3:42
 */
defined('ABSPATH') || exit;

abstract class cmsBase
{
    protected $panel_metabox;

    public function __construct()
    {
    }

    abstract protected function add_tab();

    abstract public static function addRWMetabox($meta_boxes);

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
        /**
         * VCoin account UUID
         */
        $vendor_id = $_POST['innvendorid'];

        $get_uuid = api_handler::curl_post(VCOIN_SERVER . '/api/account/createmer', array(
            "reward_id" => $post_id,
            "vendor_id" => $vendor_id
        ), array(
            CURLOPT_TIMEOUT => 10
        ));
        $get_uuid = json_decode($get_uuid);
        if (intval($get_uuid->result) > 0) throw new Exception($get_uuid->msg, $get_uuid->result);


        //update the and save into the field for the vcoin account id
        update_post_meta($post_id, 'uuid_key', $get_uuid->data->accountid);

        /**
         * END VCOIN SERVER INJECTION
         */
        self::syn_vcoin_action_data($get_uuid->data->accountid, $vendor_id, $post_id, 0);
    }

    /**
     * add data into the authenticate server DB table-merchants for mission triggers.
     * @param $vcoin_account_id
     * @param $vendor_id
     * @param $post_id
     * @param $nature
     * @throws Exception
     */
    private static function syn_vcoin_action_data($vcoin_account_id, $vendor_id, $post_id, $nature)
    {

        $_nature = $nature === 0 ? "REWARD" : "COUPON";
        $getresult = api_handler::curl_post(AUTH_SERVER . '/api/cms/add_merchant', array(
            "item_id" => $post_id,
            "vendor_id" => $vendor_id,
            "vcoin_account" => $vcoin_account_id,
            "nature" => $_nature
        ));

        $result = json_decode($getresult);

        if ($result->result != 'success') {
            inno_log_db::log_admin_stock_management(-1, $result->result, $result->msg);
            throw new Exception($result->msg, $result->result);
        } else {
        }

    }
}
