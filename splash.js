/* CocoaCacao: pantalla de inicio de 1 segundo con el logo */
(function(){try{const o=document.createElement('div');o.id='sp';
 o.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999;background:#1B6FBF;display:flex;align-items:center;justify-content:center;transition:opacity .25s';
 const im=new Image(),C=['logo.jpg','logo.jpeg','logo.png','1000167004.jpg'];let i=0;
 im.alt='CocoaCacao';im.style.cssText='width:min(88vmin,520px);height:auto';
 im.onload=()=>{try{const c=document.createElement('canvas');c.width=c.height=4;const x=c.getContext('2d');x.drawImage(im,0,0,4,4);const d=x.getImageData(0,0,1,1).data;o.style.background='rgb('+d[0]+','+d[1]+','+d[2]+')'}catch(e){}};
 im.onerror=()=>{if(++i<C.length)im.src=C[i];else o.style.background='#2B1810'};
 im.src=C[0];o.appendChild(im);document.body.appendChild(o);
 setTimeout(()=>{o.style.opacity='0';setTimeout(()=>o.remove(),280)},1000)}catch(e){}})();
