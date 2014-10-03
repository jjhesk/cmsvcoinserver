<?php
/*
  Controller name: Stock
  Controller description: Admin Backend API. <br>Author: Heskemo
 */
if (!class_exists('JSON_API_Stock_Controller')) {
    class JSON_API_Stock_Controller
    {
        /**
         * listing for the cms ajax only
         */
        public static function list_stock_count()
        {
            global $json_api;
            try {
                if (!isset($json_api->query->id)) throw new Exception("missing 0 param", 1003);
                $stock_id = $json_api->query->id;
                $j_stock_operation = new StockOperation();
                $stock = $j_stock_operation->list_stock_data($stock_id);
                api_handler::outSuccessDataTable($stock);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * for cms use only
         */
        public static function get_stock_count_id_ui()
        {
            global $json_api;
            $stock = new StockOperation();
            $result = $stock->get_stock_count_ids($json_api->query->id);

            api_handler::outSuccessData($result);
        }

        /**
         * for cms use only
         */
        public static function change_stock_count()
        {
            global $json_api;
            $stock_count_id = $json_api->query->stock_count_id;

            $new_count = $json_api->query->new_count;

            $stock = new StockOperation();
            $stock->add_count_v2($stock_count_id, $new_count);

            api_handler::outSuccessData($stock_count_id);
        }

        /**
         * server cms api output
         */
        public static function check_count_centralize()
        {
            global $json_api;
            $query = $json_api->query->query;
            $double = $json_api->query->double;
            $price = $json_api->query->price;
            $param = explode(".", $query);
            try {
                if (!isset($param[0])) throw new Exception("missing 0 param", 1003);
                $extension = $param[0];
                if (!isset($param[1])) throw new Exception("missing 1 param", 1004);
                $stock_id = $param[1];

                $j_stock_operation = new StockOperation();
                $pricematched = $j_stock_operation->checkprice($stock_id, $price);
                $stock = $j_stock_operation->check_count($stock_id, -1, $extension, false);
                $stock_meta_data = $j_stock_operation->get_list_of_stock_meta($stock_id);
                api_handler::outSuccessData($stock_meta_data);

            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * server cms api output
         * @throws Exception
         */
        public static function check_count_decentralize()
        {
            global $json_api;
            $query = $json_api->query->query;
            $double = $json_api->query->double;
            $price = $json_api->query->price;
            $param = explode(".", $query);
            try {
                if (!isset($param[0])) throw new Exception("missing 0 param", 1003);
                $extension = $param[0];
                if (!isset($param[1])) throw new Exception("missing 1 param", 1004);
                $location = $param[1];
                if (!isset($param[2])) throw new Exception("missing 2 param", 1005);
                $stock_id = $param[2];

                $j_stock_operation = new StockOperation();
                $pricematched = $j_stock_operation->checkprice($stock_id, $price);
                $stock = $j_stock_operation->check_count($stock_id, $location, $extension, false);
                $stock_meta_data = $j_stock_operation->get_list_of_stock_meta($stock_id);
                api_handler::outSuccessData($stock_meta_data);

            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * server cms api output
         */
        public static function add()
        {
            global $json_api;
            $query = $json_api->query->query;
            $param = explode(".", $query);
            try {
                if (!isset($param[0])) throw new Exception("missing 0 param", 1003);
                $stock_id = $param[0];
                if (!isset($param[1])) throw new Exception("missing 1 param", 1004);
                $location = $param[1];
                if (!isset($param[2])) throw new Exception("missing 2 param", 1005);
                $extension = $param[2];
                if (!isset($param[3])) throw new Exception("missing 3 param", 1005);
                $add_count = $param[3];
                $j_stock_operation = new StockOperation();
                $stock = $j_stock_operation->add_count($stock_id, $location, $extension, $add_count);
                api_handler::outSuccess($stock);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }


    }
}
