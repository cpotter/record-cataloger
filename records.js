Records = new Mongo.Collection("records");
Search = new Mongo.Collection(null);

if (Meteor.isClient) {

  Template.searchresult.onRendered(function () {
    this.$('.searchresults').slick({});
  });

	Template.body.events({
    "submit .new-record": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target[0].value;

      var url = 'https://api.discogs.com/database/search';

      $.ajax({
         url: url,
         type: 'GET',
         data: {
            q: text,
            key: 'FMRMcYOnxxHVYFgvMPAg',
            secret: 'OydbiEDxZbfdopYQrrXxjDxceBYkPNyG',
         },
         success: function(data) {
          var results = [];
          this.$('.searchresults').unslick();
          Search.remove({});
          $.each(data.results, function(){
            Search.insert({
              title: this.title,
              thumb: this.thumb,
              id:    this.id, 
            });
          });
         },
      });

 
      // Insert a task into the collection
      // Records.insert({
      //   record_name: text,
      //   createdAt: new Date() // current time
      // });
 
      // Clear form
      event.target[0].value = "";
    },
    "click .record-result": function(){
      console.log(this.id);
    },
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function () {
      Records.remove(this._id);
    }
  });

  Template.body.helpers({
    records: function () {
      return Records.find({});
    }
  });

  Template.searchresult.helpers({
    searchresults: function () {
      return Search.find({});
    }
  });


}

if (Meteor.isServer) {
}
