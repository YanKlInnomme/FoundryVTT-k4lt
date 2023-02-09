export default class kultTracker extends Application {
    static get defaultOptions() {
      const options = super.defaultOptions;
      options.template = 'systems/k4lt/templates/partials/tracker.hbs';
      options.popOut = true;
      options.resizable = true;
      return options;
    }

    getData(){
        const data = super.getData();
        data.actors = Array.from(game.actors);
        data.pcs = data.actors.filter(function(item) {return item.type === "pc"} );
        data.disadvantages = 
        console.log(data.pcs);
        console.log(Array.from(data.pcs[0].data.items))
        return data;
    }
  
    activateListeners(html) {
    //   let misfortune = game.settings.get('flames', 'misfortune');
    //   let fortune = game.settings.get('flames', 'fortune');
    //   renderTracker();
    //   this.checkUpdates();
  
    //   if (!game.user.hasRole(game.settings.get('flames', 'misfortunePermissionLevel'))) {
    //     html.find('#flame-misfortune-track-decrease')[0].style.display = 'none';
    //     html.find('#flames-misfortune-track-increase')[0].style.display = 'none';
    //     html.find('#flames-track-misfortune')[0].disabled = true;
    //   }
  
    //   if (!game.user.hasRole(game.settings.get('flames', 'fortunePermissionLevel'))) {
    //     html.find('#flames-fortune-track-decrease')[0].style.display = 'none';
    //     html.find('#flames-fortune-track-increase')[0].style.display = 'none';
    //     html.find('#flames-track-fortune')[0].disabled = true;
    //   }
  
    //   html.find('#flames-fortune-track-decrease > .fas').click((ev) => {
    //     if (!game.user.hasRole(game.settings.get('flames', 'misfortunePermissionLevel'))) {
    //       ui.notifications.error(game.i18n.localize('flames.notifications.fortuneinvalidpermissions'));
    //       return false;
    //     }
    //     misfortune = game.settings.get('flames', 'misfortune');
    //     fortune = parseInt(document.getElementById('flames-track-fortune').value);
    //     if (fortune === 0) {
    //       ui.notifications.warn('There\'s no Fortune Left!');
    //       return false;
    //     }
    //     fortune = fortune - 1;
    //     misfortune = misfortune +1;
    //     game.settings.set('flames', 'fortune', fortune);
    //     game.settings.set('flames', 'misfortune', misfortune);
    //     renderTracker();
    //   });
  
    //   html.find('#flames-track-misfortune').keydown((ev) => {
    //     if (ev.keyCode == 13) {
    //       html.find('#flames-track-misfortune').blur();
    //     }
    //   });
  
    //   html.find('#flames-track-fortune').keydown((ev) => {
    //     if (ev.keyCode == 13) {
    //       html.find('#flames-track-fortune').blur();
    //     }
    //   });
  
    //   html.find('#flames-track-misfortune').change((ev) => {
    //     misfortune = game.settings.get('flames', 'misfortune');
    //     fortune = game.settings.get('flames', 'fortune');
    //     if (document.getElementById('flames-track-misfortune').value < 0) {
    //       document.getElementById('flames-track-misfortune').value = misfortune;
    //       ui.notifications.warn('You used all the Misfortune!');
    //       return false;
    //     }
    //     if (document.getElementById('flames-track-misfortune').value > 99999999) {
    //       document.getElementById('flames-track-misfortune').value = misfortune;
    //       ui.notifications.error('THAT IS TOO MUCH CHAOS!');
    //       return false;
    //     }
    //     misfortune = document.getElementById('flames-track-misfortune').value;
    //     game.settings.set('flames', 'misfortune', misfortune);
    //     renderTracker();
    //   });
  
    //   html.find('#flames-track-fortune').change((ev) => {
    //     misfortune = game.settings.get('flames', 'misfortune');
    //     fortune = game.settings.get('flames', 'fortune');
    //     if (document.getElementById('flames-track-fortune').value < 0) {
    //       document.getElementById('flames-track-fortune').value = fortune;
    //       ui.notifications.warn('There\'s No Fortune Left!');
    //       return false;
    //     }
    //     if (document.getElementById('flames-track-fortune').value > 20) {
    //       document.getElementById('flames-track-fortune').value = fortune;
    //       ui.notifications.error('THAT IS TOO MUCH fortune!');
    //       return false;
    //     }
    //     fortune = document.getElementById('flames-track-fortune').value;
    //     game.settings.set('flames', 'fortune', fortune);
    //     renderTracker();
    //   });
  
    //   html.find('#tracker-clickable').click((ev) => {
    //     if ($('.tracker-container:not(.hide)')[0]) {
    //       $('#tracker-clickable-minus').addClass('hide');
    //       $('#tracker-clickable-plus').removeClass('hide');
    //       $('.tracker-container').addClass('hide').removeAttr('style');
    //     } else {
    //       $('#tracker-clickable-plus').addClass('hide');
    //       $('#tracker-clickable-minus').removeClass('hide');
    //       $('.tracker-container').addClass('hide').removeAttr('style');
    //       $('.tracker-container').removeClass('hide').width('200px')
    //     }
    //   });
  
    //   function renderTracker() {
    //     document.getElementById('flames-track-misfortune').value = misfortune;
    //     document.getElementById('flames-track-fortune').value = fortune;
    //   }
    }
  
    async checkUpdates() {
      const refreshRate = game.settings.get('flames', 'trackerRefreshRate') * 1000;
      function check() {
        const misfortune = document.getElementById('flames-track-misfortune').value;
        const fortune = document.getElementById('flames-track-fortune').value;
        const storedmisfortune = game.settings.get('flames', 'misfortune');
        const storedfortune = game.settings.get('flames', 'fortune');
  
        if ($('#flames-track-misfortune').is(':focus') == false) {
          if (storedmisfortune != misfortune) {
            document.getElementById('flames-track-misfortune').value = storedmisfortune;
          }
        }
        if ($('#flames-track-fortune').is(':focus') == false) {
          if (storedfortune != fortune) {
            document.getElementById('flames-track-fortune').value = storedfortune;
          }
        }
        setTimeout(check, refreshRate);
      }
      check();
    }
  }
