<?php
/**
 * Created by PhpStorm.
 * User: hesk
 * Date: 5/17/14
 * Time: 1:15 PM
 */
if (!class_exists('ui_handler')):
    class ui_handler
    {
        public function __construct()
        {

        }

        /**
         * @param $oc_template_name
         * @param array $content
         * @return string
         */
        public static function apply_oc_template_with_mustache($oc_template_name, $content = array())
        {
            $ori = get_oc_template($oc_template_name);
            return self::apply($ori, $content);
        }

        /**
         * @param $original_string
         * @param array $content
         * @return string
         */
        public static function apply($original_string, $content = array())
        {
            $m = new Mustache_Engine();
            $new_string = $m->render($original_string, $content);
            return $new_string;
        }

        /**
         * @param $result
         * @return array
         */
        public static function seralize($result)
        {
            $ar = array();
            foreach ($result as $res) {
                $ar[$res->K] = $res->V;
            }
            return $ar;
        }

        /**
         * @param array $db_query_results
         * @param $name
         * @param $default
         * @param null $id
         * @return string
         */
        public function options_ui_from_wp_query($db_query_results = array(), $name, $default, $id = null)
        {
            $series = self::seralize($db_query_results);
            return $this->ui_select_create($series, $id, $default, $name);
        }

        /**
         * @param $series
         * @param $name
         * @param $default
         * @param null $id
         * @return string
         */
        public function options_ui_from_series($series, $name, $default, $id = null)
        {
            return $this->ui_select_create($series, $id, $default, $name);
        }

        public function ui_radio_create_for_CP($label, $db_query_results, $id, $name, $checked = null)
        {
            $ui = "";
            foreach ($db_query_results as $res) {
                $content = $res->V . ' (' . $res->V2 . ')';
                $k = $res->K;
                $select_print = $checked == null ? '' : checked(intval($checked), intval($k), false);
                $button = sprintf('<a target="_BLANK" href="%s" class="button-cancel"/>%s</a>', admin_url("user-edit.php?user_id=" . $k), __("profile", HKM_LANGUAGE_PACK));
                $ui .= '<div><label class="fullwidth"><input type="radio" name="' . $name . '" value="' . $k . '" data-bind="checked: radioValue" ' . $select_print . '/><span>' . $content . '</span></label>  ' . $button . '</div>';
            }
            return $ui;
        }

        /**
         * @param $series
         * @param null $id
         * @param $default
         * @param $name
         * @return string
         */
        private function ui_select_create($series, $id = null, $default, $name)
        {
            $nid = $id == null ? '' : 'id="' . $id . '"';
            $ui = '<select ' . $nid . ' name="' . $name . '">';
            $ui .= '<option value="">' . $default . '</option>';
            foreach ($series as $k => $v) {
                $content = $v;
                $ui .= '<option value="' . $k . '">' . $content . '</option>';
            }
            $ui .= '</select>';
            return $ui;
        }

        public static function ui_select_creation($series, $id = null, $default, $name)
        {
            $nid = $id == null ? '' : 'id="' . $id . '"';
            $ui = '<select ' . $nid . ' name="' . $name . '">';
            $ui .= '<option value="">' . $default . '</option>';
            foreach ($series as $k => $v) {
                $content = $v;
                $ui .= '<option value="' . $k . '">' . $content . '</option>';
            }
            $ui .= '</select>';
            return $ui;
        }

        public static function ui_select($wpdb_result, $id = null, $default, $name)
        {
            $nid = $id == null ? '' : 'id="' . $id . '"';
            $ui = '<select ' . $nid . ' name="' . $name . '">';
            $i = 1;
            foreach ($default as $value) {
                $ui .= '<option value="'.-$i.'">' . $value . '</option>';
                $i++;
            }
            foreach ($wpdb_result as $k => $v) {
                foreach ($v as $key => $j) {
                    $content = $j;
                    $ui .= '<option value="' . $k . '">' . $content . '</option>';
                }
            }
            $ui .= '</select>';
            return $ui;
        }
    }
endif;