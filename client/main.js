Drops = new Meteor.Collection("drops");

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
                    var duplicate = Drops.findOne({drop:clipboard}) ;
                    if ( clipboard == undefined ) {
                        // Insert Drop to the database
                        $("#drophere textarea").remove();
                    } else if (duplicate) {
                        $("#drophere textarea").remove();
                    }else {
                        Drops.insert({drop:clipboard, at: new Date()});
                        $("#drophere textarea").remove();
                        _gaq.push(['_trackEvent', 'Interaction', 'Paste',,, false]);
                    }
                }, 10);
        }
    });
});

Template.drops.helpers({
    drops: function () {
        return Drops.find({}, {sort:{at: -1}});
    }
});

Template.drop.events = {
    'click .remove': function (evt) {
        var drop = this.drop;
        evt.target.parentNode.style.opacity = 0;
        // wait for CSS animation to finish
        Meteor.setTimeout(function () {
            Drops.remove({drop: drop})
            _gaq.push(['_trackEvent', 'Interaction', 'Delete',,, false]);
        }, 300);
    }
};