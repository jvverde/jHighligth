/**
 * $ jQuery HighLigth
 * Copyright(c) 2011 Isidro Vila Verde (jvverde@gmail.com)
 * Dual licensed under the MIT and GPL licenses
 * Version: 0.9.0
 * Last Revision: 2011-09-12
 *
 * Requires jQuery 1.6.2
 *
 *
*/
 
(function($){
	var $tr = (function(){
		var $t = {
			'<' : '&lt;',
			'>' : '&gt;',
			'&' : '&amp;'
		}
		return function($v){
			if ($t[$v]) return $t[$v]
		}
	})();
	var $transform = {
		html: (function(){
			var $backslash = function(){
				return '<span style="color:#006600">/</span>';
			}
			var $gt = function(){
				return '<span style="color:red">&gt;</span>';
			}
			var $lt = function(){
				return '<span style="color:red">&lt;</span>';
			}
			var $eq = function(){ 
				return '<span style="color:#009933">=</span>';
			}
			var $att = function($a){
				return '<span style="color:#FF3300">' + $a + '</span>'
			}
			var $quot = function(){ 
				return '<span style="color:blue">"</span>'
			}
			var $squot = function(){ 
				return '<span style="color:blue">\'</span>'
			}
			var $value = function($v){
				$v = $v.replace(/\r*\n/g,'</span>$&<span style="color:#AA3300">');
				return '<span style="color:#AA3300">' + $v + '</span>';
			}
			var $replace = function(){
				if (arguments[2]){
					//console.log('arguments[2]=',arguments);
					var $r = $lt();
					if (arguments[1]) $r += $backslash();
					$r += '<span style="color:#0000FF">' + arguments[2] + '</span>';
					if (arguments[3]){ //find a subpattern
						$r += (function($s){
							//                 $1         $2                 $3         $4  $5         $6 $7               $8         $9 $10  
							return $s.replace(/([\s\r\n]+)([^\s\n\r=>\/"']+)|([\s\r\n]*)(=)|([\r\n\s]*)(")((?:\\"|[^"])*)"|([\r\n\s]*)(')((?:\\'|[^'])*)'/g,function(){
								//console.log('arg2=',arguments);
								if (arguments[2]){
									return arguments[1] + $att(arguments[2]);
								}else if(arguments[4]){
									return arguments[3] + $eq();
								}else if(arguments[6]){
									return arguments[5] 
										+ $quot()
										+ $value(arguments[7])
										+ $quot();
								}else if(arguments[9]){
									return arguments[8] 
										+ $squot()
										+ $value(arguments[10])
										+ $squot();
								}
							})
						})(arguments[3]);
					}
					if (arguments[4]) $r +=  $backslash();
					return $r += $gt();
				}else if (arguments[5]){
					return '<span style="color:#999966">&lt;' 
						+ arguments[5].replace(/<|>|&(?![a-z]+;)/g,$tr).replace(/\n/g,'</span>\n<span style="color:#999966">') 
						+ '&gt;</span>';
				}
			}
			return function($code){
				//                             $1   $2             $3                       $4               $5  
				return $code.replace(/<(?!\!--)(\/)?([^\s\n\r>\/]+)((?:[\s\r\n]+[^>\s\/]*)*)([\s\r\n]*\/)?>|<(!--(?:.|\n|\r)*?--)>/g,$replace)
			}
		})(),
		javascript: (function(){
			var $namedOperators = [
				'new',
				'typeof',
				'void',
				'delete',
				'instanceof',
				'this',
				'eval'
			];
			var $pairOperators = [
				'[',
				']',
				'(',
				')',
			];
			var $operators = [
				'.',
				'[',
				']',
				'new',
				'(',
				')',
				'++',
				'--',
				'!',
				'~',
				'+',
				'-',
				'typeof',
				'void',
				'delete',
				'*',
				'/',
				'%',
				//'+',
				//'-',
				'<<',
				'>>',
				'>>>',
				'<',
				'<=',
				'>',
				'>=',
				'instanceof',
				'==',
				'!=',
				'===',
				'!==',
				'&',
				'^',
				'|',
				'&&',
				'||',
				'?',
				':', 
				'=',
				'+=',
				'-=',
				'*=',
				'/=',
				'%=',
				'<<=',
				'>>=',
				'>>>=',
				'&=',
				'^=',
				'|=',
				',',
				//because jquery .html() already tranlate thse to entities
				//'&amp;',
				//'&lt;',
				//'&gt;'
			];
			var $syntax = [
				';',
				'{',
				'}'
			];
			var $constructors = [
				'Array',
				'Boolean',
				'Date',
				'Function',
				'Iterator',
				'Number',
				'Object',
				'RegExp',
				'String',
				'Math',
				'Error'
			];
			var $statments = [
				'break',
				'case',
				'const',
				'continue',
				'do',
				'else',
				'finally',
				'for',
				'function',
				'if',
				'in',
				'let',
				'return',
				'switch',
				'throw',
				'try',
				'catch',
				'var',
				'while',
				'with'
			];
			var $literals = [
				'null',
				'undefined',
				'true',
				'false'
			];
			var $re = "'((?:\\\\'|[^'])*)'"; //strings delimited by '
			$re += '|"((?:\\\\"|[^"])*)"'; //strings delimited by "
			$re += '|\\/\\/(.*)$'; //comments, don't forget to use the m modifier
			$re += '|\\/\\*((?:.|\\n|\\r)*?)\\*\\/'; //second type of comments
			$re += '|\\/((?:\\\\/|[^/])*)\\/(?!\\/)'; //RE patterns
			
			var $r = []; //array of patterns
			
			$.each($namedOperators,function($i,$v){
				$r[$i]= $v + '(?!\\w)';
			});
			$re += '|(' + $r.join('|') + ')';
			
			$.each($pairOperators,function($i,$v){
				$v = $v.replace(/[()\[\]]/g,'\\$&'); //escape RE meta caracters
				$r[$i]= $v;
			});
			$re += '|(' + $r.join('|') + ')';
			$.each($operators,function($i,$v){
				$v = $v.replace(/[|^|+*.()\[\]\\?!:=-]/g,'\\$&'); //escape RE meta caracters
				$r[$i]= $v
			});
			$re += '|(' + $r.join('|') + ')'; //RE string

			var $r = [];
			$.each($syntax,function($i,$v){
				$r[$i]= $v
			});
			$re += '|(' + $r.join('|') + ')'; //RE string

			var $r = [];
			$.each($constructors,function($i,$v){
				$r[$i]= '(?:\s|\n|\r)*' + $v + '(?!\\w)';
			});
			$re += '|(' + $r.join('|') + ')'; //RE string

			var $r = [];
			$.each($statments,function($i,$v){
				$r[$i]= $v + '(?!\\w)'
			});
			$re += '|(' + $r.join('|') + ')'; //RE string
			
			var $r = [];
			$.each($literals,function($i,$v){
				$r[$i]= $v + '(?!\\w)'
			});
			$re += '|(' + $r.join('|') + ')'; //RE string
			
			var $RE = new RegExp($re,"gm");   //RE
			
			var $html = {
				namedOperator: function($v){
					return '<span style="color:#9933CC">' + $v /*.replace(/<|>|&(?![a-z]+;)/g,$tr)*/ +'</span>';
				},
				pairOperator: function($v){
					return '<span style="color:#336699">' + $v /*.replace(/<|>|&(?![a-z]+;)/g,$tr)*/ +'</span>';
				},
				operator: function($v){
					return '<span style="color:#006666">' + $v /*.replace(/<|>|&(?![a-z]+;)/g,$tr)*/ +'</span>';
				},
				syntax: function($v){
					return '<span style="color:#003333">' + $v + '</span>';
				},
				constructors: function($v){
					return '<span style="color:#009933">' + $v + '</span>';
				},
				statments: function($v){
					return '<span style="color:#CC6600">' + $v + '</span>';
				},
				literals: function($v){
					return '<span style="color:#993300">' + $v + '</span>';
				},
				string1: function($v){
					return '<span style="color:#CC0066">\'</span>'
					+ '<span style="color:#66CC66">' + $v.replace(/<|>|&/g,$tr) + '</span>'
					+ '<span style="color:#CC0066">\'</span>';
				},
				string2: function($v){
					return '<span style="color:#CC0066">"</span>'
					+ '<span style="color:#66CC66">' + $v.replace(/<|>|&/g,$tr) + '</span>'
					+ '<span style="color:#CC0066">"</span>';
				},
				coment1: function($v){
					return '<span style="color:#336600">//</span>'
					+ '<span style="color:#666633">' + $v.replace(/<|>|&/g,$tr) + '</span>';
				},
				coment2: function($v){
					$v = $v.replace(/<|>|&(?![a-z]+;)/g,$tr).replace(/\r*\n/g,'</span>$&<span style="color:#666633">');
					return '<span style="color:#336600">/*</span>'
					+ '<span style="color:#666633">' + $v + '</span>'
					+ '<span style="color:#336600">*/</span>';
				},
				pattern: function($v){
					return '<span style="color:#CC00FF">/</span>'
					+ '<span style="color:#CC6633">' + $v + '</span>'
					+ '<span style="color:#CC00FF">/</span>';
				}
			};
			var $replace = function($_m,$s1,$s2,$c1,$c2,$pt,$nop,$pop,$op,$sy,$co,$st,$li,$_index,$_string){
				//console.log('arguments->',arguments);				
				if ($s1){return $html.string1($s1)}
				else if ($s2){return $html.string2($s2)}
				else if ($c1){return $html.coment1($c1)}
				else if ($c2){return $html.coment2($c2)}
				else if ($pt){return $html.pattern($pt)}
				else if ($nop){
					console.log('nop=%s,m=%s,i=%i',$nop,$_m,$_index);
					return ($_index > 0  && $_string.substr($_index - 1, 1).match(/[a-z$]/i)) ? 
						$nop : $html.namedOperator($nop)
				}else if ($pop){return $html.pairOperator($pop)}
				else if ($op){return $html.operator($op)}
				else if ($sy){return $html.syntax($sy)}
				else if ($co){
					return ($_index > 0  && $_string.substr($_index - 1, 1).match(/[a-z]/i)) ? 
						$co : $html.constructors($co)
				}else if ($st){
					return ($_index > 0  && $_string.substr($_index - 1, 1).match(/[a-z]/i)) ? 
						$st: $html.statments($st)
				}else if ($li){
					return ($_index > 0  && $_string.substr($_index - 1, 1).match(/[a-z]/i)) ? 
						$li : $html.literals($li)
				}
				return $_m; //should never occurs, but just in case, return the matched pattern	
			}
			//console.log($re);
			return function($code){
				return $code.replace($RE,$replace)
			}
		})()
	};
	var $list = function($code){
			var $lines = $code.split(/\r?\n/);
			var $ol = '<ol class="jHighlight">';
			$.each($lines,function(i,$l){
				if (!$l) $l = ' ';
				//$l = $l.replace(/  /g,'&nbsp;&nbsp;').replace(/\t/,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
				//$ol += '\n<li><pre>' + $l + '</pre></li>';
				$ol += '\n<li>' + $l + '</li>';
			})
			return $ol + '</ol>';
	}
	var $imethods = {
		html: function($type){	
			var $self = $(this);
			var $code = $transform.html($self.html());
			return $list($code);
		},
		javascript: function($type){	
			var $self = $(this);
			//console.log($self.html());
			var $code = $transform.javascript($self.html());
			return $list($code);
		}
	}
	$.fn.jHighlight = function($method){
		if ($imethods[$method]){
	  		return $imethods[$method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if ($method instanceof Object || ! $method){
	  		return $imethods.html.apply(this, arguments);
		} else {
	  		$.error('Method ' +  $method + ' does not exist on jQuery.jHighlight plugin');
		}	
	};
	var $smethods = {
		html: function($code){	
			return $list($transform.html($code));
		}
	}
	$.jHighlight = function($method){
		if ($smethods[$method]){
	  		return $smethods[$method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else {
	  		$.error('Method ' +  $method + ' does not exist on jQuery.jHighlight plugin');
		}	
	};
})(jQuery);
