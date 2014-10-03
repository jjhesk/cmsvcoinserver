<?php
defined('ABSPATH') || exit ;

if (!class_exists('gf_api_system')) {
    class gf_api_system {
        public static function save_job_form($value, $lead, $field, $form) {

        }

        function save_job($value, $lead, $field, $form) {

            //echo '<pre>';
            //print_r($field["id"]);
            //echo '</pre>';
            //echo "|";
            if (absint($lead["form_id"]) <> 1)
                return $value;

            if (intval($field["id"]) <> 7)
                return $value;
            // echo "this is the one";
            $json = json_decode($value, TRUE);
            //  $var = '<table>%s</table>';
            // $index = '<tr><td>CD-CODE</td><td>唱片名稱</td><td>數量</td><td>價錢</td></tr>';
            $row_adata = '<div style="table-layout: auto;width:400px;display:table-row"><div style="display:table-cell; padding:3px;">%1$s</div><div style="display:table-cell; padding:3px;">%2$s</div><div style="display:table-cell; padding:3px;width:50px;">%3$s</div><div style="display:table-cell; padding:3px;width:40px;">%4$s</div></div>';
            $row_adata_index = '<div style="table-layout: auto;width:400px;display:table-row;border-bottom: 1px solid black;"><div style="display:table-cell; padding:3px;">產品號碼</div><div style="display:table-cell; padding:3px;">唱片名稱</div><div style="display:table-cell; padding:3px;width:50px;">數量</div><div style="width:40px;display:table-cell; padding:3px;">價錢</div></div>';
            $r_total = '<div style="text-align: right;padding-right: 20px;width:400px;display: block;border-top: 2px solid black;"><div style="padding:3px;">總額(不含運費) HKD %s</div></div>';
            $table_content = '';
            //$index;

            foreach ((array)$json['data'] as $key => $id) {
                if (!isset($json['volume_cart'][$id]) || !isset($json['pricelist'][$id])) {
                    continue;
                }
                $product = get_the_title($id);
                $vol = intval($json['volume_cart'][$id]);
                $priceeach = intval($json['pricelist'][$id]);
                $cd_code = get_post_meta($id, 'wsm_sku', true);
                if ($key == 0) {
                    $table_content .= $row_adata_index;
                }
                $table_content .= sprintf($row_adata, $cd_code, $product, 'x' . $vol, $priceeach);
                if ($key == count($json['data']) - 1) {
                    $table_content .= sprintf($r_total, $json['total']);
                }
            }
            return $table_content;
        }

        function __construct() {
            add_filter("gform_save_field_value", array(&$this, "save_field_value", 10, 4));
            function save_field_value($value, $lead, $field, $form) {
                return base64_encode($value);
            }

        }

    }

}
