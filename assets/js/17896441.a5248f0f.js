"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[918],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>p});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var o=a.createContext({}),i=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},m=function(e){var t=i(e.components);return a.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,o=e.parentName,m=c(e,["components","mdxType","originalType","parentName"]),u=i(n),p=l,v=u["".concat(o,".").concat(p)]||u[p]||d[p]||r;return n?a.createElement(v,s(s({ref:t},m),{},{components:n})):a.createElement(v,s({ref:t},m))}));function p(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,s=new Array(r);s[0]=u;var c={};for(var o in t)hasOwnProperty.call(t,o)&&(c[o]=t[o]);c.originalType=e,c.mdxType="string"==typeof e?e:l,s[1]=c;for(var i=2;i<r;i++)s[i]=n[i];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},7594:(e,t,n)=>{n.r(t),n.d(t,{default:()=>De});var a=n(7294),l=n(6010),r=n(1944),s=n(7524),c=n(5281),o=n(7462),i=n(5999),m=n(9960);function d(e){const{permalink:t,title:n,subLabel:r,isNext:s}=e;return a.createElement(m.Z,{className:(0,l.Z)("pagination-nav__link",s?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},r&&a.createElement("div",{className:"pagination-nav__sublabel"},r),a.createElement("div",{className:"pagination-nav__label"},n))}function u(e){const{previous:t,next:n}=e;return a.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,i.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},t&&a.createElement(d,(0,o.Z)({},t,{subLabel:a.createElement(i.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&a.createElement(d,(0,o.Z)({},n,{subLabel:a.createElement(i.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}var p=n(2263),v=n(143),h=n(373),f=n(4477);const b={unreleased:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(i.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(i.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function E(e){const t=b[e.versionMetadata.banner];return a.createElement(t,e)}function g(e){let{versionLabel:t,to:n,onClick:l}=e;return a.createElement(i.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:a.createElement("b",null,a.createElement(m.Z,{to:n,onClick:l},a.createElement(i.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function N(e){let{className:t,versionMetadata:n}=e;const{siteConfig:{title:r}}=(0,p.Z)(),{pluginId:s}=(0,v.gA)({failfast:!0}),{savePreferredVersionName:o}=(0,h.J)(s),{latestDocSuggestion:i,latestVersionSuggestion:m}=(0,v.Jo)(s),d=null!=i?i:(u=m).docs.find((e=>e.id===u.mainDocId));var u;return a.createElement("div",{className:(0,l.Z)(t,c.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},a.createElement("div",null,a.createElement(E,{siteTitle:r,versionMetadata:n})),a.createElement("div",{className:"margin-top--md"},a.createElement(g,{versionLabel:m.label,to:d.path,onClick:()=>o(m.name)})))}function y(e){let{className:t}=e;const n=(0,f.E)();return n.banner?a.createElement(N,{className:t,versionMetadata:n}):null}function L(e){let{className:t}=e;const n=(0,f.E)();return n.badge?a.createElement("span",{className:(0,l.Z)(t,c.k.docs.docVersionBadge,"badge badge--secondary")},a.createElement(i.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label}},"Version: {versionLabel}")):null}function Z(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:n}=e;return a.createElement(i.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:a.createElement("b",null,a.createElement("time",{dateTime:new Date(1e3*t).toISOString()},n))}}," on {date}")}function k(e){let{lastUpdatedBy:t}=e;return a.createElement(i.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:a.createElement("b",null,t)}}," by {user}")}function _(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:n,lastUpdatedBy:l}=e;return a.createElement("span",{className:c.k.common.lastUpdated},a.createElement(i.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&n?a.createElement(Z,{lastUpdatedAt:t,formattedLastUpdatedAt:n}):"",byUser:l?a.createElement(k,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}const T="iconEdit_eYIM";function C(e){let{className:t,...n}=e;return a.createElement("svg",(0,o.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,l.Z)(T,t),"aria-hidden":"true"},n),a.createElement("g",null,a.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function x(e){let{editUrl:t}=e;return a.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:c.k.common.editThisPage},a.createElement(C,null),a.createElement(i.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}const w="tag_zVej",O="tagRegular_sFm0",H="tagWithCount_h2kH";function U(e){let{permalink:t,label:n,count:r}=e;return a.createElement(m.Z,{href:t,className:(0,l.Z)(w,r?H:O)},n,r&&a.createElement("span",null,r))}const A="tags_jXut",M="tag_QGVx";function P(e){let{tags:t}=e;return a.createElement(a.Fragment,null,a.createElement("b",null,a.createElement(i.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),a.createElement("ul",{className:(0,l.Z)(A,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:n}=e;return a.createElement("li",{key:n,className:M},a.createElement(U,{label:t,permalink:n}))}))))}const S="lastUpdated_vbeJ";function I(e){return a.createElement("div",{className:(0,l.Z)(c.k.docs.docFooterTagsRow,"row margin-bottom--sm")},a.createElement("div",{className:"col"},a.createElement(P,e)))}function B(e){let{editUrl:t,lastUpdatedAt:n,lastUpdatedBy:r,formattedLastUpdatedAt:s}=e;return a.createElement("div",{className:(0,l.Z)(c.k.docs.docFooterEditMetaRow,"row")},a.createElement("div",{className:"col"},t&&a.createElement(x,{editUrl:t})),a.createElement("div",{className:(0,l.Z)("col",S)},(n||r)&&a.createElement(_,{lastUpdatedAt:n,formattedLastUpdatedAt:s,lastUpdatedBy:r})))}function j(e){const{content:t}=e,{metadata:n}=t,{editUrl:r,lastUpdatedAt:s,formattedLastUpdatedAt:o,lastUpdatedBy:i,tags:m}=n,d=m.length>0,u=!!(r||s||i);return d||u?a.createElement("footer",{className:(0,l.Z)(c.k.docs.docFooter,"docusaurus-mt-lg")},d&&a.createElement(I,{tags:m}),u&&a.createElement(B,{editUrl:r,lastUpdatedAt:s,lastUpdatedBy:i,formattedLastUpdatedAt:o})):null}var D=n(6668);function V(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const a=n.slice(2,e.level);e.parentIndex=Math.max(...a),n[e.level]=t}));const a=[];return t.forEach((e=>{const{parentIndex:n,...l}=e;n>=0?t[n].children.push(l):a.push(l)})),a}function R(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:a}=e;return t.flatMap((e=>{const t=R({toc:e.children,minHeadingLevel:n,maxHeadingLevel:a});return function(e){return e.level>=n&&e.level<=a}(e)?[{...e,children:t}]:t}))}function z(e){const t=e.getBoundingClientRect();return t.top===t.bottom?z(e.parentNode):t}function F(e,t){var n;let{anchorTopOffset:a}=t;const l=e.find((e=>z(e).top>=a));if(l){var r;return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(z(l))?l:null!=(r=e[e.indexOf(l)-1])?r:null}return null!=(n=e[e.length-1])?n:null}function q(){const e=(0,a.useRef)(0),{navbar:{hideOnScroll:t}}=(0,D.L)();return(0,a.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function W(e){const t=(0,a.useRef)(void 0),n=q();(0,a.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:a,linkActiveClassName:l,minHeadingLevel:r,maxHeadingLevel:s}=e;function c(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(a),c=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const a=[];for(let l=t;l<=n;l+=1)a.push("h"+l+".anchor");return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:r,maxHeadingLevel:s}),o=F(c,{anchorTopOffset:n.current}),i=e.find((e=>o&&o.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(l),e.classList.add(l),t.current=e):e.classList.remove(l)}(e,e===i)}))}return document.addEventListener("scroll",c),document.addEventListener("resize",c),c(),()=>{document.removeEventListener("scroll",c),document.removeEventListener("resize",c)}}),[e,n])}function G(e){let{toc:t,className:n,linkClassName:l,isChild:r}=e;return t.length?a.createElement("ul",{className:r?void 0:n},t.map((e=>a.createElement("li",{key:e.id},a.createElement("a",{href:"#"+e.id,className:null!=l?l:void 0,dangerouslySetInnerHTML:{__html:e.value}}),a.createElement(G,{isChild:!0,toc:e.children,className:n,linkClassName:l}))))):null}const J=a.memo(G);function Y(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:l="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:s,maxHeadingLevel:c,...i}=e;const m=(0,D.L)(),d=null!=s?s:m.tableOfContents.minHeadingLevel,u=null!=c?c:m.tableOfContents.maxHeadingLevel,p=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:l}=e;return(0,a.useMemo)((()=>R({toc:V(t),minHeadingLevel:n,maxHeadingLevel:l})),[t,n,l])}({toc:t,minHeadingLevel:d,maxHeadingLevel:u});return W((0,a.useMemo)((()=>{if(l&&r)return{linkClassName:l,linkActiveClassName:r,minHeadingLevel:d,maxHeadingLevel:u}}),[l,r,d,u])),a.createElement(J,(0,o.Z)({toc:p,className:n,linkClassName:l},i))}const X="tableOfContents_bqdL";function Q(e){let{className:t,...n}=e;return a.createElement("div",{className:(0,l.Z)(X,"thin-scrollbar",t)},a.createElement(Y,(0,o.Z)({},n,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}var K=n(6043);const $="tocCollapsibleButton_TO0P",ee="tocCollapsibleButtonExpanded_MG3E";function te(e){let{collapsed:t,...n}=e;return a.createElement("button",(0,o.Z)({type:"button"},n,{className:(0,l.Z)("clean-btn",$,!t&&ee,n.className)}),a.createElement(i.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page"))}const ne="tocCollapsible_ETCw",ae="tocCollapsibleContent_vkbj",le="tocCollapsibleExpanded_sAul";function re(e){let{toc:t,className:n,minHeadingLevel:r,maxHeadingLevel:s}=e;const{collapsed:c,toggleCollapsed:o}=(0,K.u)({initialState:!0});return a.createElement("div",{className:(0,l.Z)(ne,!c&&le,n)},a.createElement(te,{collapsed:c,onClick:o}),a.createElement(K.z,{lazy:!0,className:ae,collapsed:c},a.createElement(Y,{toc:t,minHeadingLevel:r,maxHeadingLevel:s})))}const se="anchorWithStickyNavbar_LWe7",ce="anchorWithHideOnScrollNavbar_WYt5";function oe(e){let{as:t,id:n,...r}=e;const{navbar:{hideOnScroll:s}}=(0,D.L)();return"h1"!==t&&n?a.createElement(t,(0,o.Z)({},r,{className:(0,l.Z)("anchor",s?ce:se),id:n}),r.children,a.createElement("a",{className:"hash-link",href:"#"+n,title:(0,i.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):a.createElement(t,(0,o.Z)({},r,{id:void 0}))}var ie=n(2802),me=n(8596),de=n(4996);function ue(e){return a.createElement("svg",(0,o.Z)({viewBox:"0 0 24 24"},e),a.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}const pe={breadcrumbsContainer:"breadcrumbsContainer_Z_bl",breadcrumbHomeIcon:"breadcrumbHomeIcon_OVgt"};function ve(e){let{children:t,href:n,isLast:l}=e;const r="breadcrumbs__link";return l?a.createElement("span",{className:r,itemProp:"name"},t):n?a.createElement(m.Z,{className:r,href:n,itemProp:"item"},a.createElement("span",{itemProp:"name"},t)):a.createElement("span",{className:r},t)}function he(e){let{children:t,active:n,index:r,addMicrodata:s}=e;return a.createElement("li",(0,o.Z)({},s&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,l.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n})}),t,a.createElement("meta",{itemProp:"position",content:String(r+1)}))}function fe(){const e=(0,de.Z)("/");return a.createElement("li",{className:"breadcrumbs__item"},a.createElement(m.Z,{"aria-label":(0,i.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:(0,l.Z)("breadcrumbs__link",pe.breadcrumbsItemLink),href:e},a.createElement(ue,{className:pe.breadcrumbHomeIcon})))}function be(){const e=(0,ie.s1)(),t=(0,me.Ns)();return e?a.createElement("nav",{className:(0,l.Z)(c.k.docs.docBreadcrumbs,pe.breadcrumbsContainer),"aria-label":(0,i.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},a.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&a.createElement(fe,null),e.map(((t,n)=>{const l=n===e.length-1;return a.createElement(he,{key:n,active:l,index:n,addMicrodata:!!t.href},a.createElement(ve,{href:t.href,isLast:l},t.label))})))):null}var Ee=n(3905),ge=n(5742);var Ne=n(3066);var ye=n(2389);const Le="details_lb9f",Ze="isBrowser_bmU9",ke="collapsibleContent_i85q";function _e(e){return!!e&&("SUMMARY"===e.tagName||_e(e.parentElement))}function Te(e,t){return!!e&&(e===t||Te(e.parentElement,t))}function Ce(e){let{summary:t,children:n,...r}=e;const s=(0,ye.Z)(),c=(0,a.useRef)(null),{collapsed:i,setCollapsed:m}=(0,K.u)({initialState:!r.open}),[d,u]=(0,a.useState)(r.open);return a.createElement("details",(0,o.Z)({},r,{ref:c,open:d,"data-collapsed":i,className:(0,l.Z)(Le,s&&Ze,r.className),onMouseDown:e=>{_e(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;_e(t)&&Te(t,c.current)&&(e.preventDefault(),i?(m(!1),u(!0)):m(!0))}}),null!=t?t:a.createElement("summary",null,"Details"),a.createElement(K.z,{lazy:!1,collapsed:i,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{m(e),u(!e)}},a.createElement("div",{className:ke},n)))}const xe="details_b_Ee";function we(e){let{...t}=e;return a.createElement(Ce,(0,o.Z)({},t,{className:(0,l.Z)("alert alert--info",xe,t.className)}))}function Oe(e){return a.createElement(oe,e)}const He="containsTaskList_mC6p";const Ue="img_ev3q";const Ae={head:function(e){const t=a.Children.map(e.children,(e=>a.isValidElement(e)?function(e){var t;if(null!=(t=e.props)&&t.mdxType&&e.props.originalType){const{mdxType:t,originalType:n,...l}=e.props;return a.createElement(e.props.originalType,l)}return e}(e):e));return a.createElement(ge.Z,e,t)},code:function(e){const t=["a","b","big","i","span","em","strong","sup","sub","small"];return a.Children.toArray(e.children).every((e=>"string"==typeof e&&!e.includes("\n")||(0,a.isValidElement)(e)&&t.includes(e.props.mdxType)))?a.createElement("code",e):a.createElement(Ne.Z,e)},a:function(e){return a.createElement(m.Z,e)},pre:function(e){var t;return a.createElement(Ne.Z,(0,a.isValidElement)(e.children)&&"code"===(null==(t=e.children.props)?void 0:t.originalType)?e.children.props:{...e})},details:function(e){const t=a.Children.toArray(e.children),n=t.find((e=>{var t;return a.isValidElement(e)&&"summary"===(null==(t=e.props)?void 0:t.mdxType)})),l=a.createElement(a.Fragment,null,t.filter((e=>e!==n)));return a.createElement(we,(0,o.Z)({},e,{summary:n}),l)},ul:function(e){return a.createElement("ul",(0,o.Z)({},e,{className:(t=e.className,(0,l.Z)(t,(null==t?void 0:t.includes("contains-task-list"))&&He))}));var t},img:function(e){return a.createElement("img",(0,o.Z)({loading:"lazy"},e,{className:(t=e.className,(0,l.Z)(t,Ue))}));var t},h1:e=>a.createElement(Oe,(0,o.Z)({as:"h1"},e)),h2:e=>a.createElement(Oe,(0,o.Z)({as:"h2"},e)),h3:e=>a.createElement(Oe,(0,o.Z)({as:"h3"},e)),h4:e=>a.createElement(Oe,(0,o.Z)({as:"h4"},e)),h5:e=>a.createElement(Oe,(0,o.Z)({as:"h5"},e)),h6:e=>a.createElement(Oe,(0,o.Z)({as:"h6"},e))};function Me(e){let{children:t}=e;return a.createElement(Ee.Zo,{components:Ae},t)}const Pe="docItemContainer_Adtb",Se="docItemCol_GujU",Ie="tocMobile_aoJ5";function Be(e){var t;const{content:n}=e,{metadata:l,frontMatter:s,assets:c}=n,{keywords:o}=s,{description:i,title:m}=l,d=null!=(t=c.image)?t:s.image;return a.createElement(r.d,{title:m,description:i,keywords:o,image:d})}function je(e){const{content:t}=e,{metadata:n,frontMatter:r}=t,{hide_title:o,hide_table_of_contents:i,toc_min_heading_level:m,toc_max_heading_level:d}=r,{title:p}=n,v=!o&&void 0===t.contentTitle,h=(0,s.i)(),f=!i&&t.toc&&t.toc.length>0,b=f&&("desktop"===h||"ssr"===h);return a.createElement("div",{className:"row"},a.createElement("div",{className:(0,l.Z)("col",!i&&Se)},a.createElement(y,null),a.createElement("div",{className:Pe},a.createElement("article",null,a.createElement(be,null),a.createElement(L,null),f&&a.createElement(re,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:d,className:(0,l.Z)(c.k.docs.docTocMobile,Ie)}),a.createElement("div",{className:(0,l.Z)(c.k.docs.docMarkdown,"markdown")},v&&a.createElement("header",null,a.createElement(oe,{as:"h1"},p)),a.createElement(Me,null,a.createElement(t,null))),a.createElement(j,e)),a.createElement(u,{previous:n.previous,next:n.next}))),b&&a.createElement("div",{className:"col col--3"},a.createElement(Q,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:d,className:c.k.docs.docTocDesktop})))}function De(e){const t="docs-doc-id-"+e.content.metadata.unversionedId;return a.createElement(r.FG,{className:t},a.createElement(Be,e),a.createElement(je,e))}},4477:(e,t,n)=>{n.d(t,{E:()=>c,q:()=>s});var a=n(7294),l=n(902);const r=a.createContext(null);function s(e){let{children:t,version:n}=e;return a.createElement(r.Provider,{value:n},t)}function c(){const e=(0,a.useContext)(r);if(null===e)throw new l.i6("DocsVersionProvider");return e}}}]);