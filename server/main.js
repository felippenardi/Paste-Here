Drops = new Meteor.Collection("drops");

Drops.allow({
    insert: function (userId, doc) {
        if (doc.drop == '') {
            return false;
        }
        return true; 
    },
    update: function () { return true; },
    remove: function () { return true; },
});