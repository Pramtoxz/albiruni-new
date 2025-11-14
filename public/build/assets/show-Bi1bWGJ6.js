import{j as e,H as o,L as l}from"./app-LLm6eeFG.js";import{A as c}from"./arrow-left-B82u27rb.js";import{m as n}from"./proxy-BkXCUCvp.js";import{C as s}from"./calendar-BV-Uyseh.js";import{A as d}from"./arrow-right-DsuxnVk4.js";function j({news:r,relatedNews:a}){const i=t=>new Date(t).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:`${r.title} - AL-Biruni`}),e.jsxs("div",{className:"min-h-screen bg-gradient-to-b from-[#020b2d] via-[#041254] to-[#020b2d]",style:{background:"linear-gradient(to bottom, #020b2d, #041254, #020b2d)"},children:[e.jsx("header",{className:"relative z-50 border-b border-blue-800/50 bg-blue-900/30 backdrop-blur-sm",children:e.jsx("div",{className:"container mx-auto px-6 py-4",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(l,{href:"/berita",className:"inline-flex items-center text-white hover:text-yellow-300 transition-colors",children:[e.jsx(c,{className:"w-5 h-5 mr-2"}),"Kembali ke Berita"]}),e.jsx(l,{href:"/",className:"text-white hover:text-yellow-300 transition-colors",children:"Beranda"})]})})}),e.jsx("article",{className:"relative z-20 py-12 px-6",children:e.jsxs("div",{className:"container mx-auto max-w-4xl",children:[e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},children:[e.jsxs("div",{className:"relative h-96 rounded-2xl overflow-hidden mb-8",children:[e.jsx("img",{src:r.image_url,alt:r.title,className:"w-full h-full object-cover"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"})]}),e.jsxs("div",{className:"bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 mb-8",children:[e.jsxs("div",{className:"flex items-center text-white text-sm mb-4",children:[e.jsx(s,{className:"w-4 h-4 mr-2"}),i(r.published_at)]}),e.jsx("h1",{className:"text-4xl font-bold text-white mb-4",children:r.title}),e.jsx("p",{className:"text-xl text-white",children:r.excerpt})]}),e.jsxs("div",{className:"bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 mb-12",children:[e.jsx("style",{children:`
                  .article-content,
                  .article-content *,
                  .article-content p,
                  .article-content div,
                  .article-content span,
                  .article-content li,
                  .article-content td,
                  .article-content th {
                    color: white !important;
                  }
                  .article-content a,
                  .article-content a * {
                    color: #fcd34d !important;
                  }
                  .article-content h1,
                  .article-content h2,
                  .article-content h3,
                  .article-content h4,
                  .article-content h5,
                  .article-content h6,
                  .article-content h1 *,
                  .article-content h2 *,
                  .article-content h3 *,
                  .article-content h4 *,
                  .article-content h5 *,
                  .article-content h6 * {
                    color: white !important;
                    font-weight: bold !important;
                  }
                  .article-content strong,
                  .article-content b {
                    color: white !important;
                  }
                `}),e.jsx("div",{className:`article-content prose prose-invert prose-lg max-w-none\r
                    prose-headings:text-white \r
                    prose-p:text-white \r
                    prose-a:text-yellow-300 \r
                    prose-strong:text-white\r
                    prose-ul:text-white\r
                    prose-ol:text-white\r
                    prose-li:text-white`,dangerouslySetInnerHTML:{__html:r.content}})]})]}),a.length>0&&e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6,delay:.3},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-8 text-center",children:"Berita Lainnya"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:a.map(t=>e.jsx(l,{href:`/berita/${t.slug}`,children:e.jsxs("div",{className:"bg-blue-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group h-full",children:[e.jsx("div",{className:"relative h-40 overflow-hidden",children:e.jsx("img",{src:t.image_url,alt:t.title,className:"w-full h-full object-cover transition-transform group-hover:scale-110"})}),e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center text-white text-xs mb-2",children:[e.jsx(s,{className:"w-3 h-3 mr-1"}),i(t.published_at)]}),e.jsx("h3",{className:"text-white font-semibold line-clamp-2 group-hover:text-yellow-300 transition-colors",children:t.title})]})]})},t.id))}),e.jsx("div",{className:"text-center mt-8",children:e.jsxs(l,{href:"/berita",className:"inline-flex items-center bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-xl transition-all hover:transform hover:-translate-y-1",children:["Lihat Semua Berita",e.jsx(d,{className:"w-4 h-4 ml-2"})]})})]})]})}),e.jsx("footer",{className:"relative z-20 border-t border-blue-800/50 bg-blue-900/30 backdrop-blur-sm py-8 px-6 mt-20",children:e.jsx("div",{className:"container mx-auto text-center",children:e.jsx("p",{className:"text-white",children:"© 2024 TK Al-Biruni. All rights reserved."})})})]})]})}export{j as default};
