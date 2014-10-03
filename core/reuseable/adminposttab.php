<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年9月5日
 * Time: 下午2:37
 */
class adminposttab
{
    protected $post_type;
    protected $config;
    protected $screen_id;
    protected $script_localizer;
    protected $slug;
    protected $default = array(
        "page_title" => "XXX",
        "menu_title" => "XXX",
        "cap" => "XXX",
        "menu_slug" => "XXX",
        "cb" => null,
        "script_localize" => null,
        "style" => null,
        "script" => null,

        //optional
        "style_id" => "XXX",
        "script_id" => "XXX",
    );

    public function __construct($post_type, $config = array())
    {
        $this->post_type = $post_type;
        $this->config = $config;
        $this->screen_id = $this->post_type ."_page_". $this->config['menu_slug'];
        $this->script_localizer = $this->config['localize'];
        $this->slug = 'edit.php?post_type=' . $this->post_type;
        add_action("admin_menu", array(&$this, 'add_sub_tab'));
        add_action('admin_enqueue_scripts', array(&$this, "wp_script"));
    }

    public function add_sub_tab()
    {
        //what is the validated screen ID format
        add_submenu_page(
            $this->slug,
            $this->config['page_title'],
            $this->config['menu_title'],
            $this->config['cap'],
            $this->config['menu_slug'],
            array(&$this, 'show_menu'));

//for chain methods
        return $this;
    }

    //to print out the html
    public function show_menu()
    {
        echo get_oc_template($this->config['template_name']);
    }

    //to print out the html
    public function wp_script()
    {
        $screen = get_current_screen();
        /* echo '<pre>';
          print_r($screen);

          echo '<br>';
          echo $hook;
          echo '<br>';
          echo $this->script_screening_id;
          echo '</pre>';*/

        if ($screen->id == $this->screen_id) {
            if (isset($this->config['style_id'])) {
                $this->do_enqueue_style($this->config['style_id']);
            }
            if (isset($this->config['script_id'])) {
                $this->do_enqueue_script($this->config['script_id']);
            }
            return;
        }
    }


    private function do_enqueue_style($handler)
    {
        if (is_array($handler)) {
            foreach ($handler as $h) {

                wp_enqueue_style($h);
            }
        } else {
            wp_enqueue_style($handler);
        }
    }

    private function do_enqueue_script($handler)
    {
        if (isset($this->script_localizer)) {
            wp_enqueue_script($handler);
            wp_localize_script($handler, $this->script_localizer[0], $this->script_localizer[1]);
        } else
            wp_enqueue_script($handler);
    }
} 