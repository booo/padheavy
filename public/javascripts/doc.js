var converter = new Showdown.converter();
var editor = ace.edit("editor");
var elem = document.getElementById("markdown");

var mode = 'markdown';
var update = null;
var id;

sharejs.open(id, 'text', function(error, doc){
  id = id;
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
    $('#markdown').hide();
    $('#export-btn').hide();
    $('#editor').width('100%');
  } else {
    $('#editor').width('50%');
    $('#markdown').show();
    $('#export-btn').show();
    update();
  }
  editor.getSession().setMode("ace/mode/" + mode);
});

$('#export-btn').click(function(){
  if(mode == 'markdown') {
    var doc = new jsPDF();
    doc.fromHTML($('#markdown').get(0), 15, 15, {
      'width': 170,
      'elementHandlers': {}
    });
    doc.save(id + '.pdf');
  }
});
