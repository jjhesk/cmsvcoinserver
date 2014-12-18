<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月25日
 * Time: 下午4:31
 */
class vtd_util
{
    public static function getview($file)
    {
        ob_start();
        include VTDPATH . "view/$file.php";
        $view = ob_get_clean();
        return $view;
    }

    public static function getviewContent($file, $content)
    {
        ob_start();
        include VTDPATH . "view/$file.php";
        $view = ob_get_clean();
        return $view;
    }

    public static function getcheckbox($list_tax)
    {
        $html = '<table class="form-table">';

        foreach ($list_tax as $name => $value) {
            $checked = $value == "1" ? "checked" : "";
            $html .= '<tr class="form-field">
                        <th scope="row" valign="top">
                        <label for="' . $name . '">' . $name . '</label>
                        </th><td>
                        <input class="hidden_field_switcher" type="hidden" name="taxlist[' . $name . ']" value="' . $value . '"/>
                        <div class="container">
                        <label class="switch">
                        <input type="checkbox" class="switch-input" ' . $checked . '>
                        <span class="switch-label" data-on="On" data-off="Off"></span>
                        <span class="switch-handle"></span>
                         </label></div></td></tr>';
        }
        $html .= "</table>";
        return $html;
    }
} 