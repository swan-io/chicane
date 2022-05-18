"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[885],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return h}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=r.createContext({}),s=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},u=function(e){var n=s(e.components);return r.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=s(t),h=o,f=d["".concat(l,".").concat(h)]||d[h]||p[h]||a;return t?r.createElement(f,c(c({ref:n},u),{},{components:t})):r.createElement(f,c({ref:n},u))}));function h(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,c=new Array(a);c[0]=d;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var s=2;s<a;s++)c[s]=t[s];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2628:function(e,n,t){t.r(n),t.d(n,{assets:function(){return u},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return i},metadata:function(){return s},toc:function(){return p}});var r=t(7462),o=t(3366),a=(t(7294),t(3905)),c=["components"],i={title:"Lower-level API",sidebar_label:"Lower-level API"},l=void 0,s={unversionedId:"lower-level-api",id:"lower-level-api",title:"Lower-level API",description:"Even though you'll mostly need to consume the location through the Router, you might need to dive deeper at some point.",source:"@site/docs/lower-level-api.md",sourceDirName:".",slug:"/lower-level-api",permalink:"/chicane/lower-level-api",draft:!1,editUrl:"https://github.com/swan-io/chicane/edit/main/docs/docs/lower-level-api.md",tags:[],version:"current",frontMatter:{title:"Lower-level API",sidebar_label:"Lower-level API"},sidebar:"docs",previous:{title:"Hooks",permalink:"/chicane/hooks"}},u={},p=[{value:"getLocation",id:"getlocation",level:2},{value:"subscribeToLocation",id:"subscribetolocation",level:2},{value:"encodeSearch / decodeSearch",id:"encodesearch--decodesearch",level:2},{value:"pushUnsafe / replaceUnsafe",id:"pushunsafe--replaceunsafe",level:2}],d={toc:p};function h(e){var n=e.components,t=(0,o.Z)(e,c);return(0,a.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Even though you'll mostly need to consume the location through the ",(0,a.kt)("a",{parentName:"p",href:"./router"},"Router"),", you might need to dive deeper at some point."),(0,a.kt)("h2",{id:"getlocation"},"getLocation"),(0,a.kt)("p",null,"Returns the exploded location (a ",(0,a.kt)("a",{parentName:"p",href:"#getlocation"},"Location object"),")"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { getLocation /*, Location */ } from "@swan-io/chicane";\n\ntype Location = {\n  path: string[]; // path split on `/`\n  search: Record<string, string | string[]>;\n  hash?: string;\n  key: string; // a hash for the location\n  raw: { path: string; search: string; hash: string };\n  toString(): string; // returns the imploded location\n};\n\nconst location: Location = getLocation();\nconsole.log(location.path);\n')),(0,a.kt)("h2",{id:"subscribetolocation"},"subscribeToLocation"),(0,a.kt)("p",null,"Subscribes to location changes, and passes a ",(0,a.kt)("a",{parentName:"p",href:"#getlocation"},"Location object")," to the listener."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { subscribeToLocation } from "@swan-io/chicane";\n\nsubscribeToLocation((location: Location) => {\n  console.log("Location changed!");\n  console.log(location);\n});\n')),(0,a.kt)("h2",{id:"encodesearch--decodesearch"},"encodeSearch / decodeSearch"),(0,a.kt)("p",null,"Implode and explode search params."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { encodeSearch, decodeSearch } from "@swan-io/chicane";\n\nencodeSearch({ invitation: "542022247745", users: ["frank", "chris"] });\n// -> "?invitation=542022247745&users=frank&users=chris"\n\ndecodeSearch("?invitation=542022247745&users=frank&users=chris");\n// -> { invitation: "542022247745", users: ["frank", "chris"] }\n')),(0,a.kt)("h2",{id:"pushunsafe--replaceunsafe"},"pushUnsafe / replaceUnsafe"),(0,a.kt)("p",null,"Escape hatch. Similar to ",(0,a.kt)("inlineCode",{parentName:"p"},"Router.push")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"Router.replace")," but accepts a unique string argument."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { pushUnsafe, replaceUnsafe } from "@swan-io/chicane";\n\npushUnsafe("/");\nreplaceUnsafe("?name=frank");\n')))}h.isMDXComponent=!0}}]);