<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年9月4日
 * Time: 下午12:57
 */
abstract class listBase
{
    protected $list_result = array();
    protected $filter_keys_setting = 0;

    protected function display_images($key, $id)
    {
        $list = get_post_meta($id, $key, true);
        $optionpost = wp_get_attachment_image_src($list, 'original');
        return $optionpost[0];
    }

    protected function doQuery($input_config)
    {

        $custom = new WP_Query($input_config);
        if (isset($_REQUEST["unittestdev"])) {
            inno_log_db::log_admin_coupon_management(-1, 13921, print_r($input_config, true));
        }
        if ($custom->have_posts()) :
            while ($custom->have_posts()) : $custom->the_post();
                $h = $this->inDaLoop($custom->post->ID);
                if ($h != false) {
                    $this->list_result[] = $h;
                }
            endwhile;
        endif;
        wp_reset_postdata();
    }

    abstract protected function inDaLoop($id, $args = array());

    public function getResultArr()
    {
        if (count($this->list_result) === 0) throw new Exception("no data found", 1019);

        if (isset($_REQUEST["unittestdev"])) {
            inno_log_db::log_admin_coupon_management(-1, 13922, "listing no data found");
        }
        // $this->list_result = apply_filters("final_list_result", $this->list_result, $lang, $param);

        return $this->list_result;
    }

    /**
     * this is the complex listing of the list cate and taxonomy handler
     *
     * @param $taxonomy_id
     * @param array $query_tax_preset
     */
    protected function listCateBy($taxonomy_id, $query_tax_preset = array())
    {

        if (strtolower($taxonomy_id) == "category") {
            $array_terms = get_categories(wp_parse_args(array(
                "type" => VPRODUCT
            ), $query_tax_preset));
        } else {
            $array_terms = get_terms($taxonomy_id, $query_tax_preset);
        }

        foreach ($array_terms as $cat) :
            $this->list_result[] = $this->catloop($cat, isset($query_tax_preset["with_image"]) == true, strtolower($taxonomy_id) == "category", $taxonomy_id);
        endforeach;

    }

    /**
     * get the post ID and the taxonomy ID
     * @param $tax
     * @param $post_id
     * @return mixed
     */
    protected function get_terms($tax, $post_id)
    {
        $ar = array();
        $terms = $tax == "category" ? get_the_category($post_id) : get_the_terms($post_id, $tax);
        foreach ($terms as $tt) :
            $ar[] = $this->catloop($tt, true, strtolower($tax) == "category", $tax);
        endforeach;
        return $ar;
    }

    /**
     * cate data loop
     *
     * @param $cat
     * @param bool $image
     * @param bool $isCate
     * @param $taxonomy_id
     * @throws Exception
     * @return array
     */
    private function catloop($cat, $image = false, $isCate = false, $taxonomy_id)
    {
        $image_url = "";
        if ($image && !function_exists('z_taxonomy_image_url')) {
            throw new Exception("image module not found.");
        }
        if ($isCate) {
            $desc = category_description($cat->term_id);
        } else {
            $text = trim(wp_kses(term_description($cat->term_id, $taxonomy_id), array()));
            $desc = str_replace('\n', "", $text);
        }

        if ($this->filter_keys_setting === 1) {
            return array(
                "name" => trim($cat->name),
                "countrycode" => $desc
            );
        } else {
            if ($image) {
                return array(
                    "unpress" => z_taxonomy_image_url($cat->term_id),
                    "press" => z_taxonomy_image_url($cat->term_id, 2),
                    "unpress_s" => z_taxonomy_image_url($cat->term_id, 3),
                    "press_s" => z_taxonomy_image_url($cat->term_id, 4),

                    "name" => trim($cat->name),
                    "description" => $desc,
                    "id" => intval($cat->term_id),
                );
            } else {
                return array(
                    "name" => trim($cat->name),
                    "description" => $desc,
                    "id" => intval($cat->term_id),
                );
            }
        }
    }
}