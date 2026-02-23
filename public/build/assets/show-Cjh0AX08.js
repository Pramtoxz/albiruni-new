import{j as e,L as a}from"./app-OdHi_LY0.js";import{S as h,m as c}from"./SEOHead-DgcxYfvD.js";import{S as m,A as x}from"./StructuredData-3MsUAB3T.js";import{A as b}from"./arrow-left-Dby0VqF7.js";import{C as d}from"./calendar-NXH3XBhX.js";function y({news:t,relatedNews:i}){const l=r=>new Date(r).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}),o=t.excerpt.length>160?t.excerpt.substring(0,157)+"...":t.excerpt,n=new Date(t.published_at).toISOString(),s=new Date(t.updated_at).toISOString();return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:`${t.title} - Al-Biruni Daycare Padang`,description:o,canonical:`https://albiruni.sch.id/berita/${t.slug}`,keywords:`daycare padang, preschool padang, ${t.title.toLowerCase()}`,ogType:"article",ogImage:t.image_url,ogImageAlt:t.title,articlePublishedTime:n,articleModifiedTime:s}),e.jsx(m,{type:"article",articleData:{headline:t.title,datePublished:n,dateModified:s,author:"Al-Biruni Preschool & Daycare",image:t.image_url,description:o,url:`https://albiruni.sch.id/berita/${t.slug}`}}),e.jsxs("div",{className:"min-h-screen bg-gradient-to-b from-[#020b2d] via-[#041254] to-[#020b2d]",style:{background:"linear-gradient(to bottom, #020b2d, #041254, #020b2d)"},children:[e.jsx("header",{className:"relative z-50 border-b border-blue-800/50 bg-blue-900/30 backdrop-blur-sm",children:e.jsx("div",{className:"container mx-auto px-6 py-4",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(a,{href:"/berita",className:"inline-flex items-center text-white hover:text-yellow-300 transition-colors",children:[e.jsx(b,{className:"w-5 h-5 mr-2"}),"Kembali ke Berita"]}),e.jsx(a,{href:"/",className:"text-white hover:text-yellow-300 transition-colors",children:"Beranda"})]})})}),e.jsx("article",{className:"relative z-20 py-12 px-6",children:e.jsxs("div",{className:"container mx-auto max-w-4xl",children:[e.jsxs(c.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},children:[e.jsxs("div",{className:"relative h-full rounded-2xl overflow-hidden mb-8",children:[e.jsx("img",{src:t.image_url,alt:`${t.title} - Al-Biruni Daycare Padang`,className:"w-full h-full object-cover"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"})]}),e.jsxs("div",{className:"bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 mb-8",children:[e.jsxs("div",{className:"flex items-center text-white text-sm mb-4",children:[e.jsx(d,{className:"w-4 h-4 mr-2"}),l(t.published_at)]}),e.jsx("h1",{className:"text-4xl font-bold text-white mb-4",children:t.title}),e.jsx("p",{className:"text-xl text-white",children:t.excerpt})]}),e.jsxs("div",{className:"bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 mb-12",children:[e.jsx("style",{children:`
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
                `}),e.jsx("div",{className:`article-content prose prose-invert prose-lg max-w-none
                    prose-headings:text-white 
                    prose-p:text-white 
                    prose-a:text-yellow-300 
                    prose-strong:text-white
                    prose-ul:text-white
                    prose-ol:text-white
                    prose-li:text-white`,dangerouslySetInnerHTML:{__html:t.content}})]})]}),i.length>0&&e.jsxs(c.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6,delay:.3},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-8 text-center",children:"Berita Lainnya"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:i.map(r=>e.jsx(a,{href:`/berita/${r.slug}`,children:e.jsxs("div",{className:"bg-blue-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group h-full",children:[e.jsx("div",{className:"relative h-40 overflow-hidden",children:e.jsx("img",{src:r.image_url,alt:`${r.title} - Berita TK Al-Biruni Padang`,className:"w-full h-full object-cover transition-transform group-hover:scale-110"})}),e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center text-white text-xs mb-2",children:[e.jsx(d,{className:"w-3 h-3 mr-1"}),l(r.published_at)]}),e.jsx("h3",{className:"text-white font-semibold line-clamp-2 group-hover:text-yellow-300 transition-colors",children:r.title})]})]})},r.id))}),e.jsx("div",{className:"text-center mt-8",children:e.jsxs(a,{href:"/berita",className:"inline-flex items-center bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-xl transition-all hover:transform hover:-translate-y-1",children:["Lihat Semua Berita",e.jsx(x,{className:"w-4 h-4 ml-2"})]})})]})]})}),e.jsx("footer",{className:"relative z-20 border-t border-blue-800/50 bg-blue-900/30 backdrop-blur-sm py-8 px-6 mt-20",children:e.jsx("div",{className:"container mx-auto text-center",children:e.jsx("p",{className:"text-white",children:"© 2024 TK Al-Biruni. All rights reserved."})})})]})]})}export{y as default};
