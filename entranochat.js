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
            
            /* 1- Coloca um input antes da "ação colar" acontecer */
            $("#drophere").append("<input type='textarea'>")
            /* 2- Ainda antes do colar acontecer, coloque foco nesse input */
            $("#drophere input").focus();

            /* 3- Dê 1ms de espera para que o colar aconteceça,
            e então copie o valor do input para variável clipboard */
            setTimeout(function() {
                var clipboard = $('#drophere input').val();
                //if (clipboard != lastClipboard && clipboard != "") {
                  /* 4- Imprima o clipboard na tela como html */
                  //$("#drophere").append("<p>"+clipboard+"</p>");
                  Drops.insert({drop:clipboard, at: new Date()});
                  /* 5- Delete o input feioso */
                  $("#drophere input").remove();
                  var lastClipboard = clipboard;
                //} else { /* se for repetido, ou vazio, delete o input */ $("#drophere input").remove(); }
            }, 1);
          }
      });
  });
  
  Template.drops.drops = function () {
        return Drops.find({}, {sort:{at: -1}});
  };

  Template.poof.events = {
    'click #poof' : function () {
      console.log("YOU PRESSED THE POOF BUTTON, STUPID!");
      Drops.remove({});
    }
  }

}



if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}