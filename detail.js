const params=new URLSearchParams(window.location.search);
const id=params.get('id');
const item=DATA.find(x=>x.id===id);
const div=document.getElementById('detail');
if(item){
 div.innerHTML=`<div class="card">
 <h2>${item.title}</h2>
 <p><em>${item.author}</em></p>
 <h3>Summary</h3>
 <p>${item.summary}</p>
 <h3>Your Notes</h3>
 <textarea id="notes" style="width:100%;height:120px"></textarea>
 </div>`;
}
