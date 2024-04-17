(()=>{var Ee=Object.create;var Y=Object.defineProperty;var xe=Object.getOwnPropertyDescriptor;var Te=Object.getOwnPropertyNames;var Ie=Object.getPrototypeOf,be=Object.prototype.hasOwnProperty;var Le=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,n)=>(typeof require<"u"?require:t)[n]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var Me=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var we=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Te(t))!be.call(e,s)&&s!==n&&Y(e,s,{get:()=>t[s],enumerable:!(r=xe(t,s))||r.enumerable});return e};var De=(e,t,n)=>(n=e!=null?Ee(Ie(e)):{},we(t||!e||!e.__esModule?Y(n,"default",{value:e,enumerable:!0}):n,e));var ee=Me((Ve,G)=>{function q(e){this.mode=T.MODE_8BIT_BYTE,this.data=e,this.parsedData=[];for(var t=0,n=this.data.length;t<n;t++){var r=[],s=this.data.charCodeAt(t);s>65536?(r[0]=240|(s&1835008)>>>18,r[1]=128|(s&258048)>>>12,r[2]=128|(s&4032)>>>6,r[3]=128|s&63):s>2048?(r[0]=224|(s&61440)>>>12,r[1]=128|(s&4032)>>>6,r[2]=128|s&63):s>128?(r[0]=192|(s&1984)>>>6,r[1]=128|s&63):r[0]=s,this.parsedData.push(r)}this.parsedData=Array.prototype.concat.apply([],this.parsedData),this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}q.prototype={getLength:function(e){return this.parsedData.length},write:function(e){for(var t=0,n=this.parsedData.length;t<n;t++)e.put(this.parsedData[t],8)}};function D(e,t){this.typeNumber=e,this.errorCorrectLevel=t,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}D.prototype={addData:function(e){var t=new q(e);this.dataList.push(t),this.dataCache=null},isDark:function(e,t){if(e<0||this.moduleCount<=e||t<0||this.moduleCount<=t)throw new Error(e+","+t);return this.modules[e][t]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(e,t){this.moduleCount=this.typeNumber*4+17,this.modules=new Array(this.moduleCount);for(var n=0;n<this.moduleCount;n++){this.modules[n]=new Array(this.moduleCount);for(var r=0;r<this.moduleCount;r++)this.modules[n][r]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(e,t),this.typeNumber>=7&&this.setupTypeNumber(e),this.dataCache==null&&(this.dataCache=D.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,t)},setupPositionProbePattern:function(e,t){for(var n=-1;n<=7;n++)if(!(e+n<=-1||this.moduleCount<=e+n))for(var r=-1;r<=7;r++)t+r<=-1||this.moduleCount<=t+r||(0<=n&&n<=6&&(r==0||r==6)||0<=r&&r<=6&&(n==0||n==6)||2<=n&&n<=4&&2<=r&&r<=4?this.modules[e+n][t+r]=!0:this.modules[e+n][t+r]=!1)},getBestMaskPattern:function(){for(var e=0,t=0,n=0;n<8;n++){this.makeImpl(!0,n);var r=d.getLostPoint(this);(n==0||e>r)&&(e=r,t=n)}return t},createMovieClip:function(e,t,n){var r=e.createEmptyMovieClip(t,n),s=1;this.make();for(var i=0;i<this.modules.length;i++)for(var o=i*s,a=0;a<this.modules[i].length;a++){var l=a*s,c=this.modules[i][a];c&&(r.beginFill(0,100),r.moveTo(l,o),r.lineTo(l+s,o),r.lineTo(l+s,o+s),r.lineTo(l,o+s),r.endFill())}return r},setupTimingPattern:function(){for(var e=8;e<this.moduleCount-8;e++)this.modules[e][6]==null&&(this.modules[e][6]=e%2==0);for(var t=8;t<this.moduleCount-8;t++)this.modules[6][t]==null&&(this.modules[6][t]=t%2==0)},setupPositionAdjustPattern:function(){for(var e=d.getPatternPosition(this.typeNumber),t=0;t<e.length;t++)for(var n=0;n<e.length;n++){var r=e[t],s=e[n];if(this.modules[r][s]==null)for(var i=-2;i<=2;i++)for(var o=-2;o<=2;o++)i==-2||i==2||o==-2||o==2||i==0&&o==0?this.modules[r+i][s+o]=!0:this.modules[r+i][s+o]=!1}},setupTypeNumber:function(e){for(var t=d.getBCHTypeNumber(this.typeNumber),n=0;n<18;n++){var r=!e&&(t>>n&1)==1;this.modules[Math.floor(n/3)][n%3+this.moduleCount-8-3]=r}for(var n=0;n<18;n++){var r=!e&&(t>>n&1)==1;this.modules[n%3+this.moduleCount-8-3][Math.floor(n/3)]=r}},setupTypeInfo:function(e,t){for(var n=this.errorCorrectLevel<<3|t,r=d.getBCHTypeInfo(n),s=0;s<15;s++){var i=!e&&(r>>s&1)==1;s<6?this.modules[s][8]=i:s<8?this.modules[s+1][8]=i:this.modules[this.moduleCount-15+s][8]=i}for(var s=0;s<15;s++){var i=!e&&(r>>s&1)==1;s<8?this.modules[8][this.moduleCount-s-1]=i:s<9?this.modules[8][15-s-1+1]=i:this.modules[8][15-s-1]=i}this.modules[this.moduleCount-8][8]=!e},mapData:function(e,t){for(var n=-1,r=this.moduleCount-1,s=7,i=0,o=this.moduleCount-1;o>0;o-=2)for(o==6&&o--;;){for(var a=0;a<2;a++)if(this.modules[r][o-a]==null){var l=!1;i<e.length&&(l=(e[i]>>>s&1)==1);var c=d.getMask(t,r,o-a);c&&(l=!l),this.modules[r][o-a]=l,s--,s==-1&&(i++,s=7)}if(r+=n,r<0||this.moduleCount<=r){r-=n,n=-n;break}}}};D.PAD0=236;D.PAD1=17;D.createData=function(e,t,n){for(var r=w.getRSBlocks(e,t),s=new j,i=0;i<n.length;i++){var o=n[i];s.put(o.mode,4),s.put(o.getLength(),d.getLengthInBits(o.mode,e)),o.write(s)}for(var a=0,i=0;i<r.length;i++)a+=r[i].dataCount;if(s.getLengthInBits()>a*8)throw new Error("code length overflow. ("+s.getLengthInBits()+">"+a*8+")");for(s.getLengthInBits()+4<=a*8&&s.put(0,4);s.getLengthInBits()%8!=0;)s.putBit(!1);for(;!(s.getLengthInBits()>=a*8||(s.put(D.PAD0,8),s.getLengthInBits()>=a*8));)s.put(D.PAD1,8);return D.createBytes(s,r)};D.createBytes=function(e,t){for(var n=0,r=0,s=0,i=new Array(t.length),o=new Array(t.length),a=0;a<t.length;a++){var l=t[a].dataCount,c=t[a].totalCount-l;r=Math.max(r,l),s=Math.max(s,c),i[a]=new Array(l);for(var u=0;u<i[a].length;u++)i[a][u]=255&e.buffer[u+n];n+=l;var p=d.getErrorCorrectPolynomial(c),b=new y(i[a],p.getLength()-1),E=b.mod(p);o[a]=new Array(p.getLength()-1);for(var u=0;u<o[a].length;u++){var h=u+E.getLength()-o[a].length;o[a][u]=h>=0?E.get(h):0}}for(var I=0,u=0;u<t.length;u++)I+=t[u].totalCount;for(var v=new Array(I),m=0,u=0;u<r;u++)for(var a=0;a<t.length;a++)u<i[a].length&&(v[m++]=i[a][u]);for(var u=0;u<s;u++)for(var a=0;a<t.length;a++)u<o[a].length&&(v[m++]=o[a][u]);return v};var T={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},C={L:1,M:0,Q:3,H:2},P={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},d={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(e){for(var t=e<<10;d.getBCHDigit(t)-d.getBCHDigit(d.G15)>=0;)t^=d.G15<<d.getBCHDigit(t)-d.getBCHDigit(d.G15);return(e<<10|t)^d.G15_MASK},getBCHTypeNumber:function(e){for(var t=e<<12;d.getBCHDigit(t)-d.getBCHDigit(d.G18)>=0;)t^=d.G18<<d.getBCHDigit(t)-d.getBCHDigit(d.G18);return e<<12|t},getBCHDigit:function(e){for(var t=0;e!=0;)t++,e>>>=1;return t},getPatternPosition:function(e){return d.PATTERN_POSITION_TABLE[e-1]},getMask:function(e,t,n){switch(e){case P.PATTERN000:return(t+n)%2==0;case P.PATTERN001:return t%2==0;case P.PATTERN010:return n%3==0;case P.PATTERN011:return(t+n)%3==0;case P.PATTERN100:return(Math.floor(t/2)+Math.floor(n/3))%2==0;case P.PATTERN101:return t*n%2+t*n%3==0;case P.PATTERN110:return(t*n%2+t*n%3)%2==0;case P.PATTERN111:return(t*n%3+(t+n)%2)%2==0;default:throw new Error("bad maskPattern:"+e)}},getErrorCorrectPolynomial:function(e){for(var t=new y([1],0),n=0;n<e;n++)t=t.multiply(new y([1,g.gexp(n)],0));return t},getLengthInBits:function(e,t){if(1<=t&&t<10)switch(e){case T.MODE_NUMBER:return 10;case T.MODE_ALPHA_NUM:return 9;case T.MODE_8BIT_BYTE:return 8;case T.MODE_KANJI:return 8;default:throw new Error("mode:"+e)}else if(t<27)switch(e){case T.MODE_NUMBER:return 12;case T.MODE_ALPHA_NUM:return 11;case T.MODE_8BIT_BYTE:return 16;case T.MODE_KANJI:return 10;default:throw new Error("mode:"+e)}else if(t<41)switch(e){case T.MODE_NUMBER:return 14;case T.MODE_ALPHA_NUM:return 13;case T.MODE_8BIT_BYTE:return 16;case T.MODE_KANJI:return 12;default:throw new Error("mode:"+e)}else throw new Error("type:"+t)},getLostPoint:function(e){for(var t=e.getModuleCount(),n=0,r=0;r<t;r++)for(var s=0;s<t;s++){for(var i=0,o=e.isDark(r,s),a=-1;a<=1;a++)if(!(r+a<0||t<=r+a))for(var l=-1;l<=1;l++)s+l<0||t<=s+l||a==0&&l==0||o==e.isDark(r+a,s+l)&&i++;i>5&&(n+=3+i-5)}for(var r=0;r<t-1;r++)for(var s=0;s<t-1;s++){var c=0;e.isDark(r,s)&&c++,e.isDark(r+1,s)&&c++,e.isDark(r,s+1)&&c++,e.isDark(r+1,s+1)&&c++,(c==0||c==4)&&(n+=3)}for(var r=0;r<t;r++)for(var s=0;s<t-6;s++)e.isDark(r,s)&&!e.isDark(r,s+1)&&e.isDark(r,s+2)&&e.isDark(r,s+3)&&e.isDark(r,s+4)&&!e.isDark(r,s+5)&&e.isDark(r,s+6)&&(n+=40);for(var s=0;s<t;s++)for(var r=0;r<t-6;r++)e.isDark(r,s)&&!e.isDark(r+1,s)&&e.isDark(r+2,s)&&e.isDark(r+3,s)&&e.isDark(r+4,s)&&!e.isDark(r+5,s)&&e.isDark(r+6,s)&&(n+=40);for(var u=0,s=0;s<t;s++)for(var r=0;r<t;r++)e.isDark(r,s)&&u++;var p=Math.abs(100*u/t/t-50)/5;return n+=p*10,n}},g={glog:function(e){if(e<1)throw new Error("glog("+e+")");return g.LOG_TABLE[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return g.EXP_TABLE[e]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(f=0;f<8;f++)g.EXP_TABLE[f]=1<<f;var f;for(f=8;f<256;f++)g.EXP_TABLE[f]=g.EXP_TABLE[f-4]^g.EXP_TABLE[f-5]^g.EXP_TABLE[f-6]^g.EXP_TABLE[f-8];var f;for(f=0;f<255;f++)g.LOG_TABLE[g.EXP_TABLE[f]]=f;var f;function y(e,t){if(e.length==null)throw new Error(e.length+"/"+t);for(var n=0;n<e.length&&e[n]==0;)n++;this.num=new Array(e.length-n+t);for(var r=0;r<e.length-n;r++)this.num[r]=e[r+n]}y.prototype={get:function(e){return this.num[e]},getLength:function(){return this.num.length},multiply:function(e){for(var t=new Array(this.getLength()+e.getLength()-1),n=0;n<this.getLength();n++)for(var r=0;r<e.getLength();r++)t[n+r]^=g.gexp(g.glog(this.get(n))+g.glog(e.get(r)));return new y(t,0)},mod:function(e){if(this.getLength()-e.getLength()<0)return this;for(var t=g.glog(this.get(0))-g.glog(e.get(0)),n=new Array(this.getLength()),r=0;r<this.getLength();r++)n[r]=this.get(r);for(var r=0;r<e.getLength();r++)n[r]^=g.gexp(g.glog(e.get(r))+t);return new y(n,0).mod(e)}};function w(e,t){this.totalCount=e,this.dataCount=t}w.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];w.getRSBlocks=function(e,t){var n=w.getRsBlockTable(e,t);if(n==null)throw new Error("bad rs block @ typeNumber:"+e+"/errorCorrectLevel:"+t);for(var r=n.length/3,s=[],i=0;i<r;i++)for(var o=n[i*3+0],a=n[i*3+1],l=n[i*3+2],c=0;c<o;c++)s.push(new w(a,l));return s};w.getRsBlockTable=function(e,t){switch(t){case C.L:return w.RS_BLOCK_TABLE[(e-1)*4+0];case C.M:return w.RS_BLOCK_TABLE[(e-1)*4+1];case C.Q:return w.RS_BLOCK_TABLE[(e-1)*4+2];case C.H:return w.RS_BLOCK_TABLE[(e-1)*4+3];default:return}};function j(){this.buffer=[],this.length=0}j.prototype={get:function(e){var t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(var n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){var t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var F=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];function K(e){var t=this;if(this.options={padding:4,width:256,height:256,typeNumber:4,color:"#000000",background:"#ffffff",ecl:"M"},typeof e=="string"&&(e={content:e}),e)for(var n in e)this.options[n]=e[n];if(typeof this.options.content!="string")throw new Error("Expected 'content' as string!");if(this.options.content.length===0)throw new Error("Expected 'content' to be non-empty!");if(!(this.options.padding>=0))throw new Error("Expected 'padding' value to be non-negative!");if(!(this.options.width>0)||!(this.options.height>0))throw new Error("Expected 'width' or 'height' value to be higher than zero!");function r(c){switch(c){case"L":return C.L;case"M":return C.M;case"Q":return C.Q;case"H":return C.H;default:throw new Error("Unknwon error correction level: "+c)}}function s(c,u){for(var p=i(c),b=1,E=0,h=0,I=F.length;h<=I;h++){var v=F[h];if(!v)throw new Error("Content too long: expected "+E+" but got "+p);switch(u){case"L":E=v[0];break;case"M":E=v[1];break;case"Q":E=v[2];break;case"H":E=v[3];break;default:throw new Error("Unknwon error correction level: "+u)}if(p<=E)break;b++}if(b>F.length)throw new Error("Content too long");return b}function i(c){var u=encodeURI(c).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return u.length+(u.length!=c?3:0)}var o=this.options.content,a=s(o,this.options.ecl),l=r(this.options.ecl);this.qrcode=new D(a,l),this.qrcode.addData(o),this.qrcode.make()}K.prototype.svg=function(e){var t=this.options||{},n=this.qrcode.modules;typeof e>"u"&&(e={container:t.container||"svg"});for(var r=typeof t.pretty<"u"?!!t.pretty:!0,s=r?"  ":"",i=r?`\r
`:"",o=t.width,a=t.height,l=n.length,c=o/(l+2*t.padding),u=a/(l+2*t.padding),p=typeof t.join<"u"?!!t.join:!1,b=typeof t.swap<"u"?!!t.swap:!1,E=typeof t.xmlDeclaration<"u"?!!t.xmlDeclaration:!0,h=typeof t.predefined<"u"?!!t.predefined:!1,I=h?s+'<defs><path id="qrmodule" d="M0 0 h'+u+" v"+c+' H0 z" style="fill:'+t.color+';shape-rendering:crispEdges;" /></defs>'+i:"",v=s+'<rect x="0" y="0" width="'+o+'" height="'+a+'" style="fill:'+t.background+';shape-rendering:crispEdges;"/>'+i,m="",J="",O=0;O<l;O++)for(var Q=0;Q<l;Q++){var ve=n[Q][O];if(ve){var L=Q*c+t.padding*c,M=O*u+t.padding*u;if(b){var pe=L;L=M,M=pe}if(p){var S=c+L,H=u+M;L=Number.isInteger(L)?Number(L):L.toFixed(2),M=Number.isInteger(M)?Number(M):M.toFixed(2),S=Number.isInteger(S)?Number(S):S.toFixed(2),H=Number.isInteger(H)?Number(H):H.toFixed(2),J+="M"+L+","+M+" V"+H+" H"+S+" V"+M+" H"+L+" Z "}else h?m+=s+'<use x="'+L.toString()+'" y="'+M.toString()+'" href="#qrmodule" />'+i:m+=s+'<rect x="'+L.toString()+'" y="'+M.toString()+'" width="'+c+'" height="'+u+'" style="fill:'+t.color+';shape-rendering:crispEdges;"/>'+i}}p&&(m=s+'<path x="0" y="0" style="fill:'+t.color+';shape-rendering:crispEdges;" d="'+J+'" />');var x="";switch(e.container){case"svg":E&&(x+='<?xml version="1.0" standalone="yes"?>'+i),x+='<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+o+'" height="'+a+'">'+i,x+=I+v+m,x+="</svg>";break;case"svg-viewbox":E&&(x+='<?xml version="1.0" standalone="yes"?>'+i),x+='<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 '+o+" "+a+'">'+i,x+=I+v+m,x+="</svg>";break;case"g":x+='<g width="'+o+'" height="'+a+'">'+i,x+=I+v+m,x+="</g>";break;default:x+=(I+v+m).replace(/^\s+/,"");break}return x};K.prototype.save=function(e,t){var n=this.svg();typeof t!="function"&&(t=function(s,i){});try{var r=Le("fs");r.writeFile(e,n,t)}catch(s){t(s)}};typeof G<"u"&&(G.exports=K)});var ne=De(ee());function $(e){return/^(\d{5}-){7}\d{5}$/.test(e)?e.split("-").map(n=>parseInt(n,10)).every(n=>n<=65535):!1}var Be=90;function N(e){if(e<0||e>99)throw new Error("Value must be between 0 and 99");return e.toString(10).padStart(2,"0")}function _e(e){if(e<0||e>255)throw new Error("Value must be between 0 and 255");return e.toString(10).padStart(3,"0")}function B(e){if(e<0||e>65535)throw new Error("Value must be between 0 and 65535");return e.toString(10).padStart(5,"0")}function R(e,t,n){let r=e<<1|(t?1:0);return`${N(r)}${N(n.length)}${n}`}function te(e,t=Math.max(...e),n=1){let r=0;for(let s=n;s<=t;s++)e.includes(s)&&(r|=2**(s-n));return r}function Pe(e){if(!$(e))throw new Error('The DSK must be in the form "aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-11111-22222"');return e.split("-").map(t=>parseInt(t,10))}function Ce(e){let t=[];for(let n=0;n<e.length;n+=2)t.push(parseInt(e.slice(n,n+2),16));return t}async function Ae(e,t=256){let n=[],r=_e(te(e.securityClasses,void 0,0));n.push(r);let s=Pe(e.dsk).map(h=>B(h));n.push(...s);let i=R(0,!1,[B(e.genericDeviceClass<<8|e.specificDeviceClass),B(e.specificDeviceClass)].join(""));n.push(i);let o=e.applicationVersion.split(".",2).map(h=>parseInt(h,10)),a=R(1,!1,[B(e.manufacturerId),B(e.productType),B(e.productId),B(o[0]<<8|o[1])].join(""));if(n.push(a),e.maxInclusionRequestInterval!==void 0){let h=R(2,!1,B(e.maxInclusionRequestInterval));n.push(h)}if(e.uuid!==void 0){let h=Ce(e.uuid),I=[];for(let m=0;m<h.length;m+=2)I.push(h[m]<<8|h[m+1]);let v=R(3,!1,I.map(m=>B(m)).join(""));n.push(v)}if(e.supportedProtocols!==void 0){let h=R(4,!1,N(te(e.supportedProtocols,void 0,0)));n.push(h)}let l=n.join(""),c=new TextEncoder().encode(l),u=Array.from(new Uint8Array(await window.crypto.subtle.digest("SHA-1",c))),p=u[0]<<8|u[1],b=`${N(Be)}${N(e.version)}${B(p)}${l}`,E=new ne.default({content:b,container:"none",xmlDeclaration:!1,width:t,height:t}).svg();return{text:b,svg:E}}var re=document.getElementById("security-class_s2-access"),se=document.getElementById("security-class_s2-authenticated"),ie=document.getElementById("security-class_s2-unauthenticated"),ae=document.getElementById("security-class_s0"),U=document.getElementById("protocol"),X=document.getElementById("protocol_zwave"),z=document.getElementById("protocol_zwlr"),oe=document.getElementById("dsk"),ue=document.getElementById("device-class_generic"),le=document.getElementById("device-class_specific"),ce=document.getElementById("device-class_icon"),ye=document.getElementById("device-class_generic_hex"),ke=document.getElementById("device-class_specific_hex"),Se=document.getElementById("device-class_icon_hex"),de=document.getElementById("manufacturer-id"),he=document.getElementById("product-type"),fe=document.getElementById("product-id"),ge=document.getElementById("version-major"),me=document.getElementById("version-minor"),He=document.getElementById("manufacturer-id_hex"),Re=document.getElementById("product-type_hex"),Ne=document.getElementById("product-id_hex"),_=document.getElementById("error-message"),Z=document.getElementById("generate"),Oe=document.getElementById("qr-code-text"),V=document.getElementById("qr-code");function W(e){let t=e.value.trim();if(/^[0-9]+$/.test(t))return parseInt(t,10)}function A(e){let t=e.value.trim();if(/^[0-9]+$/.test(t))return parseInt(t,10);if(/^(0x)?[0-9a-fA-F]+$/.test(t))return t.startsWith("0x")?parseInt(t.slice(2),16):parseInt(t,16)}function Qe(){X.disabled=!U.checked,z.disabled=!U.checked,k()}function Ue(e,t){let n=A(e),r=parseInt(e.min),s=parseInt(e.max);n===void 0?t.innerText="(invalid)":(n=Math.min(s,Math.max(r,n)),t.innerText="0x"+n.toString(16).padStart(4,"0"))}function Fe(e,t){let n=A(e),r=parseInt(e.min),s=parseInt(e.max);n===void 0?(e.value=e.min,t.innerText="0x"+parseInt(e.min).toString(16).padStart(4,"0")):(n=Math.min(s,Math.max(r,n)),e.value=n.toString(10),t.innerText="0x"+n.toString(16).padStart(4,"0"),k())}function Ge(e){let t=W(e),n=parseInt(e.min),r=parseInt(e.max);t===void 0?e.value=e.min:(t=Math.min(r,Math.max(n,t)),e.value=t.toString(10),k())}function Ke(){let e=[];re.checked&&e.push(2),se.checked&&e.push(1),ie.checked&&e.push(0),ae.checked&&e.push(7);let t;U.checked&&(t=[],X.checked&&t.push(0),z.checked&&t.push(1));let n=oe.value.trim();if(!$(n)){_.innerText="The DSK is not valid. It must be in the form 'xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx' with each block between 0 and 65535.";return}let r=A(ue);if(r===void 0){_.innerText="The generic device class must be a number";return}let s=A(le);if(s===void 0){_.innerText="The specific device class must be a number";return}let i=A(ce);if(i===void 0){_.innerText="The installer icon type must be a number";return}let o=A(de);if(o===void 0){_.innerText="The manufacturer ID must be a number";return}let a=A(he);if(a===void 0){_.innerText="The product type must be a number";return}let l=A(fe);if(l===void 0){_.innerText="The product ID must be a number";return}let c=W(ge);if(c===void 0){_.innerText="The major version must be a number";return}let u=W(me);if(u===void 0){_.innerText="The minor version must be a number";return}let p=`${c}.${u}`;return{version:1,securityClasses:e,supportedProtocols:t,dsk:n,genericDeviceClass:r,specificDeviceClass:s,manufacturerId:o,productType:a,productId:l,installerIconType:i,applicationVersion:p}}async function k(){let e=Ke();if(e)Z.disabled=!1;else{Z.disabled=!0;return}let{text:t,svg:n}=await Ae(e,V.clientWidth||V.clientHeight);Oe.value=t,V.innerHTML=n}for(let e of[ae,re,se,ie,X,z])e.addEventListener("change",k);U.addEventListener("change",Qe);for(let[e,t]of[[ue,ye],[le,ke],[ce,Se],[de,He],[he,Re],[fe,Ne]])e.addEventListener("input",()=>Ue(e,t)),e.addEventListener("blur",()=>Fe(e,t));for(let e of[ge,me])e.addEventListener("blur",()=>Ge(e));oe.onblur=k;Z.onclick=k;})();
//# sourceMappingURL=script.js.map