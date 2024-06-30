"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[608],{1404:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var o=t(7624),r=t(2172);const i={title:"Linking to a route",sidebar_label:"Linking to a route"},a=void 0,s={id:"linking-to-a-route",title:"Linking to a route",description:"Now that we have created our router, let's create our first link to our route:",source:"@site/docs/linking-to-a-route.md",sourceDirName:".",slug:"/linking-to-a-route",permalink:"/chicane/linking-to-a-route",draft:!1,unlisted:!1,editUrl:"https://github.com/swan-io/chicane/edit/main/docs/docs/linking-to-a-route.md",tags:[],version:"current",frontMatter:{title:"Linking to a route",sidebar_label:"Linking to a route"},sidebar:"docs",previous:{title:"Matching some routes",permalink:"/chicane/matching-some-routes"},next:{title:"Server-side rendering",permalink:"/chicane/server-side-rendering"}},c={},l=[{value:"Creating your own Link component",id:"creating-your-own-link-component",level:2},{value:"Programmatic navigation",id:"programmatic-navigation",level:2}];function u(e){const n={code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.M)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"Now that we have created our router, let's create our first link to our route:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",metastring:'{7,8} title="src/Header.tsx"',children:'import { Link } from "@swan-io/chicane";\nimport { Router } from "./router";\n\nconst Header = () => (\n  <div>\n    <h1>My super app</h1>\n    <Link to={Router.Home()}>Home</Link>\n    <Link to={Router.Users()}>Users</Link>\n  </div>\n);\n'})}),"\n",(0,o.jsxs)(n.p,{children:["The ",(0,o.jsx)(n.code,{children:"Link"})," component takes a few props:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"type LinkProps = {\n  to: string; // The route you're linking to (required)\n  replace?: boolean; // Replace instead of push (defaults to `false`)\n  activeClassName?: string;\n  activeStyle?: React.CSSProperties;\n  // \u2026and any prop <a> takes\n};\n"})}),"\n",(0,o.jsx)(n.h2,{id:"creating-your-own-link-component",children:"Creating your own Link component"}),"\n",(0,o.jsxs)(n.p,{children:["We provide a default ",(0,o.jsx)(n.code,{children:"Link"})," component, but you can also create yours if needed using the ",(0,o.jsx)(n.code,{children:"useLinkProps"})," hook:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",metastring:'{5} title="src/Link.tsx"',children:'import { useLinkProps } from "@swan-io/chicane";\nimport cx from "classnames";\n\nconst Link = ({ className, activeClassName, to, ...props }) => {\n  const { active, onClick } = useLinkProps({ href: to, replace });\n\n  return (\n    <a\n      {...props}\n      href={to}\n      onClick={onClick}\n      className={cx(className, active && activeClassName)}\n    />\n  );\n};\n'})}),"\n",(0,o.jsx)(n.h2,{id:"programmatic-navigation",children:"Programmatic navigation"}),"\n",(0,o.jsx)(n.p,{children:"The router also provides two functions to navigate programmatically (from your JS code):"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"Router.push(routeName, routeParams)"})}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Router.replace(routeName, routeParams)"})," (doesn't create a new entry in the browser history)"]}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,r.M)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},2172:(e,n,t)=>{t.d(n,{I:()=>s,M:()=>a});var o=t(1504);const r={},i=o.createContext(r);function a(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);