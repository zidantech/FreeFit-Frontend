(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[714],{2744:function(e,t,n){Promise.resolve().then(n.bind(n,7835))},7835:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return h}});var s=n(7437),i=n(2265),a=n(6264),r=n(5330),c=n(3601),l=n(6706),d=n(3274),o=n(2675),u=n(7138);function h(){let[e,t]=(0,i.useState)([]),[n,h]=(0,i.useState)(!0),y=async()=>{try{h(!0);let e=await a.E.getLiveMatches(),n=(null==e?void 0:e.data)||(null==e?void 0:e.live_matches)||(Array.isArray(e)?e:[]);t(Array.isArray(n)?n:[])}catch(e){console.error("Failed to load live matches:",e),t([])}finally{h(!1)}};return(0,i.useEffect)(()=>{y()},[]),(0,s.jsxs)("main",{className:"min-h-screen bg-[#0a0e27]",children:[(0,s.jsx)(r.Z,{}),(0,s.jsx)("div",{className:"pt-20 sm:pt-24 pb-12 px-4 sm:px-6",children:(0,s.jsxs)("div",{className:"max-w-7xl mx-auto space-y-6",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[(0,s.jsx)("div",{className:"w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center",children:(0,s.jsx)("span",{className:"w-3 h-3 bg-red-500 rounded-full animate-pulse"})}),(0,s.jsxs)("div",{children:[(0,s.jsxs)("h1",{className:"text-2xl sm:text-3xl font-bold text-white flex items-center gap-2",children:["Live Matches",(0,s.jsx)("span",{className:"text-sm bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full",children:e.length})]}),(0,s.jsx)("p",{className:"text-gray-400 text-sm",children:"Real-time live streaming matches"})]})]}),(0,s.jsxs)("button",{onClick:y,disabled:n,className:"flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all text-sm font-medium border border-cyan-500/20",children:[(0,s.jsx)(l.Z,{className:"w-4 h-4 ".concat(n?"animate-spin":"")}),"Refresh"]})]}),n?(0,s.jsx)("div",{className:"flex items-center justify-center py-20",children:(0,s.jsx)(d.Z,{className:"w-8 h-8 text-cyan-400 animate-spin"})}):e.length>0?(0,s.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",children:e.map(e=>(0,s.jsx)(c.Z,{id:e.id||e._id,match:e},e.id||e._id))}):(0,s.jsxs)("div",{className:"text-center py-16 bg-[#0f1535]/60 rounded-xl border border-cyan-500/20 max-w-xl mx-auto",children:[(0,s.jsx)(o.Z,{className:"w-14 h-14 mx-auto mb-4 text-gray-500"}),(0,s.jsx)("h3",{className:"text-lg font-semibold text-white mb-1",children:"No Live Matches Streaming Right Now"}),(0,s.jsx)("p",{className:"text-gray-400 text-sm mb-6",children:"There are no live broadcasts scheduled at this precise moment."}),(0,s.jsx)(u.default,{href:"/matches/upcoming",className:"inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 text-[#0a0e27] rounded-lg font-semibold text-sm hover:bg-cyan-300 transition-colors",children:"Browse Upcoming Matches"})]})]})})]})}},7592:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},4174:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("CircleUser",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]])},933:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},4129:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]])},3274:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},9896:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]])},2873:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]])},7390:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]])},8094:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},6706:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]])},500:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]])},3907:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]])},2675:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("Tv",[["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",ry:"2",key:"10ag99"}],["polyline",{points:"17 2 12 7 7 2",key:"11pgbg"}]])},4697:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])}},function(e){e.O(0,[227,781,971,23,744],function(){return e(e.s=2744)}),_N_E=e.O()}]);