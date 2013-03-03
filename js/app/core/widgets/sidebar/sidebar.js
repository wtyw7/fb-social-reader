define(function(require) {

  var $            = require('jquery'),
      Widget       = require('../widget');
      User         = require('../../user'),
      Lightbox     = require('../lightbox/lightbox'),
      SR           = require('../../global');

  var LoggedInTpl  = require('tpl!./logged_in.html');
  var LoggedOutTpl = require('tpl!./logged_out.html');

  var CSS          = require('tpl!./style.css');

  return Widget.extend({

    initialize: function() {
      this.$container = $('#sr_sidebar_box');
      if (this.$container.length === 0) return;
      this.create_iframe( { id: 'sr_sidebar' });
      this.load_css(CSS);
      this.render();
      this.lightbox = new Lightbox();
    },

    render: function() {
      var html;
      if (SR.get('user')) {
        var toggled_class = (SR.get('auto_sharing') === true) ? 'auto_sharing_on' : 'auto_sharing_off';
        html = LoggedInTpl(SR.attributes);
        this.$el.find('body').html(html);
      } else {
        html = LoggedOutTpl(SR.attributes);
        this.$el.find('body').html(html);
      }
    },

    events: {
      "click .toggle": "toggle_auto_sharing",
      "click .activity": "show_lightbox",
      "click .logout": "logout",
      "click .login": "login"
    },

    login: function(e) {
      $button = $(e.currentTarget);
      $button.css('opacity', 0.7);
      User.login();
    },

    toggle_auto_sharing: function(e) {
      var $toggle = $(e.currentTarget);
      var turn_auto_sharing = ($toggle.hasClass('toggled_on')) ? false : ($toggle.hasClass('toggled_off')) ? true : false;
      var auto_sharing_text = (turn_auto_sharing === true) ? SR.get('sidebar').auto_sharing_on : SR.get('sidebar').auto_sharing_off;
      $toggle.toggleClass('toggled_on toggled_off');
      $toggle.find('a').text(auto_sharing_text);
      SR.set('auto_sharing', turn_auto_sharing);
    },

    show_lightbox: function() {
      this.lightbox.show();
    },

    logout: function() {
      User.logout(function() {
        window.location.reload();
      });
    }


  });



});