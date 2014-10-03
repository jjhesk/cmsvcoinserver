<?php
/**
 * Created by PhpStorm.
 * User: hesk
 * Date: 5/17/14
 * Time: 8:23 PM
 */
defined('ABSPATH') || exit;
if (!class_exists('adminajax')):
    class adminajax
    {
        private $controllers;

        function __construct($structure = null)
        {
            $this->controllers = $structure;
        }

        function reg_admin_ajax_control($structure = null)
        {
            if ($structure != null)
                $this->controllers = $structure;
            $this->register_admin_ajax();
            return $this;
        }

        function reg_public_ajax_control($structure = null)
        {
            if ($structure != null)
                $this->controllers = $structure;
            $this->register_public_ajax();
            return $this;
        }

        private function register_admin_ajax()
        {
            if ($this->controllers != null)
                foreach ($this->controllers as $class => $array) {
                    foreach ($array as $key => $val) {
                        add_action('wp_ajax_' . $key, array($class, $val));
                    }
                }

            $this->reg_heatbeat();
        }

        private function register_public_ajax()
        {
            if ($this->controllers != null)
                foreach ($this->controllers as $class => $array) {
                    foreach ($array as $key => $val) {
                        add_action('wp_ajax_nopriv_' . $key, array($class, $val));
                    }
                }

            $this->reg_heatbeat();
        }

        private function reg_heatbeat()
        {
            if ($this->controllers != null) {
                if (isset($this->controllers['heatbeat'])) {
                    foreach ($this->controllers['heatbeat'] as $class => $private) {
                        if ($private) {
                            add_filter('heartbeat_received', array($class, 'hb_received'), 10, 3);
                            add_filter('heartbeat_send', array($class, 'hb_send'), 10, 3);
                            add_filter('heartbeat_tick', array($class, 'hb_tick'), 10, 3);
                        } else {
                            add_filter('heartbeat_nopriv_received', array($class, 'hb_received'), 10, 3);
                            add_filter('heartbeat_nopriv_send', array($class, 'hb_send'), 10, 3);
                            add_filter('heartbeat_nopriv_tick', array($class, 'hb_tick'), 10, 3);
                        }
                    }
                }
            }
        }
    }
endif;