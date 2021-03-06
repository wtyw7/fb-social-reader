define(function (require) {

  var Global      = require("../../global");
  var MyReadsTpl  = require("tpl!./my_reads.html");
  var MyReadsCSS  = require("tpl!../../../../css/my_reads.css")({ pluginUrl: Global.get("pluginUrl") });


  var $ = window.jQuery;

  var MyReads = Backbone.View.extend({

    ui: {
      sidebarWrapper: ".sr-sidebar-box",
      sidebar: ".sr-sidebar-box .sr-sidebar",
      removeButton: ".remove"
    },

    initialize: function(options) {
      this.model = options.facebook;
    },

    render: function() {
      var self =this;
      

      self.$iframe = $("<iframe/>", {
        "class": "sr-my-reads",
        "scrolling": "no",
        css: {
          "border": 0,
          "position": "absolute",
          "z-index": 99,
          "width": "340px",
          "height": "300px",
          "display": "none",
          "overflow": "hidden"
        }
      });

      self.$iframe.load(function() {
        self.$iframe.contents().find("head").append("<style type='text/css'>"+MyReadsCSS+"</style>");
        self.$iframe.contents().find("body").html();
      });
      $(this.ui.sidebarWrapper).after(self.$iframe);

    },

    setFramePosition: function() {
      var sidebarOffset  = $(this.ui.sidebar).offset();
      var activityOffset = $(this.ui.sidebar).contents().find(".activity").offset();
      this.$iframe.css({
        "top": sidebarOffset.top + activityOffset.top + 15 + "px",
        "left": sidebarOffset.left + activityOffset.left - 257 + "px"
      });
    },

    setContent: function() {
      var userId = this.model.user.get("id");
      var activity = this.model.activity.getUserActivity(userId);
      var html = MyReadsTpl({ activity: activity });
      this.$iframe.contents().find("body").html(html);
    },

    listen: function() {
      var self = this;
      this.$iframe.contents().find(this.ui.removeButton).on("click", function() {

        var $li = $(this).closest("li");
        var id = $li.data("id");

        self.model.activity.deleteAction(id);
        self.model.activity.on("remove", function() {
          $li.fadeOut("fast", function() {
            $li.remove();
          });
        });
                
      });
    },

    stopListening: function() {
      this.$iframe.contents().find(this.ui.removeButton).off("click");
    },

    show: function() {
      this.setContent();
      this.setFramePosition();
      this.$iframe.show();
      this.listen();
    },

    hide: function() {
      this.$iframe.hide();
      this.stopListening();
    }

  });

  return MyReads;

});