Drops = new Meteor.Collection("drops");

if (Meteor.is_client) {
    // This function activates a callback when copy and paste shortcut keys are pressed
    // http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
    $(document).ready(function() {

        var ctrlDown = false;
        var ctrlKey = ctrlKey, vKey = 86, cKey = 67;
        // 86 = V
        // 67 = C

        $(document).keydown(function(e) {
            if (e.metaKey || e.ctrlKey) ctrlDown = true;
        }).keyup(function(e) {
            if (e.keyCode == ctrlKey) ctrlDown = false;
        });

        // Here is when paste is pressed
        $(document).keydown(function(e) {
            if (ctrlDown && (e.keyCode == vKey) ) {
                $("#drophere").append("<textarea></textarea>")
                $("#drophere textarea").focus();
                    // This setTimeout add a delay so the system can actually paste the clipboard content before the textarea is removed
                    setTimeout(function() {
                        var clipboard = $('#drophere textarea').val();
                        if ( clipboard !== undefined ) {
                            // Insert Drop to the database
                            Drops.insert({drop:clipboard, at: new Date()});
                            $("#drophere textarea").remove();
                        } else { //if it already exist or is empty, just delete the textarea
                            $("#drophere textarea").remove();
                        }
                    }, 10);
            }
        });
    });

    Template.drops.drops = function () {
        return Drops.find({}, {sort:{_id: -1}});
        //return Drops.find({drop:"oi.com.br"});
    };

    Template.drop.events = {
        'click .remove': function (evt) {
            var drop = this.drop;

            console.log("começou a deletar");
            evt.target.parentNode.style.opacity = 0;
            // wait for CSS animation to finish
            Meteor.setTimeout(function () {
                Drops.remove({drop: drop})
                console.log("deletou");
            }, 300);
        }
    };
}




if (Meteor.is_server) {
    Meteor.startup(function () {
    });

    Drops.allow({
        insert: function (userId, doc) {
            //console.log('userId: ' + userId);
            //console.log('doc: ' + JSON.stringify(doc) );
            var currentDrop = Drops.findOne({drop:doc.drop}) ;
            console.log(currentDrop);
            if (doc.drop == '') {
                return false;
            } else if (currentDrop) {
                return false;
            } else { return true; }
        },
        update: function () { return true; },
        remove: function () { return true; },
    });

}
