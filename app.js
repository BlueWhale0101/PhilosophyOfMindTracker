const list = document.getElementById('list');
DATA.forEach(item=>{
  const div=document.createElement('div');
  div.className='card';
  div.innerHTML=`<h3>${item.title}</h3>
  <p>${item.author}</p>
  <a href="detail.html?id=${item.id}">Open</a>`;
  list.appendChild(div);
});
