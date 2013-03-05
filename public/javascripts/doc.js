var converter = new Showdown.converter();
var editor = ace.edit("editor");
var elem = document.getElementById("markdown");

sharejs.open(id, 'text', function(error, doc){
  doc.attach_ace(editor);

  doc.on('change', function(){
    elem.innerHTML = converter.makeHtml(doc.snapshot);
  });

  elem.innerHTML = converter.makeHtml(doc.snapshot);
});
