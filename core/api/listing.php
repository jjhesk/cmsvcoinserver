<?php
/*
  Controller name: Listing
  Controller description: API listing for Mobile App use. <br>Author: Hesk
 */

if (!class_exists('JSON_API_Listing_Controller')) {
    class JSON_API_Listing_Controller
    {

        /**
         * API Name: search listing
         */
        public static function search()
        {
            global $json_api;
            try {
                $search = new SearchList($json_api->query);
                api_handler::outSuccessDataWeSoft($search->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * API Name: general app listing
         */
        public static function apps()
        {
            global $json_api;
            try {
                $applist = new AppList($json_api->query);
                api_handler::outSuccessDataWeSoft($applist->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * API Name: reward listing
         */
        public static function rewards()
        {
            global $json_api;
            try {
                $reward_listing = new RewardListing($json_api->query);
                api_handler::outSuccessDataWeSoft($reward_listing->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }


        /**
         * API Name: coupon listing
         */
        public static function coupons()
        {
            global $json_api;
            $query = $json_api->query->query;
            $param = explode(".", $query);
            $arr = array();
            try {
                if (!isset($param[0])) $extension = $param[0];
                if (!isset($param[1])) $location = $param[1];
                if (!isset($param[2])) $stock_id = $param[2];
                $reward_coupon = new RCoupon($arr);
                api_handler::outSuccessDataWeSoft($reward_coupon->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * API Name: the list of the countries and their IDs
         */
        public static function country()
        {
            global $json_api;
            try {
                $query = $json_api->query;
                $platform_countries = "";
                if (isset($query->platform)) {
                    if ($query->platform == 'android') {
                        $platform_countries = 'countryandroid';
                    } else if ($query->platform == 'ios') {
                        $platform_countries = 'countryios_nd';
                    }
                } else {
                    //that is the countries for the post type rewards
                    $platform_countries = 'country';
                }
                $cat_list = new ListTax(array(
                    'type' => APPDISPLAY,
                    'child_of' => 0,
                    'parent' => '',
                    'orderby' => 'name',
                    'order' => 'ASC',
                    'hide_empty' => 0,
                    'hierarchical' => 1,
                    'exclude' => '',
                    'include' => '',
                    'number' => '',
                    'taxonomy' => $platform_countries,
                    'pad_counts' => false
                ));
                $cat_list->listCountry();
                api_handler::outSuccessDataWeSoft($cat_list->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function category()
        {
            try {
                global $json_api;
                $query = $json_api->query;
                $cat_list = new ListTax();
                $cat_list->getRequest($query);
                api_handler::outSuccessDataWeSoft($cat_list->getResultArr());
                throw new Exception("type key is missing.. ", 1001);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }

        }

        /**
         * API Name: top_sliders
         */
        public static function top_sliders()
        {
            global $json_api;
            try {

                $slider = new SliderList();
                $slider->get_slider_in_cat($json_api->query);
                api_handler::outSuccessDataWeSoft($slider->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * API Name: api get sliders
         */
        public static function _app_slider()
        {
            $msg = "there are no sliders found";
            $data = vslider::getSliderList('_app_slider');
            if ($data):
                api_handler::outSuccessDataWeSoft($data);
            else :
                //  api_account::loginfail(400, $msg);
                api_handler::outFail(400, $data);
            endif;
        }


        /**
         * API Name: api get sliders
         */
        public static function _reward_slider()
        {
            $msg = "there are no sliders found";
            $data = vslider::getSliderList('_reward_slider');
            if ($data):
                api_handler::outSuccessDataWeSoft($data);
            else :
                //  api_account::loginfail(400, $msg);
                api_handler::outFail(400, $data);
            endif;
        }

        /**
         * API Name: api get reward sliders
         */
        public static function slider()
        {
            global $json_api;

            try {
                $arr = array();

                if (!isset($json_api->query->cat)) {
                    $category = $json_api->query->cat;
                    $arr['category__in'] = $category;
                }

                if (!isset($json_api->query->country)) {
                    $country = $json_api->query->country;
                    //  $arr['category__in'] = $category;
                }

                $reward_listing = new RewardListing($arr);
                api_handler::outSuccessDataWeSoft($reward_listing->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
            /*   return array(
                   "result" => "success",
                   "data" => array_values(vslider::preset_sliders()
                   ));*/
        }

        /**
         * API Name: api get reward sliders
         */
        public static function slider_reward()
        {
            try {
                api_handler::outSuccessDataWeSoft(array_values(vslider::preset_sliders()));
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * to display the country for the user
         */
        public static function country_codes_for_user()
        {
            try {
                $cat_list = new ListTax(array(
                    'child_of' => 0,
                    'parent' => '',
                    'orderby' => 'term_order',
                    'order' => 'ASC',
                    'hide_empty' => 0,
                    'hierarchical' => 1,
                    'exclude' => '',
                    'include' => '',
                    'number' => '',
                    'taxonomy' => 'country_vendor_nd',
                    'pad_counts' => false,
                ));
                $cat_list->listCountryCodes();
                api_handler::outSuccessDataWeSoft($cat_list->getResultArr());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }
    }
}