<tr class="form-field term_display_switcher">
    <th scope="row" valign="top">
        <label for="taxonomy_image">Display</label>
    </th>
    <td>
        <input class="hidden_field_switcher" type="hidden" name="term_display_sw"
               value="<?php
               $logic = new vtd_logic();
               $switch_status = $logic->get_switch_status();
               $checked = $switch_status == "1" ? "checked" : "";
               echo $switch_status;
               ?>"/>

        <div class="container">
            <label class="switch">
                <input type="checkbox"
                       class="switch-input"
                    <?php echo $checked;?>>
                <span class="switch-label"
                      data-on="On"
                      data-off="Off"></span>
                <span class="switch-handle"></span>
            </label>
        </div>
    </td>
</tr>
