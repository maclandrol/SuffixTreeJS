// This implementation is adapted from the one here :
// https://github.com/fabsrc/es6-ukkonen-suffix-tree/blob/master/SuffixTree.js
// Which I think is from http://www.allisons.org/ll/AlgDS/Tree/Suffix/

'use strict';

function Node(){
    this.transition = {};
    this.suffixLink = null;
}

Node.prototype.addTransition = function(node, start, end, t) {
    this.transition[t] = [node, start, end];
}

Node.prototype.isLeaf = function() {
    return Object.keys(this.transition).length === 0;
}


function SuffixTree (){
  
    this.text = '';
    this.str_list = [];
    this.seps = []
    this.root = new Node();
    this.bottom = new Node();
    this.root.suffixLink = this.bottom;
    this.s = this.root;
    this.k = 0;
    this.i = -1;
}

SuffixTree.prototype.addString = function(str) {
  var temp = this.text.length;
  this.text += str;
  this.seps.push(str[str.length-1])
  this.str_list.push(str);
  var s, k, i;
  s = this.s;
  k = this.k;
  i = this.i;

  for (var j = temp; j < this.text.length; j++) {
    this.bottom.addTransition(this.root, j, j, this.text[j]);
  }

  while(this.text[i+1]) {
    i++;
    var up = this.update(s, k, i);
    up = this.canonize(up[0], up[1], i);
    s = up[0];
    k = up[1];
  }

  this.s = s;
  this.k = k;
  this.i = i;
  return this;
}


SuffixTree.prototype.update = function(s, k, i) {

  var oldr = this.root;
  var endAndr= this.testAndSplit(s, k, i - 1, this.text[i]);
  var endPoint = endAndr[0]; var r = endAndr[1]    

  while(!endPoint) {
    r.addTransition(new Node(), i, Infinity, this.text[i]);

    if(oldr != this.root) {
      oldr.suffixLink = r;
    }

    oldr = r;
    var sAndk = this.canonize(s.suffixLink, k, i - 1);
    s = sAndk[0];
    k = sAndk[1];
    endAndr = this.testAndSplit(s, k, i - 1, this.text[i]);
    var endPoint = endAndr[0]; var r = endAndr[1]    
  }

  if(oldr != this.root) {
    oldr.suffixLink = s;
  }

  return [s, k];
}


SuffixTree.prototype.testAndSplit = function(s, k, p, t) {
  if(k <= p) {
    var traNs = s.transition[this.text[k]];
    var s2 = traNs[0], k2 = traNs[1], p2 = traNs[2];
    if(t == this.text[k2 + p - k + 1]) {
      return [true, s];
    } else {
      var r = new Node();
      s.addTransition(r, k2, k2 + p - k, this.text[k2]);
      r.addTransition(s2, k2 + p - k + 1, p2, this.text[k2 + p - k + 1]);
      return [false, r];
    }
  } else {
    if(!s.transition[t])
      return [false, s];
    else
      return [true, s];
  }
}


SuffixTree.prototype.canonize = function(s, k, p) {
  if(p < k)
    return [s, k];
  else {
    var traNs = s.transition[this.text[k]];
    var s2 = traNs[0], k2 = traNs[1], p2 = traNs[2];

    while(p2 - k2 <= p - k) {
      k = k + p2 - k2 + 1;
      s = s2;

      if(k <= p) {
        var traNs = s.transition[this.text[k]];
        s2 = traNs[0]; k2 = traNs[1]; p2 = traNs[2];
      }
    }

    return [s, k];
  }
}


SuffixTree.prototype.convertToJson = function(){
 
  var text = this.text;
  var ret = {
      "name" : "",
      "parent": "null",
      "suffix" : "",
      "children": []
  }

  function traverse(node, seps, str_list, ret) {
    for(var t in node.transition) {
      var traNs = node.transition[t];
      var s = traNs[0], a = traNs[1], b = traNs[2]; 
      var name =  text.substring(a, b + 1);
      var position = seps.length -1;
      var found = true;
      while(position > -1 && found){
        if(name.indexOf(seps[position])===-1){
            found = false;
          }
          else{
            position -= 1;
          }
        }
      if(found) {
        var names = name.split(seps[position+1]);
        if (names.length >1){
          name = names[0] +seps[position+1];  
        }
        
      }
      var suffix =  ret["suffix"]+name;
      var cchild = {
        "name" : name,
        "parent": ret['name'],
        "suffix" : suffix,
        "children": []
      };
      if (s.isLeaf()){
        cchild['seq'] = position +2;
        cchild['start'] = ""+(str_list[position+1].length - suffix.length);
      }
      cchild = traverse(s, seps, str_list, cchild);
      ret["children"].push(cchild)
    }

    return ret;

  }

  return traverse(this.root, this.seps, this.str_list, ret);

}

SuffixTree.prototype.toString = function() {
  var text = this.text;

  function traverse(node, offset, ret) {
    offset = typeof offset !== 'undefined' ? offset : '';
    ret = typeof ret !== 'undefined' ? ret : '';
    for(var t in node.transition) {
      var traNs = node.transition[t];
      var s = traNs[0], a = traNs[1], b = traNs[2]; 
      ret += offset + '["' + text.substring(a, b + 1) + '", ' + a + ', ' + b + ']' + '\r\n';
      ret += traverse(s, offset+'\t');
    }
    return ret;
  }
  var res = traverse(this.root)
  return res;
}

SuffixTree.prototype.print = function(){
  console.log(this.toString());
}