var converter = new Showdown.converter();
var editor = ace.edit("editor");
var elem = document.getElementById("markdown");

var mode = 'markdown';
var update = null;
var docId;

var modesByName = {
    abap:       ["ABAP"         , "abap"],
    asciidoc:   ["AsciiDoc"     , "asciidoc"],
    c9search:   ["C9Search"     , "c9search_results"],
    coffee:     ["CoffeeScript" , "^Cakefile|coffee|cf|cson"],
    coldfusion: ["ColdFusion"   , "cfm"],
    csharp:     ["C#"           , "cs"],
    css:        ["CSS"          , "css"],
    curly:      ["Curly"        , "curly"],
    dart:       ["Dart"         , "dart"],
    diff:       ["Diff"         , "diff|patch"],
    dot:        ["Dot"          , "dot"],
    ftl:        ["FreeMarker"   , "ftl"],
    glsl:       ["Glsl"         , "glsl|frag|vert"],
    golang:     ["Go"           , "go"],
    groovy:     ["Groovy"       , "groovy"],
    haxe:       ["haXe"         , "hx"],
    haml:       ["HAML"         , "haml"],
    html:       ["HTML"         , "htm|html|xhtml"],
    c_cpp:      ["C/C++"        , "c|cc|cpp|cxx|h|hh|hpp"],
    clojure:    ["Clojure"      , "clj"],
    jade:       ["Jade"         , "jade"],
    java:       ["Java"         , "java"],
    jsp:        ["JSP"          , "jsp"],
    javascript: ["JavaScript"   , "js"],
    json:       ["JSON"         , "json"],
    jsx:        ["JSX"          , "jsx"],
    latex:      ["LaTeX"        , "latex|tex|ltx|bib"],
    less:       ["LESS"         , "less"],
    lisp:       ["Lisp"         , "lisp"],
    scheme:     ["Scheme"       , "scm|rkt"],
    liquid:     ["Liquid"       , "liquid"],
    lua:        ["Lua"          , "lua"],
    luapage:    ["LuaPage"      , "lp"], // http://keplerproject.github.com/cgilua/manual.html#templates
    lucene:     ["Lucene"       , "lucene"],
    lsl:        ["LSL"          , "lsl"],
    makefile:   ["Makefile"     , "^GNUmakefile|^makefile|^Makefile|^OCamlMakefile|make"],
    markdown:   ["Markdown"     , "md|markdown"],
    objectivec: ["Objective-C"  , "m"],
    ocaml:      ["OCaml"        , "ml|mli"],
    pascal:     ["Pascal"       , "pas|p"],
    perl:       ["Perl"         , "pl|pm"],
    pgsql:      ["pgSQL"        , "pgsql"],
    php:        ["PHP"          , "php|phtml"],
    powershell: ["Powershell"   , "ps1"],
    python:     ["Python"       , "py"],
    r:          ["R"            , "r"],
    rdoc:       ["RDoc"         , "Rd"],
    rhtml:      ["RHTML"        , "Rhtml"],
    ruby:       ["Ruby"         , "ru|gemspec|rake|rb"],
    scad:       ["OpenSCAD"     , "scad"],
    scala:      ["Scala"        , "scala"],
    scss:       ["SCSS"         , "scss"],
    sass:       ["SASS"         , "sass"],
    sh:         ["SH"           , "sh|bash|bat"],
    sql:        ["SQL"          , "sql"],
    stylus:     ["Stylus"       , "styl|stylus"],
    svg:        ["SVG"          , "svg"],
    tcl:        ["Tcl"          , "tcl"],
    tex:        ["Tex"          , "tex"],
    text:       ["Text"         , "txt"],
    textile:    ["Textile"      , "textile"],
    tm_snippet: ["tmSnippet"    , "tmSnippet"],
    toml:       ["toml"         , "toml"],
    typescript: ["Typescript"   , "typescript|ts|str"],
    vbscript:   ["VBScript"     , "vbs"],
    xml:        ["XML"          , "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
    xquery:     ["XQuery"       , "xq"],
    yaml:       ["YAML"         , "yaml"]
};

var modeListElement = $('#list-modes');
var name;

//create dropdown menu for modes
for(name in modesByName) {
  if(modesByName.hasOwnProperty(name)) {
    var mode = modesByName[name];
    var liElement = $('<li/>');
    var aElement = $('<a/>', {
      text: mode[0],
      'class': 'mode',
      'value': name
    }).appendTo(liElement);
    modeListElement.append(liElement);
  }
}

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
  mode = $(this).attr('value');
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
