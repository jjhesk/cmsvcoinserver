<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年9月4日
 * Time: 下午12:57
 */
abstract class listBase
{
    protected $list_result = array();
    protected $filter_keys_setting = 0;
    protected $category_list_type;
    protected $app_comment, $app_redemption;

    function __destruct()
    {
        $this->app_comment = NULL;
        $this->app_redemption = NULL;
    }

    protected function display_images($key, $id)
    {
        try {
            $list = get_post_meta($id, $key, false);
            if (count($list) > 0) {
                return $this->get_image($list[0]);
            } else {
                return "";
            }
        } catch (Exception $e) {
            return "";
        }
    }

    protected function get_image($image_id)
    {
        $attachment = wp_get_attachment_image_src((int)$image_id, 'original');
        return $attachment[0];
    }

    protected function doQuery($input_config)
    {

        $custom = new WP_Query($input_config);
        if (isset($_REQUEST["unittestdev"])) {
            inno_log_db::log_admin_coupon_management(-1, 13921, print_r($input_config, true));
        }

        if ($custom->have_posts()) :
            while ($custom->have_posts()) : $custom->next_post();
                try {
                    $h = $this->inDaLoop($custom->post->ID);
                    $this->list_result[] = $h;
                } catch (Exception $e) {

                }
            endwhile;
            wp_reset_postdata();
        else:
            throw new Exception("no data found", 1019);
        endif;
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

    protected function listCatBySimple($taxonomy_id, $args = array())
    {
        $terms_array = get_terms($taxonomy_id, $args);
        $this->generateList($terms_array, $taxonomy_id, $args);
    }

    /**
     * this is the complex listing of the list cate and taxonomy handler
     *
     * @param $taxonomy_id
     * @param $country_cat
     * @param $country_term_id
     * @param array $query_tax_preset
     * @param $post_type
     * @internal param null $country_cat_id
     */
    protected function listCateBy($taxonomy_id, $country_cat, $country_term_id, $query_tax_preset = array(), $post_type)
    {
        /* if (strtolower($taxonomy_id) == "category") {
             $terms_array = get_terms($taxonomy_id, $query_tax_preset);

                         $taxonomy_ids = array();
                         foreach ($terms_array as $obj) {
                             $taxonomy_ids[] = $obj->term_id;
                         }
                         $get_terms = new get_terms_cpt($taxonomy_ids,VPRODUCT);
                         $array_terms = $get_terms->get_terms_with_cpt();

               $array_terms = get_terms_cpt::postTypeTaxonomy("category", $country_cat_id, VPRODUCT, $query_tax_preset);
         } else {
              $array_terms = get_terms($taxonomy_id, $query_tax_preset);
         }*/

        $array_terms = get_terms_cpt::postTypeTaxonomy($taxonomy_id, $country_cat, $country_term_id, $post_type, $query_tax_preset);

        $this->generateList($array_terms, $taxonomy_id, $query_tax_preset);
    }

    private function generateList($array_terms, $taxonomy_id, $query_tax_preset)
    {
        foreach ($array_terms as $cat) :
            $this->list_result[] = $this->catloop($cat, isset($query_tax_preset["with_image"]) == true,
            strtolower($taxonomy_id) == "category" || strtolower($taxonomy_id) == "appandroid" || strtolower($taxonomy_id) == "appcate"
                , $taxonomy_id);
        endforeach;
        if (isset($_REQUEST["lang"]))
            $this->list_result[] = $this->all_button_initiate($taxonomy_id, $_REQUEST["lang"]);
        else
            $this->list_result[] = $this->all_button_initiate($taxonomy_id, "en");
    }

    protected function all_button_initiate($taxonomy_id, $lang = "en")
    {
        return array(
            "unpress" => "",
            "press" => "",
            "unpress_s" => "",
            "press_s" => "",
            "name" => "",
            "id" => -1,
        );
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
            $term = get_term_by("id", $cat->term_id, $taxonomy_id);
            $cat_name = taxonomy_develop::clean_term_name($term->name);
        } else {
            $text = trim(wp_kses(term_description($cat->term_id, $taxonomy_id), array()));
            $desc = str_replace('\n', "", $text);
        }

        if ($this->filter_keys_setting === 1) {
            return array(
                "name" => trim($cat_name),
                "countrycode" => $desc
            );
        } else {
            if ($image) {
                return array(
                    "unpress" => z_taxonomy_image_url($cat->term_id),
                    "press" => z_taxonomy_image_url($cat->term_id, 2),
                    "unpress_s" => z_taxonomy_image_url($cat->term_id, 3),
                    "press_s" => z_taxonomy_image_url($cat->term_id, 4),

                    "name" => trim($cat_name),
                    "description" => $desc,
                    "id" => intval($cat->term_id),
                );
            } else {
                return array(
                    "name" => trim($cat_name),
                    "description" => $desc,
                    "id" => intval($cat->term_id),
                );
            }
        }
    }
}