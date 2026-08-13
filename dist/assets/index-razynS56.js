(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();const m=[],v="bookly-library-real",f=(()=>{try{return JSON.parse(localStorage.getItem(v)||"null")}catch{return null}})(),i={books:f||m,query:""},s={search:document.querySelector("#searchInput"),libraryCount:document.querySelector("#libraryCount"),featured:document.querySelector("#featuredSection"),wantGrid:document.querySelector("#wantGrid"),doneGrid:document.querySelector("#doneGrid"),stats:document.querySelector("#stats"),modal:document.querySelector("#bookModal"),form:document.querySelector("#bookForm"),openModal:document.querySelector("#openModal"),closeModal:document.querySelector("#closeModal"),cancelBook:document.querySelector("#cancelBook"),themeToggle:document.querySelector("#themeToggle")};function h(){localStorage.setItem(v,JSON.stringify(i.books))}function y(e){return e.status==="done"?100:Math.min(100,Math.round(e.currentPage/e.pages*100))}function d(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[t])}function g(e){const t=i.query.trim().toLowerCase();return i.books.filter(r=>r.status===e).filter(r=>t?`${r.title} ${r.author}`.toLowerCase().includes(t):!0)}function b(e){const t=e.title.length>18?e.title.slice(0,18):e.title;return`
    <div class="cover ${e.cover}">
      <span class="cover-title">${d(t)}</span>
      <span class="cover-author">${d(e.author)}</span>
    </div>
  `}function $(e){return e?`<div class="stars" aria-label="${e} de 5 estrelas">${"★".repeat(e)}${"☆".repeat(5-e)}</div>`:""}function M(){const e=g("reading")[0];if(!e){s.featured.innerHTML=`
      <div class="section-heading reading-heading"><h2>Lendo agora</h2></div>
      <article class="reading-card empty-reading">
        <div class="empty-cover" aria-hidden="true">
          <span></span>
          <span></span>
        </div>
        <div class="reading-copy">
          <h2>Nenhuma leitura ativa</h2>
          <p class="author">Cadastre um livro real e marque como lendo.</p>
          <div class="page-line">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></svg>
            Página 0 de 0
          </div>
          <div class="progress-row">
            <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width: 0%"></div></div>
            <span>0%</span>
          </div>
          <button class="outline-button" type="button" id="emptyAddBook">Cadastrar livro</button>
        </div>
        <div class="reading-art" aria-hidden="true"></div>
      </article>
    `;return}const t=y(e);s.featured.innerHTML=`
    <div class="section-heading reading-heading"><h2>Lendo agora</h2></div>
    <article class="reading-card">
      ${b(e)}
      <div class="reading-copy">
        <h2>${d(e.title)}</h2>
        <p class="author">${d(e.author)}</p>
        <div class="page-line">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></svg>
          Página ${e.currentPage} de ${e.pages}
        </div>
        <div class="progress-row">
          <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width: ${t}%"></div></div>
          <span>${t}%</span>
        </div>
        <button class="outline-button" data-progress="${e.id}">Atualizar progresso</button>
      </div>
      <div class="reading-art" aria-hidden="true"></div>
    </article>
  `}function p(e,t,r){if(!t.length){e.innerHTML=Array.from({length:4},(o,a)=>`
      <article class="book-card empty-slot ${a===0?"with-note":""}">
        <div class="book-cover"></div>
        ${a===0?'<div class="meta"><h3>Nada por aqui ainda</h3><p>Use o botão + para cadastrar</p></div>':""}
      </article>
    `).join("");return}e.innerHTML=t.slice(0,4).map(o=>`
      <article class="book-card ${o.cover}" data-id="${o.id}">
        <div class="book-cover"></div>
        ${r==="done"?'<span class="checkmark">✓</span>':'<span class="bookmark"></span>'}
        <div class="meta">
          <h3 title="${d(o.title)}">${d(o.title)}</h3>
          <p title="${d(o.author)}">${d(o.author)}</p>
          ${$(o.rating)}
        </div>
      </article>
    `).join("")}function L(){const e=i.books.length,t=i.books.filter(n=>n.status==="reading").length,r=i.books.filter(n=>n.status==="done").length,o=i.books.filter(n=>n.rating>0),a=o.length?(o.reduce((n,c)=>n+Number(c.rating),0)/o.length).toFixed(1).replace(".",","):"0";s.stats.innerHTML=[l("book",e,"Livros na biblioteca","#6256b4"),l("open",t,"Lendo agora","#d8764d"),l("check",r,"Livros concluídos","#4fa75d"),l("star",a,"Avaliação média","#bd8b26")].join("")}function l(e,t,r,o){return`
    <div class="stat">
      <span class="stat-icon" style="background:${o}33;color:${o}">
        <svg viewBox="0 0 24 24" aria-hidden="true">${{book:'<path d="M4 19.5V5a2 2 0 0 1 2-2h5v18H6.5A2.5 2.5 0 0 1 4 19.5Zm9-16h5a2 2 0 0 1 2 2v14.5a2.5 2.5 0 0 0-2.5-2.5H13V3.5Z" />',open:'<path d="M12 7v13M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm16 0A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22V5.5Z" />',check:'<path d="M20 6 9 17l-5-5" />',star:'<path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6L12 16.77 6.6 19.6l1.03-6-4.36-4.25 6.03-.88L12 3Z" />'}[e]}</svg>
      </span>
      <span><strong>${t}</strong><span>${r}</span></span>
    </div>
  `}function u(){const e=i.books.length;s.libraryCount.textContent=`${e} ${e===1?"livro esperando":"livros esperando"} por você.`,M(),p(s.wantGrid,g("want"),"want"),p(s.doneGrid,g("done"),"done"),L()}s.search.addEventListener("input",e=>{i.query=e.target.value,u()});s.openModal.addEventListener("click",()=>{s.form.reset(),s.modal.showModal()});s.closeModal.addEventListener("click",()=>{s.modal.close()});s.cancelBook.addEventListener("click",()=>{s.modal.close()});s.themeToggle.addEventListener("click",()=>{document.body.classList.toggle("light-mode")});s.form.addEventListener("submit",e=>{e.preventDefault();const t=new FormData(s.form),r=Number(t.get("pages")),o=t.get("status"),a=o==="done"?r:Math.min(Number(t.get("currentPage"))||0,r);i.books.unshift({id:crypto.randomUUID(),title:t.get("title").trim(),author:t.get("author").trim(),pages:r,currentPage:a,status:o,rating:Number(t.get("rating")),cover:t.get("cover")}),h(),s.modal.close(),u()});document.addEventListener("click",e=>{if(e.target.closest("#emptyAddBook")){s.form.reset(),s.modal.showModal();return}const t=e.target.closest("[data-progress]");if(!t)return;const r=i.books.find(a=>a.id===t.dataset.progress),o=Number(prompt(`Página atual de "${r.title}"`,r.currentPage));Number.isNaN(o)||(r.currentPage=Math.max(0,Math.min(o,r.pages)),r.currentPage>=r.pages&&(r.status="done",r.rating=r.rating||5),h(),u())});document.querySelectorAll("[data-filter]").forEach(e=>{e.addEventListener("click",()=>{s.search.focus()})});u();
