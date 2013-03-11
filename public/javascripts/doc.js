var converter = new Showdown.converter();
var editor = ace.edit("editor");
var elem = document.getElementById("markdown");

var mode = 'markdown';
var update = null;
var docId;

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitze: true,
  smartLists: true,
  langPrefix: 'language-',
  highlight: function(code, lang) {
    return hljs.highlightAuto(code).value;
  }
});

sharejs.open(id, 'text', function(error, doc){
  docId = id;
  doc.attach_ace(editor);
  update = function(){
    if(mode == 'markdown') {
      elem.innerHTML = marked(doc.snapshot);
    }
  };
  doc.on('change', update);
  update();
});

$('.theme').click(function(){
  var theme = $(this).attr('value');
  editor.setTheme(theme);
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

$('.export').click(function(){
  if(mode == 'markdown') {
    var exporter = $(this).attr('value');
    if(exporter === 'jspdf') {
      var doc = new jsPDF();
      doc.fromHTML($('#markdown').get(0), 15, 15, {
        'width': 170,
        'elementHandlers': {}
      });
      doc.save(docId + '.pdf');
    } else {
      window.open(html2pdf().dataURI());
    }
  }
});
