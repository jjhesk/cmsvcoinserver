<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月25日
 * Time: 下午2:48
 */
//namespace pack;

class vtd_filter
{
    public static function _get_terms_args($args, $taxonomies)
    {
        return ($args);
    }

    public static function get_terms_orderby($orderby, $args)
    {
        //make sure the requested orderby follow the original args data
        if ($args['orderby'] == 'term_display')
            $orderby = 't.term_display';

        return $orderby;
    }

    public static function _terms_clauses($pieces, $taxonomies, $args)
    {
        $options = get_option('taxonomy_display_options');

        //if admin make sure use the admin setting
        if (is_admin()) {
            if ($options['adminsort'] == "1")
                $pieces['orderby'] = 'ORDER BY t.term_display';
            return $pieces;
        }

        if (count($taxonomies) == 1) {
            //check the current setting for current taxonomy
            $taxonomy = $taxonomies[0];
            $order_type = (isset($options['taxonomy_settings'][$taxonomy]['order_type'])) ? $options['taxonomy_settings'][$taxonomy]['order_type'] : 'manual';

            //if manual
            if ($order_type == 'manual') {
                //if autosort, then force the term_order
                if ($options['autosort'] == 1) {
                    $taxonomy_info = get_taxonomy($taxonomy);

                    //check if is hierarchical
                    if ($taxonomy_info->hierarchical !== TRUE) {
                        $pieces['orderby'] = 'ORDER BY t.term_display';
                    } else {
                        //customise the order
                        global $wpdb;

                        $query_pieces = array('fields', 'join', 'where', 'orderby', 'order', 'limits');
                        foreach ($query_pieces as $piece)
                            $$piece = isset($pieces[$piece]) ? $pieces[$piece] : '';

                        $pieces['orderby'] = 'ORDER BY t.term_display';
                        /*
                                                $pieces['where'] .= " AND term_display=1";
                                                inno_log_db::log_admin_stock_management(-1, 222222, print_r($pieces['where'], true));*/

                        $query = "SELECT " . $pieces['fields'] . " FROM $wpdb->terms AS t " . $pieces['join'] . " WHERE " . $pieces['where'] . " " . $pieces['orderby'] . " " . $pieces['order'] . " " . $pieces['limits'];
                        $results = $wpdb->get_results($query);

                        $children = atto_get_term_hierarchy($taxonomy);

                        $parent = isset($args['parent']) && is_numeric($args['parent']) ? $args['parent'] : 0;
                        $terms_order_raw = to_process_hierarhically($taxonomy, $results, $children, $parent);
                        $terms_order_raw = rtrim($terms_order_raw, ",");

                        if (!empty($terms_order_raw))
                            $pieces['orderby'] = 'ORDER BY FIELD(t.term_id, ' . $terms_order_raw . ')';

                    }
                    $pieces['where'] .= " AND term_display=1";
                    return $pieces;
                }
                $pieces['where'] .= " AND term_display=1";
                //no need to continue; return original order
                return $pieces;
            }

            //if auto
            $auto_order_by = isset($options['taxonomy_settings'][$taxonomy]['auto']['order_by']) ? $options['taxonomy_settings'][$taxonomy]['auto']['order_by'] : 'name';
            $auto_order = isset($options['taxonomy_settings'][$taxonomy]['auto']['order']) ? $options['taxonomy_settings'][$taxonomy]['auto']['order'] : 'desc';


            $order_by = "";
            switch ($auto_order_by) {
                case 'default':
                    return $pieces;
                    break;

                case 'id':
                    $order_by = "t.term_id";
                    break;
                case 'name':
                    $order_by = 't.name';
                    break;
                case 'slug':
                    $order_by = 't.slug';
                    break;
                case 'count':
                    $order_by = 'tt.count';
                    break;

                case 'random':
                    $order_by = 'RAND()';
                    break;
            }

            $pieces['orderby'] = 'ORDER BY ' . $order_by;
            $pieces['order'] = strtoupper($auto_order);

            $pieces['where'] .= " AND term_display=1";
            return $pieces;
        } else {


            //if autosort, then force the term_order
            if ($options['autosort'] == 1) {
                $pieces['orderby'] = 'ORDER BY t.term_display';

                $pieces['where'] .= " AND term_display=1";
                return $pieces;
            }
        }
    }
} 