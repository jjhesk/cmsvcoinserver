<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年10月16日
 * Time: 下午1:01
 */
class SingleRewardExt extends SingleBase
{
    protected $address_table;


    /**
     * get an array of IDs from the stock count table according to $this->post_id (stock ID)
     */
    private function get_stock_row($schema)
    {
        $this->stock_operation = new StockOperation();
        return $this->stock_operation->list_stock_data_v2((int)$this->post_id, $schema);
    }

    /**
     * get the addresses please
     * @return mixed
     */
    private function get_address()
    {
        $address_ids = explode(",", get_post_meta($this->post_id, "assign_location_ids", true));
        $this->address_table = $this->db->prefix . "stock_address";
        $k_list = array();
        foreach ($address_ids as $id) {
            $prepared = $this->db->prepare("SELECT * FROM $this->address_table WHERE ID=%d", (int)$id);
            $R = $this->db->get_row($prepared);
            if (isset($_REQUEST["lang"])) {
                if ($_REQUEST["lang"] == "ja") {
                    $k_list[$id] = $R->ja;
                } else if ($_REQUEST["lang"] == "zh") {
                    $k_list[$id] = $R->zh;
                } else if ($_REQUEST["lang"] == "en") {
                    $k_list[$id] = $R->en;
                } else {
                    $k_list[$id] = $R->en;
                }
            } else  $k_list[$id] = $R->en;
        }
        return $k_list;
    }

    /**
     * this is the type
     * @param $type
     * @return bool
     */
    protected function isType($type)
    {
        return $type == VPRODUCT;
    }

    /**
     * list the reward of the details
     * @return mixed
     */
    public function list_reward_details()
    {
        return $this->content;
    }

    /**
     * query this object
     * @return array
     */
    protected function queryobject()
    {
        $stock_id = intval(get_post_meta($this->post_id, "stock_id", true));
        if (strtolower(get_post_meta($this->post_id, "ext_v2", true) == "na")) {
            $architecture = "simple";
            $this->stock_operation = new StockOperation();
            list($ext_output, $totalcount) = $this->stock_operation->list_stock_data_v1((int)$this->post_id);

        } else {
            $architecture = "complex";
            $ext_structure = $this->get_structure();
            list($ext_output, $totalcount) = $this->get_stock_row($ext_structure);
        }
        $addresses = $this->get_address();
        $distribution = get_post_meta($this->post_id, "stock_system_type", true) == "perpetual" ? "CENTRAL" : "DECEN";
        return get_defined_vars();
    }

}