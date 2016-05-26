Drops = new Meteor.Collection("drops");

Drops.allow({
    insert: function (userId, doc) {

        var currentDrop = Drops.findOne({drop:doc.drop});

        if (doc.drop == '') {
            return false;
        }
        return true; 
    },
    update: function () { return true; },
    remove: function () { return true; },
});