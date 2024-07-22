"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[590],{4286:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>i,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var t=o(4848),c=o(8453);const s={title:"Lower-level API",sidebar_label:"Lower-level API"},a=void 0,r={id:"lower-level-api",title:"Lower-level API",description:"Even though you'll mostly need to consume the location through the Router, you might need to dive deeper at some point.",source:"@site/docs/lower-level-api.md",sourceDirName:".",slug:"/lower-level-api",permalink:"/chicane/lower-level-api",draft:!1,unlisted:!1,editUrl:"https://github.com/swan-io/chicane/edit/main/docs/docs/lower-level-api.md",tags:[],version:"current",frontMatter:{title:"Lower-level API",sidebar_label:"Lower-level API"},sidebar:"docs",previous:{title:"Hooks",permalink:"/chicane/hooks"}},i={},l=[{value:"getLocation",id:"getlocation",level:2},{value:"subscribeToLocation",id:"subscribetolocation",level:2},{value:"encodeSearch / decodeSearch",id:"encodesearch--decodesearch",level:2},{value:"pushUnsafe / replaceUnsafe",id:"pushunsafe--replaceunsafe",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["Even though you'll mostly need to consume the location through the ",(0,t.jsx)(n.a,{href:"./router",children:"Router"}),", you might need to dive deeper at some point."]}),"\n",(0,t.jsx)(n.h2,{id:"getlocation",children:"getLocation"}),"\n",(0,t.jsxs)(n.p,{children:["Returns the exploded location (a ",(0,t.jsx)(n.a,{href:"#getlocation",children:"Location object"}),")"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:'import { getLocation /*, Location */ } from "@swan-io/chicane";\n\ntype Location = {\n  path: string[]; // path split on `/`\n  search: Record<string, string | string[]>;\n  raw: { path: string; search: string };\n  toString(): string; // returns the imploded location\n};\n\nconst location: Location = getLocation();\nconsole.log(location.path);\n'})}),"\n",(0,t.jsx)(n.h2,{id:"subscribetolocation",children:"subscribeToLocation"}),"\n",(0,t.jsxs)(n.p,{children:["Subscribes to location changes, and passes a ",(0,t.jsx)(n.a,{href:"#getlocation",children:"Location object"})," to the listener."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:'import { subscribeToLocation } from "@swan-io/chicane";\n\nsubscribeToLocation((location: Location) => {\n  console.log("Location changed!");\n  console.log(location);\n});\n'})}),"\n",(0,t.jsx)(n.h2,{id:"encodesearch--decodesearch",children:"encodeSearch / decodeSearch"}),"\n",(0,t.jsx)(n.p,{children:"Implode and explode search params."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:'import { encodeSearch, decodeSearch } from "@swan-io/chicane";\n\nencodeSearch({ invitation: "542022247745", users: ["frank", "chris"] });\n// -> "?invitation=542022247745&users=frank&users=chris"\n\ndecodeSearch("?invitation=542022247745&users=frank&users=chris");\n// -> { invitation: "542022247745", users: ["frank", "chris"] }\n'})}),"\n",(0,t.jsx)(n.h2,{id:"pushunsafe--replaceunsafe",children:"pushUnsafe / replaceUnsafe"}),"\n",(0,t.jsxs)(n.p,{children:["Escape hatch. Similar to ",(0,t.jsx)(n.code,{children:"Router.push"})," and ",(0,t.jsx)(n.code,{children:"Router.replace"})," but accepts a unique string argument."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:'import { pushUnsafe, replaceUnsafe } from "@swan-io/chicane";\n\npushUnsafe("/");\nreplaceUnsafe("?name=frank");\n'})})]})}function h(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,o)=>{o.d(n,{R:()=>a,x:()=>r});var t=o(6540);const c={},s=t.createContext(c);function a(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:a(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);