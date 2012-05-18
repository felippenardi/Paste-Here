Drops = new Meteor.Collection("drops");

if (Meteor.is_client) {

  // ATIVA CALLBACK QUADNO CLICAR CMD+V, CMD+C, CTRL+C OU CTRL+V . SHOW.
  // http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
  $(document).ready(function()
  {
      
      var ctrlDown = false;
      var ctrlKey = ctrlKey, vKey = 86/*tecla V*/, cKey = 67/*tecla C*/;
  
      $(document).keydown(function(e)
      {
          if (e.metaKey || e.ctrlKey) ctrlDown = true;
      }).keyup(function(e)
      {
          if (e.keyCode == ctrlKey) ctrlDown = false;
      });
      
      // Essa função é chamada quando CTRL+C ou CMD+C é pressionado
      $(document).keydown(function(e)
      {   
          if (ctrlDown && (e.keyCode == vKey /*|| e.keyCode == cKey*/)) {
            
            /* 1- Coloca um textarea antes da "ação colar" acontecer */
            $("#drophere").append("<textarea></textarea>")
            /* 2- Ainda antes do colar acontecer, coloque foco nesse textarea */
            $("#drophere textarea").focus();

            /* 3- Dê 1ms de espera para que o colar aconteceça,
            e então copie o valor do textarea para variável clipboard */
            setTimeout(function() {
                var clipboard = $('#drophere textarea').val();
                if ( clipboard != '' && clipboard != 'undefined') {
                  /* 4- Imprima o clipboard na tela como html */
                  Drops.insert({drop:clipboard, at: new Date()});
                  /* 5- Delete o textarea feioso */
                  $("#drophere textarea").remove();
                  console.log("vazou");
                } else { /* se for repetido, ou vazio, delete o textarea */
                    $("#drophere textarea").remove();
                    console.log("bloqueou");
                }
            }, 1);
          }
      });
  });
  
  Template.drops.drops = function () {
        return Drops.find({}, {sort:{_id: -1}});
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
    // code to run on server at startup
    
  });
}