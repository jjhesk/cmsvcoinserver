<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月25日
 * Time: 下午5:03
 */
class vtd_logic
{
    private $_term_id;
    protected $db;
    protected $transaction_table;
    private $use_wpml;

    public function __construct()
    {
        global $wpdb;
        $this->_term_id = $_GET["tag_ID"];
        $this->db = $wpdb;
        $this->terms = $this->db->terms;
        $this->use_wpml = $this->wpml_existence();
    }

    private function wpml_existence()
    {
        return defined('ICL_LANGUAGE_NAME');
    }

    public function get_switch_status($id = null)
    {
        $L = "SELECT term_display FROM $this->terms WHERE term_id=%d";
        $L = $this->db->prepare($L, isset($id) ? (int)$id : (int)$this->_term_id);
        return intval($this->db->get_var($L));
    }

    public function update_switch_status($id, $status, $taxonomy)
    {
        if ($this->use_wpml) {
            $languages = icl_get_languages('skip_missing=1');
            $ids = "";
            $ids_array = array();
            foreach ($languages as $language) {
                array_push($ids_array, icl_object_id($id, $taxonomy, true, $language['language_code']));
            }
            $ids .= join(",", $ids_array);

            $query = $this->db->prepare("UPDATE $this->terms SET term_display=%d
                where term_id in ($ids)", (int)$status);
            $this->db->query($query);
        } else {
            $this->db->update($this->terms, array("term_display" => (int)$status), array("term_id" => (int)$id));
        }
    }

    private function getId()
    {
        return $this->_term_id;
    }

    public static function do_enqueue_script()
    {
        wp_register_script('switcher', VTDURL . "/js/switcher.js", array(), '1', 'screen');
        wp_register_script('admin_cat', VTDURL . "/js/admin_cat.js", array('switcher'), '1.0', false);
        wp_enqueue_script('admin_cat');

        wp_register_style('switcher_style', VTDURL . "/css/switcher.css", array(), '1', 'screen');
        wp_enqueue_style('switcher_style');
    }
} 