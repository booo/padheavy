var listitem = function listitem(childs, list) {
  var i;
  for(i=0; i < childs.length; i++) {
    var child = childs[i];
    if(child.nodeType === Node.TEXT_NODE && child.nodeValue != "\n") {
      console.log(child.nodeValue);
      list.push(child.nodeValue);
    } else if(child.nodeType === Node.ELEMENT_NODE) {
      if(child.nodeName == 'UL') {
        var nestedList = [];
        ulist(child.childNodes, nestedList);
        list.push(nestedList);
      }
    }
  }
};

var ulist = function ulist(childs, list) {
  console.log("start ulist");
  console.log("childs", childs);
  var i;
  for(i=0; i < childs.length; i++) {
    var child = childs[i];
    if(child.nodeType === Node.ELEMENT_NODE) {
      if(child.nodeName === 'LI') {
        listitem(child.childNodes, list);
      }
    }
  }
  console.log(list);
  console.log("end ulist");
};

var paragraph = function paragraph(p, doc) {
  var childNodes = p.childNodes;
  //default fontSize
  var parts = [];
  var fontSize = parseInt($(p).css('font-size'), 10);
  for(i=0; i < childNodes.length; i++) {
    var child = childNodes[i];

    if(child.nodeType === Node.TEXT_NODE) {
      doc.fontSize(fontSize)
        .text(
            child.nodeValue,
            { continued: i === childNodes.length-1 ? false : true }
            );
    } else if(child.nodeType === Node.ELEMENT_NODE) {
      if(child.nodeName === 'EM' &&
          child.firstChild.nodeType === Node.TEXT_NODE) {
            doc.font('Helvetica-Oblique')
              .fontSize(fontSize)
              .text(
                  child.firstChild.nodeValue,
                  { continued: i === childNodes.length-1 ? false : true }
                  )
              .font('Helvetica');
      } else if(child.nodeName === 'STRONG' &&
          child.firstChild.nodeType === Node.TEXT_NODE) {
            doc.font('Helvetica-Bold')
              .fontSize(fontSize)
              .text(
                  child.firstChild.nodeValue,
                  { continued: i === childNodes.length-1 ? false : true }
                  )
              .font('Helvetica');
      } else if(
          (child.nodeName === 'EM' || child.nodeName === 'STRONG') &&
            (
            child.firstChild.nodeName === 'STRONG' ||
            child.firstChild.nodeName === 'EM'
            )
          ) {
            doc.font('Helvetica-BoldOblique')
              .fontSize(fontSize)
              .text(
                  child.firstChild.firstChild.nodeValue,
                  { continued: i === childNodes.length-1 ? false : true }
                  )
              .font('Helvetica');
      } else if(child.nodeName === 'CODE'){
        doc.fontSize(fontSize)
           .text(
               child.firstChild.nodeValue,
               { continued: i === childNodes.length-1 ? false : true }
               );
      }
    }

  }
};

var start = function start(node, doc) {
  var childNodes = node.childNodes;
  var i;
  for(i=0; i < childNodes.length; i++) {
    var child = childNodes[i];
    console.log("nodeType:", child.nodeType);
    console.log("nodeName:", child.nodeName);
    if(child.nodeType === Node.ELEMENT_NODE) {
      var headingRegex = /^H\d$/;
      var fontSize;
      if(child.nodeName === 'P') {
        paragraph(child, doc);
        //start a paragraph
      } else if(headingRegex.test(child.nodeName)) {
        fontSize = parseInt($(child).css('font-size'), 10);
        doc.fontSize(fontSize).text(child.childNodes[0].nodeValue);

      } else if(child.nodeName === 'UL') {
        //start bullet list
        var list = [];
        ulist(child.childNodes, list);
        fontSize = parseInt($(child).css('font-size'), 10);
        doc.fontSize(fontSize).list(list);
      }
    } else if(child.nodeType === Node.TEXT_NODE &&
        child.nodeValue !== "\n") {
      doc.text(child.nodeValue);
    }

  }
};

var html2pdf = function html2pdf(html) {
  var root = html || $('#markdown')[0];
  var doc = new PDFDocument();
  var childNodes = root.childNodes;
  console.log("root:", root);
  console.log("childNodes:", childNodes);

  start(root, doc);
  return doc;
};
