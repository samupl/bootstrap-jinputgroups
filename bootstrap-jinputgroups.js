function copy_val() {
    var $this = $("#" + $(this).data('placeholder-for'));
    var input_group = $(this).parent();
    if (input_group.hasClass('input-group')) {
        var new_text = "";
        input_group.children().each(function(index, value)
        {
            var $value = $(value);
            if ($value.is('span') && $value.hasClass("input-group-addon")) new_text += $value.text();
            else new_text += $value.val();
        });
        $this.val(new_text);
    } else {
        $this.val($(this).val());
    }
}

var ig_counter = 0;
jQuery.fn.extend(
    {
        ig_isWrapped: function()
        {
            var selector = $($(this).parents()[0]).find('div.input-group')

            return (selector.length > 0) ? 1 : 0;
        },

        ig_generateNewId: function()
        {
            if ( ! $(this).data('ig_id') ) {
                ig_counter ++;
                $(this).data('ig_id', ig_counter);
            }
            return $(this).attr('id')+'-placeholder-'+$(this).data('ig_id');
        },

        ig_createPlaceholder: function()
        {
            // check if a placeholder has already been created - return one if it already exists
            var existing = $(this).ig_getPlaceholder();
            if (existing !== false) return existing;

            // create a clone of the new element
            var new_id = $(this).ig_generateNewId();
            var new_element = $(this).clone();
            new_element.attr('id', new_id);
            new_element.data('placeholder-for', $(this).attr('id'));
            new_element.attr('name', new_id);
            new_element.insertAfter(this);

            // hide the old element
            this.slideUp(0);

            // create events for changes on the new placeholder and a pseudo reactive extension to the real element.
            var $this = this;
            new_element.change(copy_val);
            $this.change(function() {
                new_element.val($this.val());
            });

            return new_element;
        },

        ig_getPlaceholder: function()
        {
            var new_id = $(this).ig_generateNewId();
            var placeholder = $("#"+new_id);
            //console.log(new_id)
            if (placeholder.length > 0) return $(placeholder[0]);
            else return false;
        },

        ig_wrapInputGroup: function()
        {
            // if we're already wrapped - don't duplicate it!
            if ($(this).ig_isWrapped()) return false;

            // create a placeholder and wrap it
            var placeholder = $(this).ig_createPlaceholder();
            placeholder.wrap("<div class='input-group'></div>");

        },

        ig_createInput: function(input_element) {
            var $this = $(this);
            switch (typeof(input_element)) {
                case "string":
                    var prepend_text = $('<span class="input-group-addon"></span>');
                    prepend_text.text(input_element);
                    return prepend_text;
                    break;

                case "object":
                    input_element.data('placeholder-for', $this.attr('id'));
                    var tag = input_element.prop('tagName').toLowerCase();
                    switch(tag) {
                        case "select":
                            input_element.change(copy_val);
                            input_element.wrap('<div class="input-group"><span class="input-group-btn"></div></div>');
                            break;

                        case "button":
                            if ($this.parent().find('div.input-group-btn').length == 0) {
                                input_element.wrap($("<div class='input-group-btn'></div>"));
                                return input_element.parent();
                            } else {
                                $this.parent().find('div.input-group-btn').append(input_element)
                                return false;
                            }

                    }
                    return input_element;
                    break;
            }

        },

        ig_prependInput: function(input_element) {
            // wrap inside .input-group
            this.ig_wrapInputGroup();

            // fetch existing placeholder
            var placeholder = $(this).ig_getPlaceholder();

            // check type of provided input
            // if it's a string, just append a static text
            var new_input = $(this).ig_createInput(input_element);
            if (new_input !== false) placeholder.before(new_input);
        },

        ig_appendInput: function(input_element) {
            // wrap inside .input-group
            this.ig_wrapInputGroup();

            // fetch existing placeholder
            var placeholder = $(this).ig_getPlaceholder();

            // check type of provided input
            // if it's a string, just append a static text
            var new_input = $(this).ig_createInput(input_element);
            if (new_input !== false) placeholder.after(new_input);
        }

    }
);

