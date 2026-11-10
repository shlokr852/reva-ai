const $ = (id) => document.getElementById(id);
const form = $("askForm"), input = $("question"), sendBtn = $("sendBtn");
let chats = JSON.parse(localStorage.getItem("reva_chats") || "[]");
let activeId = null;
let busy = false;

function save(){ localStorage.setItem("reva_chats", JSON.stringify(chats)); renderHistory(); }
function currentChat(){
  let chat = chats.find(c => c.id === activeId);
  if(!chat){ chat={id:String(Date.now()),title:"New chat",messages:[]}; chats.unshift(chat); activeId=chat.id; }
  return chat;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function basicMarkdown(s){
  let safe=escapeHTML(s);
  safe=safe.replace(/```([\s\S]*?)```/g,"<pre>$1</pre>");
  safe=safe.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>");
  safe=safe.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>");
  safe=safe.replace(/`([^`]+)`/g,"<code>$1</code>");
  safe=safe.replace(/^\s*[-*] (.*)$/gm,"• $1");
  return safe.split(/\n{2,}/).map(p=>p.startsWith("<pre>")||p.startsWith("<h")?p:"<p>"+p.replace(/\n/g,"<br>")+"</p>").join("");
}
function renderHistory(){
  const list=$("historyList"); list.innerHTML="";
  chats.forEach(c=>{const b=document.createElement("button");b.className="history-item"+(c.id===activeId?" active":"");b.textContent=c.title;b.onclick=()=>openChat(c.id);list.appendChild(b);});
}
function renderChat(){
  const chat=currentChat(), conv=$("conversation"); conv.innerHTML="";
  $("welcome").classList.add("hidden");conv.classList.remove("hidden");
  chat.messages.forEach((m,i)=>{
    const wrap=document.createElement("div");wrap.className="message "+m.role;
    const avatar=document.createElement("div");avatar.className="avatar";avatar.textContent=m.role==="user"?"Y":"✦";
    const bubble=document.createElement("div");bubble.className="bubble";bubble.innerHTML=basicMarkdown(m.content);
    if(m.role==="assistant" && m.sources?.length){
      const src=document.createElement("div");src.className="sources";src.innerHTML='<div class="sources-title">WEB SOURCES</div>';
      m.sources.forEach(s=>{const a=document.createElement("a");a.className="source";a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";a.innerHTML="<strong>"+escapeHTML(s.title)+"</strong><small>"+escapeHTML(s.url)+"</small>";src.appendChild(a);});
      bubble.appendChild(src);
    }
    if(m.role==="assistant"){const actions=document.createElement("div");actions.className="message-actions";const copy=document.createElement("button");copy.className="copy-btn";copy.textContent="Copy answer";copy.onclick=()=>navigator.clipboard.writeText(m.content);actions.appendChild(copy);bubble.appendChild(actions);}
    wrap.append(avatar,bubble);conv.appendChild(wrap);
  });
  conv.scrollTop=conv.scrollHeight;window.scrollTo(0,document.body.scrollHeight);
}
function openChat(id){activeId=id;renderHistory();renderChat();$("sidebar").classList.remove("open");}
function newChat(){activeId=null;$("conversation").classList.add("hidden");$("welcome").classList.remove("hidden");renderHistory();input.focus();}
$("newChat").onclick=newChat;
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
document.querySelectorAll(".suggestion").forEach(b=>b.onclick=()=>{input.value=b.dataset.q;form.requestSubmit();});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,150)+"px";});

form.addEventListener("submit",async e=>{
  e.preventDefault();const question=input.value.trim();if(!question||busy)return;
  busy=true;sendBtn.disabled=true;const chat=currentChat();
  if(chat.messages.length===0)chat.title=question.slice(0,38)+(question.length>38?"…":"");
  chat.messages.push({role:"user",content:question});save();renderChat();input.value="";input.style.height="auto";
  const wait={role:"assistant",content:"REVA is thinking…"};chat.messages.push(wait);renderChat();
  try{
    const history=chat.messages.slice(0,-2).slice(-10).map(m=>({role:m.role,content:m.content}));
    const res=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,history,web:$("webToggle").checked})});
    const data=await res.json();if(!res.ok)throw new Error(data.error||"Something went wrong.");
    wait.content=data.answer;wait.sources=data.sources||[];
    if(data.search_error)wait.content+="\n\n"+data.search_error;
  }catch(err){wait.content="Sorry, I couldn't complete that request. "+err.message;}
  busy=false;sendBtn.disabled=false;save();renderChat();input.focus();
});
renderHistory();
