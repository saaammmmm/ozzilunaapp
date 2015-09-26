

Template.dashboard.rendered = function() {
  Meteor.typeahead();
  Meteor.typeahead.inject();
  $('body').css('background-image', 'none');
  Session.set('postingMode', false);
  Session.set('commentingMode', false);
  Session.set('cuteDogPicCounter', 0);


};


Template.newPostTemplate.helpers({
  'postPicUpload': function() {
    return {
      finished: function(index, fileInfo, context) {
        console.log("File Uploaded!");
        console.log(fileInfo);

        var userId = Meteor.userId();
        var dogToEdit = Dogs.findOne({username: Meteor.user().username});
        var picUrl = fileInfo.url;
        $('#postImagePreview').attr("src", picUrl);
        Pics.insert({usernameOfDogWhoOwnsThisPicture: Meteor.user().username, source: picUrl});
      },

    }
  }
});



Template.dogInfo.helpers({
  'thisDog': function() {
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    if (thisDog) {
      return thisDog;
    }
    else {
      return false;
    }
  }
});
Template.dashboard.helpers({
  'commentingMode': function() {
    return Session.get('commentingMode');
  },
  'randomNumber' : function () {
    return Math.floor((Math.random() * 1000) + 1);
  },
  'cuteDogPicNumber': function () {
    var cuteDogPicNum = Session.get('cuteDogPicCounter') % 6 + 1;
    return cuteDogPicNum;
  },
  'profilePicUpload': function() {
    return {
      finished: function(index, fileInfo, context) {
        console.log("File Uploaded!");
        console.log(fileInfo);
        var userId = Meteor.userId();
        var dogToEdit = Dogs.findOne({username: Meteor.user().username});

        var picUrl = fileInfo.url;

        Dogs.update(dogToEdit._id, {$set: {profilePic: picUrl}});
        Pics.insert({usernameOfDogWhoOwnsThisPicture: Meteor.user().username, source: picUrl});
      }
    }
  },
  'thisDog': function() {
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    if (thisDog) {
      return thisDog;
    }
    else {
      return false;
    }
  },
  'ageOfThisDog': function() {
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    var dogBirthDate = new Date(thisDog.birthDate);
    var now = Date.now();
    var age = new Date(Date.now() - dogBirthDate);
    if (age) {
      return Math.abs(age.getYear() - 70) + " Years " + age.getMonth() + " Months old ";

    }
    else {
      return "";
    }
  },
  'friendProfilePic':function (friendUsername) {
    var thisDog = Dogs.findOne({username: friendUsername});
    if (thisDog.profilePic){
      return thisDog.profilePic;
    }
    else {
      return "#";
    }
  },
  'statsEditMode': function() {
    return Session.get('statsEditMode');
  },
  'dogAge': function() {
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    var dogBirthDate = new Date(thisDog.birthDate);
    var now = Date.now();
    var age = new Date(Date.now() - dogBirthDate);

    return Math.abs(age.getYear() - 70) + " Years " + age.getMonth() + " Months";
  },
  'thisDogsPosts' : function(){
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    var thisDogsUsername = thisDog.username;
    return Posts.find({dogUsernameOfProfilePostedTo: thisDogsUsername});
  },
  'thisPostsCommentsById': function(postId){
    return Posts.find({parentPostId: postId});
  },
  'numberOfCommentsByPostId': function(postId){
    return Posts.find({parentPostId: postId}).fetch().length;
  },
  // this is for posting
  'postingMode': function() {
    return Session.get('postingMode');
  },
  // for editing stats
  'statsEditMode': function() {
    return Session.get('statsEditMode');
  },
  'interactionsEditMode': function() {
    return Session.get('interactionsEditMode');
  },
  'philosophyEditMode': function() {
    return Session.get('philosophyEditMode');
  },
  'Activities': function() {
    return Activities.find().fetch().map(function(it){ return it.name; });
  },
  'isDogInProfileFriend': function() {
    var myDog = Dogs.findOne({username: Meteor.user().username});
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    var isFriend = false;
    if (myDog.friends) {
      for (var i = 0; i < myDog.friends.length; i++) {
        if (myDog.friends[i].friendUsername == thisDog.username) {
          isFriend = true;
        }
      }
    }
    return isFriend;
  },
  'hasFriendRequestBeenSent': function() {
    var myDog = Dogs.findOne({username: Meteor.user().username});
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    var friendRequestSent = false;
    if (thisDog.friendRequests) {
      for (var i = 0; i < thisDog.friendRequests.length; i++) {
        if (thisDog.friendRequests[i].usernameOfRequestedFriend == myDog.username) {
          friendRequestSent = true;
        }
      }
    }
    return friendRequestSent;
  },
  // For detecting who is on the profile
  'isMyProfile': function() {
    var myDog = Dogs.findOne({username: Meteor.user().username});
    return myDog.username === Router.current().params.username;
  },
  'numberOfLikesForPostByPostId': function(postId) {
    var thisPost = Posts.findOne({_id: postId});
    if (thisPost && thisPost.dogsWhoLikeThisPost) {
      return thisPost.dogsWhoLikeThisPost.length;
    }
    else {
      return "";
    }
  },

});

Template.favoriteActivitiesDisplay.helpers({
  // for getting this dogs activities
  'thisDogsActivities': function(){
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    var thisDogsUsername = thisDog.username;
    return Activities.find({dogsByUsernameWhoLikeThisActivity: {$elemMatch: {username: thisDogsUsername}}});
  },
  'isMyProfile': function() {
    var myDog = Dogs.findOne({username: Meteor.user().username});
    return myDog.username === Router.current().params.username;
  },
  'numberOfFreindsWithSameInterest': function(interest){
    var myDog = Dogs.findOne({username: Meteor.user().username});
    var likeCount = 0;
    // iterate through all friends of my dog and see if hey have the same interest as our dog
    for (var i = 0; i < myDog.friends.length; i++) {
      var thisFriend = myDog.friends[i];
      console.log("Checking if " + thisFriend.friendName + " likes " + interest);
      if (Activities.findOne({name: interest, dogsByUsernameWhoLikeThisActivity: {$elemMatch: {username: thisFriend.friendUsername}}})) {
        console.log(" ...Yes!");
        likeCount++;
      }
      else {
        console.log("... nope.")
      }
    }
    return likeCount;
  },
});

Template.friendGridDisplay.helpers({
  'thisDog': function() {
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    if (thisDog) {
      return thisDog;
    }
    else {
      return false;
    }
  },
  'friendProfilePic':function (friendUsername) {
    var thisDog = Dogs.findOne({username: friendUsername});
    if (thisDog.profilePic){
      return thisDog.profilePic;
    }
    else {
      return "#";
    }
  }
});

Template.interactionsDisplay.helpers({
  'thisDog': function() {
    var thisDog = Dogs.findOne({username: Router.current().params.username});
    if (thisDog) {
      return thisDog;
    }
    else {
      return false;
    }
  }
});
Template.interactionsEdit.rendered = function() {
  $('.slider').slider();
};
