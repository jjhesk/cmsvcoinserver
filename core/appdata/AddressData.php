<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年12月18日
 * Time: 下午4:49
 */
class AddressData
{
    private $address_table, $result_stock_row, $result_address_row, $address_format;
    private $status_method, $zh_address_list, $en_address_list;

    public function __construct($_stock_row_id)
    {
        global $wpdb;
        $this->db = $wpdb;
        $this->address_table = $this->db->prefix . "stock_address";
        $this->stock_count = $this->db->prefix . "stock_count";
        $prep = $wpdb->prepare("SELECT * FROM $this->stock_count WHERE ID=%d", (int)$_stock_row_id);
        $this->result_stock_row = $wpdb->get_row($prep);

        $this->getAddressRow($this->result_stock_row->location_id);
        $this->status_method = "decentralize";

        $this->address_format = "(%s) %s";
    }

    private function getAddressRow($address_id)
    {
        $prep = $this->db->prepare("SELECT * FROM $this->address_table WHERE ID=%d", (int)$address_id);
        $this->result_address_row = $this->db->get_row($prep);
    }

    /**
     * once it set the stock_id to be centralized. There should be able to get all the location address ids from the stock ID
     * with the array of the address id to find the chinese and english labels.
     * @param $stock_id
     */
    public function set_method_centralize($stock_id)
    {
        $this->status_method = "centralized";
        $address_ids = explode(",", get_post_meta($stock_id, "assign_location_ids", true));
        foreach ($address_ids as $id) {
            $this->getAddressRow($id);
            $this->zh_address_list[] = $this->calladdressZH();
            $this->en_address_list[] = $this->calladdressEN();
        }
    }

    private function calladdressEN()
    {
        return sprintf($this->address_format, $this->result_address_row->short_en, $this->result_address_row->en);

    }

    private function calladdressZH()
    {
        return sprintf($this->address_format, $this->result_address_row->short_zh, $this->result_address_row->zh);
    }

    public function get_zh_address()
    {

        if ($this->status_method == "decentralize")
            return $this->calladdressZH();
        else
            return implode("<br>", $this->zh_address_list);
    }


    public function get_en_address()
    {
        if ($this->status_method == "decentralize")
            return $this->calladdressEN();
        else
            return implode("<br>", $this->en_address_list);
    }


    public function phone()
    {
        return $this->result_address_row->contact_number;
    }

    public function sms_number()
    {
        return $this->result_address_row->terminal;
    }
} 