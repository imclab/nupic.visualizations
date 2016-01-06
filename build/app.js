angular.module("app",["ui.bootstrap"]),angular.module("app").constant("appConfig",{TIMESTAMP:"timestamp",EXCLUDE_FIELDS:[],HEADER_SKIPPED_ROWS:2,ZOOM:"HighlightSelector",NONE_VALUE_REPLACEMENT:0,BUFFER_SIZE:1e4,SLIDING_WINDOW:!1,MAX_FILE_SIZE:5e6,LOCAL_CHUNK_SIZE:65536,REMOTE_CHUNK_SIZE:65536}),angular.module("app").controller("appCtrl",["$scope","$http","$timeout","appConfig",function(e,i,n,a){e.view={fieldState:[],graph:null,dataField:null,optionsVisible:!0,filePath:"",loadedFileName:"",errors:[],loading:!1,windowing:{threshold:a.MAX_FILE_SIZE,show:!1,paused:!1,aborted:!1}};var t=[],l=[],r=[],o={},d=!1,u=0,s=a.SLIDING_WINDOW,f=null,p=!1;e.toggleOptions=function(){e.view.optionsVisible=!e.view.optionsVisible,e.view.graph&&(o.resize=n(function(){e.view.graph.resize()}))},e.getRemoteFile=function(){e.view.windowing.show=!1,e.view.windowing.paused=!1,e.view.windowing.aborted=!1,s=!1,e.$broadcast("fileUploadChange"),e.view.loading=!0,i.head(e.view.filePath,{headers:{Range:"bytes=0-32"}}).then(function(n){206===n.status?i.head(e.view.filePath).then(function(i){var n=i.headers("Content-Length");n>a.MAX_FILE_SIZE&&(s=!0,e.view.windowing.show=!0),c(e.view.filePath)}):w(e.view.filePath)},function(){w(e.view.filePath)})},e.canDownload=function(){var i=e.view.filePath.split("://");return("https"===i[0]||"http"===i[0])&&i.length>1&&i[1].length>0?!0:!1},e.abortParse=function(){angular.isDefined(f)&&angular.isDefined(f.abort)&&(f.abort(),e.view.windowing.paused=!1,e.view.windowing.aborted=!0)},e.pauseParse=function(){angular.isDefined(f)&&angular.isDefined(f.pause)&&(f.pause(),e.view.windowing.paused=!0)},e.resumeParse=function(){angular.isDefined(f)&&angular.isDefined(f.resume)&&(f.resume(),e.view.windowing.paused=!1)},e.getLocalFile=function(i){e.view.filePath=i.target.files[0].name,i.target.files[0].size>a.MAX_FILE_SIZE&&(s=!0,e.view.windowing.show=!0),e.view.loading=!0,m(i.target.files[0])};var g=function(e){var i=e.split("/");return i[i.length-1]},h=function(i){for(var n=0;n<i.length;n++){for(var o=[],f=-1,g=0;g<l.length;g++){var h=l[g],v=d&&h===a.TIMESTAMP?u++:i[n][h];h===a.TIMESTAMP?("number"==typeof v||("string"==typeof v&&null!==S(v)?v=S(v):(E("Parsing timestamp failed, fallback to using iteration number","warning",!0),v=u)),f>=v&&E("Your time is not monotonic at row"+n+"! Graphs are incorrect.","danger",!1),f=v):"None"===v&&(v=a.NONE_VALUE_REPLACEMENT),o.push(v)}s&&t.length>a.BUFFER_SIZE&&(t.shift(),r.shift()),t.push(o),r.push(angular.extend([],o))}null===e.view.graph?I():e.view.graph.updateOptions({file:t}),p||(e.$apply(),p=!0)},v=function(){e.view.fieldState.length=0,e.view.graph=null,e.view.dataField=null,e.view.errors.length=0,e.view.loadedFileName="",d=!1,u=0,t.length=0,l.length=0,p=!1},w=function(i){v(),Papa.parse(i,{download:!0,skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",complete:function(n){angular.isDefined(n.data)?(e.view.loadedFileName=g(i),l=y(n.data[n.data.length-1],a.EXCLUDE_FIELDS),n.data.splice(0,a.HEADER_SKIPPED_ROWS),h(n.data)):E("An error occurred when attempting to download file.","danger"),e.view.loading=!1,e.$apply()},error:function(i){e.view.loading=!1,E("Could not download file.","danger")}})},c=function(i){v(),Papa.RemoteChunkSize=a.REMOTE_CHUNK_SIZE;var n=!1;Papa.parse(i,{download:!0,skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",chunk:function(e,i){n||(f=i,l=y(e.data[e.data.length-1],a.EXCLUDE_FIELDS),n=!0),h(e.data)},beforeFirstChunk:function(n){e.view.loadedFileName=g(i);var t=n.split(/\r\n|\r|\n/);return t.splice(1,a.HEADER_SKIPPED_ROWS),e.view.loading=!1,t.join("\n")},error:function(i){E("Could not stream file.","danger"),e.view.loading=!1}})},m=function(i){v(),Papa.LocalChunkSize=a.LOCAL_CHUNK_SIZE;var n=!1;Papa.parse(i,{skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",chunk:function(e,i){n||(f=i,l=y(e.data[e.data.length-1],a.EXCLUDE_FIELDS),n=!0),h(e.data)},beforeFirstChunk:function(n){e.view.loadedFileName=i.name;var t=n.split(/\r\n|\r|\n/);return t.splice(1,a.HEADER_SKIPPED_ROWS),e.view.loading=!1,t.join("\n")},error:function(i){E(i,"danger"),e.view.loading=!1}})},E=function(i,n,a){if(a="undefined"!=typeof a?a:!1,exists=!1,a){errs=e.view.errors;for(var t=0;t<errs.length;t++)if(errs[t].message===i)return}e.view.errors.push({message:i,type:n}),e.$apply()};e.clearErrors=function(){e.view.errors.length=0},e.clearError=function(i){e.view.errors.splice(i,1)};var S=function(e){var i=new Date(e);if("Invalid Date"!==i.toString())return i;var n=String(e).split(" "),a=[],t=n[0].split("/"),l=n[0].split("-");if(1===t.length&&1===l.length||t.length>1&&l.length>1)return E("Could not parse the timestamp","warning",!0),null;if(l.length>2)a.push(l[0]),a.push(l[1]),a.push(l[2]);else{if(!(t.length>2))return E("There was something wrong with the date in the timestamp field.","warning",!0),null;a.push(t[2]),a.push(t[0]),a.push(t[1])}if(n[1]){var r=n[1].split(":");a=a.concat(r)}for(var o=0;o<a.length;o++)a[o]=parseInt(a[o]);return i=new Function.prototype.bind.apply(Date,[null].concat(a)),"Invalid Date"===i.toString()?(E("The timestamp appears to be invalid.","warning",!0),null):i};e.normalizeField=function(i){var n=i+1;if(null===e.view.dataField)return void console.warn("No data field is set");for(var a=parseInt(e.view.dataField)+1,l=function(e,i){return Math[i].apply(null,e)},r=[],o=[],d=0;d<t.length;d++)"number"==typeof t[d][a]&&"number"==typeof t[d][n]&&(r.push(t[d][a]),o.push(t[d][n]));for(var u=l(r,"max")-l(r,"min"),s=l(o,"max")-l(o,"min"),f=u/s,p=0;p<t.length;p++)t[p][n]=parseFloat((t[p][n]*f).toFixed(10));e.view.graph.updateOptions({file:t})},e.denormalizeField=function(i){for(var n=i+1,a=0;a<t.length;a++)t[a][n]=r[a][n];e.view.graph.updateOptions({file:t})},e.renormalize=function(){for(var i=0;i<e.view.fieldState.length;i++)e.view.fieldState[i].normalized&&e.normalizeField(e.view.fieldState[i].id)};var b=function(i,n){for(var a=0;a<e.view.fieldState.length;a++)if(e.view.fieldState[a].name===i){e.view.fieldState[a].value=n;break}},F=function(i){for(var n=0;n<i.length;n++)e.view.fieldState[n].color=i[n]},y=function(e,i){e.hasOwnProperty(a.TIMESTAMP)||(E("No timestamp field was found, using iterations instead","info"),d=!0);var n=[];return angular.forEach(e,function(e,t){"number"==typeof e&&-1===i.indexOf(t)&&t!==a.TIMESTAMP&&n.push(t)}),n.unshift(a.TIMESTAMP),n};e.toggleVisibility=function(i){e.view.graph.setVisibility(i.id,i.visible),i.visible||(i.value=null)},e.showHideAll=function(i){for(var n=0;n<e.view.fieldState.length;n++)e.view.fieldState[n].visible=i,e.view.graph.setVisibility(e.view.fieldState[n].id,i),i||(e.view.fieldState[n].value=null)};var I=function(){var i=document.getElementById("dataContainer");e.view.fieldState.length=0,e.view.dataField=null;for(var n=0,r=d,o=0;o<l.length;o++){var u=l[o];u===a.TIMESTAMP||r?r=!1:(e.view.fieldState.push({name:u,id:n,visible:!0,normalized:!1,value:null,color:"rgb(0,0,0)"}),n++)}e.view.graph=new Dygraph(i,t,{labels:l,labelsUTC:!1,showLabelsOnHighlight:!1,xlabel:"Time",ylabel:"Values",strokeWidth:1,pointClickCallback:function(e,i){timestamp=moment(i.xval),timestampString=timestamp.format("YYYY-MM-DD HH:mm:ss.SSS000"),window.prompt("Copy to clipboard: Ctrl+C, Enter",timestampString)},animatedZooms:!0,showRangeSelector:"RangeSelector"===a.ZOOM,highlightCallback:function(i,n,a,t,l){for(var r=0;r<a.length;r++)b(a[r].name,a[r].yval);e.$apply()},drawCallback:function(e,i){i&&F(e.getColors())}})};e.$on("$destroy",function(){angular.forEach(o,function(e){n.cancel(e)})})}]),angular.module("app").directive("fileUploadChange",function(){return{restrict:"A",link:function(e,i,n){var a=e.$eval(n.fileUploadChange);i.on("change",a);var t=e.$on("fileUploadChange",function(){angular.element(i).val(null)});e.$on("$destroy",function(){i.off(),t()})}}}),angular.module("app").directive("normalizeFields",function(){return{restrict:"A",scope:!1,template:'<td><input type="checkbox" ng-disabled="field.id === view.dataField || view.dataField === null" ng-model="field.normalized"></td><td><input type="radio" ng-disabled="field.normalized" ng-model="view.dataField" ng-value="{{field.id}}"></td>',link:function(e,i,n){var a={};a.normalized=e.$watch("field.normalized",function(i,n){i?e.normalizeField(e.field.id):i||i===n||e.denormalizeField(e.field.id)}),a.isData=e.$watch("view.dataField",function(){e.renormalize()}),e.$on("$destroy",function(){angular.forEach(a,function(e){e()})})}}}),angular.module("app").filter("bytes",function(){return function(e,i){if(isNaN(parseFloat(e))||!isFinite(e))return"-";"undefined"==typeof i&&(i=1);var n=["bytes","kB","MB","GB","TB","PB"],a=Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,Math.floor(a))).toFixed(i)+" "+n[a]}});