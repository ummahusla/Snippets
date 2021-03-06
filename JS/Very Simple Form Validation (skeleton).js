@data-validation values map to objects in patterns. 
I'm not sure of this thing's performance on large field sets. It cannot handle multiple validation rules yet.

Presupposes HTML5 namespace rules (specifically, @data-*)


document.getElementsByAttribute = function( attrib, value, context_node, tag ) {
    var nodes = [];
    if ( context_node == null )
        context_node = this;
    if ( tag == null ) 
        tag = '*';
    var elems = context_node.getElementsByTagName(tag);

    for ( var i = 0; i < elems.length; i += 1 ) {
        if ( value ) {
            if ( elems[i].hasAttribute(attrib) && elems[i].getAttribute(attrib) == value )
                nodes.push(elems[i]);
        } else {
            if ( elems[i].hasAttribute(attrib) )
                nodes.push(elems[i]);
        }
    }
    return nodes;
}

if (typeof validateElementsByRule != "function") {
    var validateElementsByRule = function( form_node, options, patterns ) {

        if ( !options ) {
            options = {
                livetype: false,
                errorBlock: true,
                errorBefore: "<li>",
                errorAfter: "</li>"
            };
        }

        if ( !patterns ) {
            patterns = {
                "required": {
                    filter: /^\S+$/,
                    error: "Required!"
                },
                "digits": {
                    filter: /^\d+$/,
                    error: "Please enter digits only."
                },
                "zip": {
                    filter: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
                    error: "Please provide a valid zip or postal code."
                }
            };
        }

        var errors = [];

        var elems = document.getElementsByAttribute( "data-validation", "", form_node );
        for ( var i = 0; i < elems.length; i += 1 ) {
            var reg = new RegExp(patterns[elems[i].getAttribute("data-validation")].filter);
            if ( !reg.test(elems[i].value) ) {
                // store @id and error message
                errors.push([
                    elems[i].getAttribute("id"),
                    patterns[elems[i].getAttribute("data-validation")].error
                ]);
            }
        }

        if (options.livetype) {
            for ( var p = 0; p < errors.length; p += 1 ) {
                document.getElementById(errors[p][0]).onkeyup = function() {
                    validateElementsByRule( form_node, options, patterns);
                }
            }
        }

        if (options.errorBlock) {
            
            var errorBlockChild = document.getElementById("error-block");
            if (errorBlockChild) {
                var errorBlockParent = errorBlockChild.parentNode;
                errorBlockParent.removeChild(errorBlockChild);
            }
            
            var error_output = "<ol>";
            for ( var p = 0; p < errors.length; p += 1 ) {
                error_output += options.errorBefore+"<label for="+errors[p][0]+">"+errors[p][1]+"</label>"+options.errorAfter;
            }
            error_output += "</ol>";
            var errorBlock = document.createElement("div");
            errorBlock.setAttribute("id", "error-block");
            errorBlock.innerHTML = error_output;
            var parentDiv = form_node.parentNode;
            parentDiv.insertBefore(errorBlock, form_node);
        }

        return errors;

    }
}

window.onload = function() {
    var new_form = document.getElementById('theform');
    var options = {
        livetype: true,
        errorBlock: true,
        errorBefore: "<li>",
        errorAfter: "</li>"
    }
    new_form.onsubmit = function() {
        if ( validateElementsByRule( new_form, options).length ) {
            console.log( validateElementsByRule( new_form, options) );
            return false;
        }
    }
};

/*
Test inputs:
<form id="theform" action="" method="post">
    <input id="cheese" value="" type="text" data-validation="required" />
    <input id="cheese2" value="" type="text" data-validation="zip" />
    <input type="submit" value="Validate" />
</form>
*/