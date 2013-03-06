var converter = new Showdown.converter();
var editor = ace.edit("editor");
var elem = document.getElementById("markdown");

var mode = 'markdown';
var update = null;

sharejs.open(id, 'text', function(error, doc){
  doc.attach_ace(editor);
  update = function(){
    if(mode == 'markdown') {
      elem.innerHTML = converter.makeHtml(doc.snapshot);
    }
  };
  doc.on('change', update);
  update();
});

$('.theme').click(function(){
  var theme = $(this).text();
  editor.setTheme("ace/theme/" + theme);
});

$('.mode').click(function(){
  mode = $(this).text();
  if(mode != 'markdown') {
    console.log("hide");
    $('#markdown').hide();
  } else {
    $('#markdown').show();
    update();
  }
  editor.getSession().setMode("ace/mode/" + mode);
});
