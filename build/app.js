angular.module("app",["ui.bootstrap"]),angular.module("app").constant("appConfig",{TIMESTAMP:"timestamp",EXCLUDE_FIELDS:[],HEADER_SKIPPED_ROWS:2,ZOOM:"HighlightSelector",NONE_VALUE_REPLACEMENT:0,BUFFER_SIZE:1e3,SLIDING_WINDOW:!1,LOCAL_CHUNK_SIZE:65536,REMOTE_CHUNK_SIZE:65536}),angular.module("app").controller("appCtrl",["$scope","$http","$timeout","appConfig",function(e,i,n,t){function a(e,i,n){function a(t,a,l){var r=n.toDomXCoord(t),o=n.toDomXCoord(a),d=o-r;e.fillStype=l,e.fillRect(r,i.y,d,i.h)}var o="rgba(0, 255, 10, 1.0)",d="anomalyScore",u=.8,f=10;a(30,200,o);var s=r.indexOf(d),p=r.indexOf(t.TIMESTAMP),g=0,h=l.map(function(e){return e[p]});sz=l.length;for(var c=0;c<sz;c++)row=l[c],row[s]>u&&(g=row[p],it=h.lastIndexOf(g),console.log("found at"+g+" aka "+it),a(it-f,it+f,o))}e.view={fieldState:[],graph:null,dataField:null,optionsVisible:!0,filePath:"",loadedFileName:"",errors:[],loading:!1};var l=[],r=[],o=[],d={},u=!1,f=0;e.toggleOptions=function(){e.view.optionsVisible=!e.view.optionsVisible,e.view.graph&&(d.resize=n(function(){e.view.graph.resize()}))},e.getRemoteFile=function(){e.$broadcast("fileUploadChange"),e.view.loading=!0,i.head(e.view.filePath,{headers:{Range:"bytes=0-32"}}).then(function(i){206===i.status?c(e.view.filePath):h(e.view.filePath)},function(){h(e.view.filePath)})},e.canDownload=function(){var i=e.view.filePath.split("://");return("https"===i[0]||"http"===i[0])&&i.length>1&&i[1].length>0?!0:!1},e.getLocalFile=function(i){e.view.filePath=i.target.files[0].name,e.view.loading=!0,v(i.target.files[0])};var s=function(e){var i=e.split("/");return i[i.length-1]},p=function(i){for(var n=0;n<i.length;n++){for(var a=[],d=0;d<r.length;d++){var s=r[d],p=u&&s===t.TIMESTAMP?f++:i[n][s];s===t.TIMESTAMP?"number"==typeof p||("string"==typeof p&&null!==w(p)?p=w(p):(m("Parsing timestamp failed, fallback to using iteration number","warning",!0),p=f)):"None"===p&&(p=t.NONE_VALUE_REPLACEMENT),a.push(p)}t.SLIDING_WINDOW&&l.length>t.BUFFER_SIZE&&(l.shift(),o.shift()),l.push(a),o.push(angular.extend([],a))}null===e.view.graph?b():e.view.graph.updateOptions({file:l}),e.$apply()},g=function(){e.view.fieldState.length=0,e.view.graph=null,e.view.dataField=null,e.view.errors.length=0,e.view.loadedFileName="",u=!1,f=0,l.length=0,r.length=0},h=function(i){g(),Papa.parse(i,{download:!0,skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",complete:function(n){angular.isDefined(n.data)?(e.view.loadedFileName=s(i),r=y(n.data[n.data.length-1],t.EXCLUDE_FIELDS),n.data.splice(0,t.HEADER_SKIPPED_ROWS),p(n.data)):m("An error occurred when attempting to download file.","danger"),e.view.loading=!1,e.$apply()},error:function(i){m("Could not download file.","danger"),e.view.loading=!1}})},c=function(i){g(),Papa.RemoteChunkSize=t.REMOTE_CHUNK_SIZE;var n=!1;Papa.parse(i,{download:!0,skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",chunk:function(e){n||(r=y(e.data[e.data.length-1],t.EXCLUDE_FIELDS),n=!0),p(e.data)},beforeFirstChunk:function(n){e.view.loadedFileName=s(i);var a=n.split(/\r\n|\r|\n/);return a.splice(1,t.HEADER_SKIPPED_ROWS),e.view.loading=!1,a.join("\n")},error:function(i){m("Could not stream file.","danger"),e.view.loading=!1}})},v=function(i){g(),Papa.LocalChunkSize=t.LOCAL_CHUNK_SIZE;var n=!1;Papa.parse(i,{skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",chunk:function(e){n||(r=y(e.data[e.data.length-1],t.EXCLUDE_FIELDS),n=!0),p(e.data)},beforeFirstChunk:function(n){e.view.loadedFileName=i.name;var a=n.split(/\r\n|\r|\n/);return a.splice(1,t.HEADER_SKIPPED_ROWS),e.view.loading=!1,a.join("\n")},error:function(i){m(i,"danger"),e.view.loading=!1}})},m=function(i,n,t){if(t="undefined"!=typeof t?t:!1,exists=!1,t){errs=e.view.errors;for(var a=0;a<errs.length;a++)if(errs[a].message===i)return}e.view.errors.push({message:i,type:n}),e.$apply()};e.clearErrors=function(){e.view.errors.length=0},e.clearError=function(i){e.view.errors.splice(i,1)};var w=function(e){var i=new Date(e);if("Invalid Date"!==i.toString())return i;var n=String(e).split(" "),t=[],a=n[0].split("/"),l=n[0].split("-");if(1===a.length&&1===l.length||a.length>1&&l.length>1)return m("Could not parse the timestamp","warning",!0),null;if(l.length>2)t.push(l[0]),t.push(l[1]),t.push(l[2]);else{if(!(a.length>2))return m("There was something wrong with the date in the timestamp field.","warning",!0),null;t.push(a[2]),t.push(a[0]),t.push(a[1])}if(n[1]){var r=n[1].split(":");t=t.concat(r)}for(var o=0;o<t.length;o++)t[o]=parseInt(t[o]);return i=new Function.prototype.bind.apply(Date,[null].concat(t)),"Invalid Date"===i.toString()?(m("The timestamp appears to be invalid.","warning",!0),null):i};e.normalizeField=function(i){var n=i+1;if(null===e.view.dataField)return void console.warn("No data field is set");for(var t=parseInt(e.view.dataField)+1,a=function(e,i){return Math[i].apply(null,e)},r=[],o=[],d=0;d<l.length;d++)"number"==typeof l[d][t]&&"number"==typeof l[d][n]&&(r.push(l[d][t]),o.push(l[d][n]));for(var u=a(r,"max")-a(r,"min"),f=a(o,"max")-a(o,"min"),s=u/f,p=0;p<l.length;p++)l[p][n]=parseFloat((l[p][n]*s).toFixed(10));e.view.graph.updateOptions({file:l})},e.denormalizeField=function(i){for(var n=i+1,t=0;t<l.length;t++)l[t][n]=o[t][n];e.view.graph.updateOptions({file:l})},e.renormalize=function(){for(var i=0;i<e.view.fieldState.length;i++)e.view.fieldState[i].normalized&&e.normalizeField(e.view.fieldState[i].id)};var E=function(i,n){for(var t=0;t<e.view.fieldState.length;t++)if(e.view.fieldState[t].name===i){e.view.fieldState[t].value=n;break}},S=function(i){for(var n=0;n<i.length;n++)e.view.fieldState[n].color=i[n]},y=function(e,i){e.hasOwnProperty(t.TIMESTAMP)||(m("No timestamp field was found, using iterations instead","info"),u=!0);var n=[];return angular.forEach(e,function(e,a){"number"==typeof e&&-1===i.indexOf(a)&&a!==t.TIMESTAMP&&n.push(a)}),n.unshift(t.TIMESTAMP),n};e.toggleVisibility=function(i){e.view.graph.setVisibility(i.id,i.visible),i.visible||(i.value=null)},e.showHideAll=function(i){for(var n=0;n<e.view.fieldState.length;n++)e.view.fieldState[n].visible=i,e.view.graph.setVisibility(e.view.fieldState[n].id,i),i||(e.view.fieldState[n].value=null)};var b=function(){var i=document.getElementById("dataContainer");e.view.fieldState.length=0,e.view.dataField=null;for(var n=0,o=u,d=0;d<r.length;d++){var f=r[d];f===t.TIMESTAMP||o?o=!1:(e.view.fieldState.push({name:f,id:n,visible:!0,normalized:!1,value:null,color:"rgb(0,0,0)"}),n++)}e.view.graph=new Dygraph(i,l,{labels:r,labelsUTC:!1,showLabelsOnHighlight:!1,xlabel:"Time",ylabel:"Values",strokeWidth:1,pointClickCallback:function(e,i){timestamp=moment(i.xval),timestampString=timestamp.format("YYYY-MM-DD HH:mm:ss.SSS000"),window.prompt("Copy to clipboard: Ctrl+C, Enter",timestampString)},animatedZooms:!0,showRangeSelector:"RangeSelector"===t.ZOOM,highlightCallback:function(i,n,t,a,l){for(var r=0;r<t.length;r++)E(t[r].name,t[r].yval);e.$apply()},drawCallback:function(e,i){i&&S(e.getColors())},underlayCallback:a})};e.$on("$destroy",function(){angular.forEach(d,function(e){n.cancel(e)})})}]),angular.module("app").directive("fileUploadChange",function(){return{restrict:"A",link:function(e,i,n){var t=e.$eval(n.fileUploadChange);i.on("change",t);var a=e.$on("fileUploadChange",function(){angular.element(i).val(null)});e.$on("$destroy",function(){i.off(),a()})}}}),angular.module("app").directive("normalizeFields",function(){return{restrict:"A",scope:!1,template:'<td><input type="checkbox" ng-disabled="field.id === view.dataField || view.dataField === null" ng-model="field.normalized"></td><td><input type="radio" ng-disabled="field.normalized" ng-model="view.dataField" ng-value="{{field.id}}"></td>',link:function(e,i,n){var t={};t.normalized=e.$watch("field.normalized",function(i,n){i?e.normalizeField(e.field.id):i||i===n||e.denormalizeField(e.field.id)}),t.isData=e.$watch("view.dataField",function(){e.renormalize()}),e.$on("$destroy",function(){angular.forEach(t,function(e){e()})})}}});
