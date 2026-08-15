(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[873],{8461:function(e,t,n){Promise.resolve().then(n.bind(n,2883))},2883:function(e,t,n){"use strict";n.d(t,{default:function(){return m}});var s=n(7437),a=n(2265),c=n(6463),r=n(6264),i=n(5330),l=n(3601),o=n(3274),d=n(6780),u=n(518),x=n(500),h=n(7138);function m(){let e=(0,c.useParams)(),t=(0,c.useRouter)(),n=null==e?void 0:e.id,[m,y]=(0,a.useState)(null),[f,p]=(0,a.useState)(!0),[g,k]=(0,a.useState)(null);if((0,a.useEffect)(()=>{n&&(async()=>{try{p(!0),k(null);let e=await r.$c.getTeamDetails(n),t=(null==e?void 0:e.data)||e;y(t)}catch(e){console.error("Failed to load team details:",e),k(e.message||"Unable to fetch team details")}finally{p(!1)}})()},[n]),f)return(0,s.jsx)("main",{className:"min-h-screen bg-[#0a0e27] flex items-center justify-center",children:(0,s.jsx)(o.Z,{className:"w-8 h-8 text-cyan-400 animate-spin"})});if(g||!m)return(0,s.jsxs)("main",{className:"min-h-screen bg-[#0a0e27]",children:[(0,s.jsx)(i.Z,{}),(0,s.jsxs)("div",{className:"pt-24 px-4 text-center max-w-md mx-auto",children:[(0,s.jsx)(d.Z,{className:"w-12 h-12 text-red-400 mx-auto mb-3"}),(0,s.jsx)("h2",{className:"text-xl font-bold text-white mb-2",children:"Team Not Found"}),(0,s.jsx)("p",{className:"text-gray-400 text-sm mb-6",children:g||"The requested team details could not be found."}),(0,s.jsxs)(h.default,{href:"/teams",className:"inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 text-[#0a0e27] rounded-lg font-semibold text-sm hover:bg-cyan-300 transition-colors",children:[(0,s.jsx)(u.Z,{className:"w-4 h-4"}),"Back to Teams"]})]})]});let b=m.name||m.team_name||"Team Profile",Z=m.logo||m.logo_url,j=m.matches||m.recent_matches||[];return(0,s.jsxs)("main",{className:"min-h-screen bg-[#0a0e27]",children:[(0,s.jsx)(i.Z,{}),(0,s.jsx)("div",{className:"pt-20 sm:pt-24 pb-12 px-4 sm:px-6",children:(0,s.jsxs)("div",{className:"max-w-7xl mx-auto space-y-6",children:[(0,s.jsxs)("button",{onClick:()=>t.back(),className:"flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors",children:[(0,s.jsx)(u.Z,{className:"w-4 h-4"}),"Back"]}),(0,s.jsxs)("div",{className:"bg-[#0f1535] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6",children:[Z?(0,s.jsx)("img",{src:Z,alt:b,className:"w-24 h-24 sm:w-32 sm:h-32 object-contain",onError:e=>{e.target.src="https://ui-avatars.com/api/?name=".concat(encodeURIComponent(b),"&background=0D8ABC&color=fff")}}):(0,s.jsx)("div",{className:"w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-3xl",children:b.substring(0,3).toUpperCase()}),(0,s.jsxs)("div",{className:"text-center sm:text-left space-y-2",children:[(0,s.jsx)("h1",{className:"text-3xl sm:text-4xl font-bold text-white",children:b}),m.country&&(0,s.jsx)("p",{className:"text-gray-400 text-sm font-medium",children:m.country}),m.sport&&(0,s.jsx)("span",{className:"inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold",children:"string"==typeof m.sport?m.sport:m.sport.name})]})]}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("h2",{className:"text-xl font-bold text-white flex items-center gap-2",children:[(0,s.jsx)(x.Z,{className:"w-5 h-5 text-cyan-400"}),"Team Matches"]}),j.length>0?(0,s.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:j.map(e=>(0,s.jsx)(l.Z,{id:e.id||e._id,match:e},e.id||e._id))}):(0,s.jsx)("div",{className:"bg-[#0f1535]/50 border border-cyan-500/10 rounded-xl p-8 text-center text-gray-400",children:(0,s.jsxs)("p",{children:["No recent match history found for ",b,"."]})})]})]})})]})}},518:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},7592:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},6780:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(8030).Z)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},4174:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
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
 */let s=(0,n(8030).Z)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},500:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});/**
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
 */let s=(0,n(8030).Z)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])}},function(e){e.O(0,[227,781,971,23,744],function(){return e(e.s=8461)}),_N_E=e.O()}]);