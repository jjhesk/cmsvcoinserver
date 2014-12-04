<?php

/*
  Controller name: Crosscms
  Controller description: Cross CMS controller. <br>Only for the signals from the auth cms <br> Hesk
 */
if (!class_exists('JSON_API_Crosscms_Controller')) {
    class JSON_API_Crosscms_Controller
    {
        /**
         * add the new submission for approval on application
         */
        public static function addnewapp()
        {
            global $json_api, $current_user;
            try {
                $result = app_host::add_new_app($json_api->query);
                api_handler::outSuccessDataWeSoft($result);
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management($current_user->ID, $e->getCode(), $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * remove the application from the dead mode
         */
        public static function remove_app_dead()
        {
            global $json_api;
            try {
                app_host::remove_dead_app($json_api->query);
                api_handler::outSuccess();
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management(-1, $e->getCode(), $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * change the application's status from beta to launched
         */
        public static function change_beta_to_launched()
        {
            global $json_api;
            try {
                app_host::beta_to_alive($json_api->query);
                api_handler::outSuccess();
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management(-1, $e->getCode(), $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * change the application's status from alive to dead
         */
        public static function change_app_status_alive_to_dead()
        {
            global $json_api;
            try {
                app_host::alive_to_dead($json_api->query);
                api_handler::outSuccess();
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management(-1, $e->getCode(), $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * change the application's status from dead to alive
         */
        public static function change_app_status_dead_to_alive()
        {
            global $json_api;
            try {
                app_host::dead_to_alive($json_api->query);
                api_handler::outSuccess();
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management(-1, $e->getCode(), $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * adding count for apps from another cms server api
         */
        public static function add_count_4_app()
        {
            global $json_api, $current_user;
            $post_id = $json_api->query->pid;
            $type = $json_api->query->type;
            if ($type == 'comment') app_host::update_comment_count($post_id);
            if ($type == 'share') app_host::update_share_count($post_id);
            if ($type == 'download') app_host::update_download_count($post_id);
            return api_handler::outSuccess(true);
        }


        /**
         * provided for the app to submit comment about the application
         */
        public static function makingcomment()
        {
            global $json_api;

            $Q = $json_api->query;
            try {
                $comment = new AppComment($Q->object_id);
                $comment->add_new_comment(
                    $Q->object_id,
                    $Q->userid,
                    $Q->comment,
                    $Q->name
                );

                api_handler::outSuccess();
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function remove_comment()
        {
            global $json_api;

            $Q = $json_api->query;
            try {
                $comment = new AppComment($Q->comment_id);
                $comment->remove($Q);
                api_handler::outSuccess();
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function flagcomment()
        {
            global $json_api;

            $Q = $json_api->query;
            try {

                $comment = new AppComment($Q->comment_id);
                $comment->flag(
                    $Q->comment_id,
                    $Q->flag
                );

                api_handler::outSuccess();
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }


        /**
         *
         */
        public static function redeemrewardsubmission()
        {
            global $wpdb, $json_api;
            try {
                $t = new Redemption();
                $t->submission($json_api->query);
                api_handler::outSuccessDataWeSoft($t->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         *
         */
        public static function redeemcoupon()
        {
            global $json_api;
            try {
                $t = new Redemption();
                $response = $t->redeem_coupon($json_api->query);
                api_handler::outSuccessDataWeSoft($response);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * this api is to obtain the items from the pending list.
         */
        public static function redeemobtain_user_scan()
        {
            global $json_api;
            try {
                $t = new Redemption();
                $t->redeemobtain_user_scan($json_api->query);
                api_handler::outSuccessDataWeSoft($t->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * this api is to obtain the items from the pending list.
         */
        public static function redeemobtain_vendor_scan_simple()
        {
            global $json_api;
            try {
                $t = new Redemption();
                $t->redeemobtain_vendor_scan($json_api->query);
                api_handler::outSuccessDataWeSoft($t->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * this api is to obtain the items from the pending list.
         */
        public static function redeemobtain_vendor_scan_two_step()
        {
            global $json_api;
            try {
                $t = new Redemption();
                $t->redeemobtain_vendor_scan_advanced($json_api->query);
                api_handler::outSuccessDataWeSoft($t->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function get_claim_history_rewards()
        {

            global $json_api, $wpdb;
            try {
                $Q = $json_api->query;
                // if (!isset($Q->type)) throw new Exception("query type is missing.", 1001);
                $transaction_table = $wpdb->prefix . "post_redemption";
                $additional_query = "";

                if (isset($Q->stock_id))
                    $additional_query .= " AND stock_id=" . $Q->stock_id;

                if (isset($Q->distribution))
                    $additional_query .= " AND distribution='" . $Q->distribution . "'";

                if (isset($Q->vcoin))
                    $additional_query .= " AND vcoin=" . $Q->vcoin;

                if (isset($Q->address))
                    $additional_query .= " AND address=" . $Q->address;

                if (isset($Q->obtained)) {
                    $k = intval($Q->obtained) == 2 ? 0 : 1;
                    $additional_query .= " AND obtained=" . $k;
                }

                if (!isset($Q->user_id)) {
                    throw new Exception("user Id is not provided", 1077);
                }
                $SQL = $wpdb->prepare("SELECT * FROM $transaction_table WHERE user=%d $additional_query ORDER BY time DESC", (int)$Q->user_id);
                $results = $wpdb->get_results($SQL);
                $__array = array();
                foreach ($results as $D) {
                    try {
                        $reward = new SingleRewardHistory($D->stock_id);
                        $__array[] = array(
                            "user" => intval($D->user),
                            "amount" => intval($D->vcoin),
                            "trace_id" => $D->trace_id,
                            "qr_a" => $D->qr_a,
                            "qr_b" => $D->qr_b,
                            "handle" => intval($D->handle_requirement),
                            "p_status" => intval($D->vstatus),
                            "c_status" => intval($D->obtained),
                            "detail" => $reward->get_result(),
                        );
                        $reward = NULL;
                    } catch (Exception $e) {

                    }
                }
                $results = NULL;

                api_handler::outSuccessDataWeSoft($__array);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * use only for web FIFO data collections.
         */
        public static function user_redemption_e_coupon_fifo()
        {
            global $json_api;
            try {
                $Q = $json_api->query;
                $n = new CouponFIFO();
                $n->get_list_submission_fifo($Q->user);
                api_handler::outSuccessDataWeSoft($n->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * use only gain prize final step
         */
        public static function user_coupon_fifo_claim()
        {
            global $json_api;
            try {
                $Q = $json_api->query;
                $n = new CouponFIFO();
                $n->claim($Q);
                api_handler::outSuccessDataWeSoft($n->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * display a list redempted e-coupon items
         */
        public static function user_redempted_e_coupon_list()
        {
            global $wpdb, $json_api;
            $Q = $json_api->query;
            $table_post = $wpdb->prefix . "post_coupon_claim";
            try {
                if (!isset($Q->user)) throw new Exception("user id is not set", 1121);
                $sql = $wpdb->prepare("SELECT * FROM $table_post WHERE redeem_agent=%d ORDER BY time(claim_time) DESC", (int)$Q->user);
                $rows = $wpdb->get_results($sql);
                $arr = array();
                if (count($rows) === 0) throw new Exception("data not found", 1091);
                foreach ($rows as $r) {
                    $post_id = (int)$r->coupon_id;
                    $vend_id = (int)get_post_meta($post_id, "innvendorid", true);
                    $arr[] = array(
                        "status" => (int)$r->vstatus,
                        "claim_time" => $r->claim_time,
                        "vcoin_expense" => (int)$r->coin_spent,
                        "client_coupon_code" => $r->client_redeem_code,

                        "detail" => array(
                            "ID" => $post_id,
                            "vendor_id" => $vend_id,
                            "vendor_name" => get_the_title($vend_id),
                            "title" => get_the_title($post_id),
                            "exp_date" => get_post_meta($post_id, "inn_exp_date", true),
                            "image_sq_thumb" => RCoupon::get_display_images("inno_image_thumb", $post_id),
                            "video_image_cover" => RCoupon::get_display_images("inno_video_cover_image", $post_id),
                        )
                    );
                }
                unset($rows);
                /**
                 *  public static function e_coupon_cate_group()
                 * {
                 * $h = new self();
                 * return $h->catloop(get_the_category_by_ID(1905), true, false, "category");
                 * }
                 */
                api_handler::outSuccessDataWeSoft($arr);
                /*api_handler::outSuccessDataWeSoft(array(
                    "list" => $arr,
                    "cate" => SingleCate::catloop(get_the_category_by_ID(1905), true, false, "category")
                ));*/
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * cms use only
         */
        public static function get_developer_related_app_ids()
        {
            global $wpdb, $json_api;
            $postmeta_table = $wpdb->prefix . "postmeta";
            $iquery = $wpdb->prepare("SELECT post_id FROM $postmeta_table WHERE meta_key=%s
                                                AND meta_value=%d", "_developer", $json_api->query->id);
            $total_apps = $wpdb->get_results($iquery);
            api_handler::outSuccessDataWeSoft($total_apps);
        }

        /**
         * get app post ID
         */
        public static function get_app_post_id()
        {
            global $wpdb, $json_api;
            $post_table = $wpdb->prefix . "posts";
            $iquery = $wpdb->prepare("SELECT ID FROM $post_table WHERE post_status=%s",
                $json_api->query->post_status);

            $all_pending_apps = $wpdb->get_results($iquery);

            api_handler::outSuccessDataWeSoft($all_pending_apps);
        }

        public static function get_transaction_history()
        {

        }

        public static function reward_transaction_metadata()
        {
            global $wpdb, $json_api;
            try {
                $Q = $json_api->query;
                $uuid_key = get_post_meta($Q->post_id, "uuid_key", true);
                $coin = (int)get_post_meta($Q->post_id, "v_coin_payout", true);
                if ($coin === 0) throw new Exception("the payout coin is zero", 10992);
                api_handler::outSuccessDataWeSoft(array(
                    "uuid" => $uuid_key,
                    "amount" => $coin
                ));
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }
    }
}