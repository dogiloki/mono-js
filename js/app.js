var content_inicio=document.getElementById('content-inicio');
var content_puntaje_obtenido=document.getElementById('content-puntaje-obtenido');
var puntaje_obtenido=document.getElementById('content-puntaje');
var content_puntaje=document.getElementById('puntajes');
var content_juego=document.getElementById('content-juego');
var content_vidas=document.getElementById('content-vidas');
var bananas=document.getElementById('bananas');
var caja_nombre=document.getElementById('caja-nombre');
var btn_aceptar=document.getElementById('btn-aceptar');
var btn_jugar=document.getElementById('btn-jugar');
var btn_audio=document.getElementById('btn-audio');
var audio=document.getElementById('audio');
var mono={
	obj:document.getElementById('mono'),
	vidas:null,
	bananas:null,
	mira:null,
	img:null
}

// Métodos a ejecutar al inicio
document.addEventListener("DOMContentLoaded",()=>{
	this.audio.loop=true;
	this.inicio();
});

// Evento de botones
btn_audio.addEventListener("click",()=>{
	if(this.btn_audio.getAttribute("src")==Diccionario.imagenes.audio){
		this.btn_audio.setAttribute("src",Diccionario.imagenes.mute);
		this.audio.pause();
	}else{
		this.btn_audio.setAttribute("src",Diccionario.imagenes.audio);
		this.audio.play();
	}
});
btn_jugar.addEventListener("click",()=>{
	this.jugar();
});
btn_aceptar.addEventListener("click",()=>{
	let datos={
		bananas: this.mono.bananas,
		nombre: this.caja_nombre.value
	}
	Puntaje.agregar(datos);
	this.inicio();
});

// Detectar tecla para mover el mono
document.addEventListener("keydown",(evt)=>{
	let tecla=evt.keyCode;
	let posi_actual=Number((this.mono.obj.style.left).replace("px",""));
	let limite_izq=0;
	let limite_der=window.innerWidth-this.mono.obj.width-10;
	let camino=false;
	if(posi_actual<=0){
		this.mono.obj.style.left=(posi_actual+10)+"px";
		return 0;
	}
	if(posi_actual>=limite_der){
		this.mono.obj.style.left=(posi_actual-10)+"px";
		return 0;
	}
	if(tecla==Diccionario.tecla.izq){
		this.mono.obj.style.left=(posi_actual-10)+"px";
		this.mono.mira="izq";
		camino=true;
	}else
	if(tecla==Diccionario.tecla.der){
		this.mono.obj.style.left=(posi_actual+10)+"px";
		this.mono.mira="der";
		camino=true;
	}
	if(!camino){
		return;
	}
	if(this.mono.img<Diccionario.imagenes.mono[this.mono.mira].length-1){
		this.mono.img++;
	}else{
		this.mono.img=0;
	}
	this.mono.obj.setAttribute("src",Diccionario.imagenes.mono[this.mono.mira][this.mono.img]);
});

function modal(content,visible=-1){
	content.style.display=(visible==-1)?
						((content.style.display=="none")?"":"none"):
						(visible)?"":"none";
}

function resetear(){
	this.mono.obj.style.bottom="0px";
	this.mono.obj.style.left="10px";
	this.mono.vidas=1;
	this.mono.bananas=0;
	this.mono.mira="der";
	this.mono.img=0;
	this.caja_nombre.value="";
	this.bananas.innerHTML=`Bananas: ${this.mono.bananas}`;
	// Agregar imagenes principales
	this.mono.obj.setAttribute("src",Diccionario.imagenes.mono[this.mono.mira][this.mono.img]);
	this.content_vidas.innerHTML="";
	for(let a=0; a<this.mono.vidas; a++){
		let vida=document.createElement("img");
		vida.setAttribute("src",Diccionario.imagenes.vida);
		vida.setAttribute("class","vida");
		vida.setAttribute("id","vida"+a);
		this.content_vidas.appendChild(vida);
	}
	this.btn_audio.setAttribute("src",Diccionario.imagenes.audio);
	// Eliminar objetos
	let objetos=this.content_juego.getElementsByClassName("objeto");
	let conta=0;
	while(conta<objetos.length){
		this.content_juego.removeChild(objetos[0]);
		conta++;
	}
}

function quitarVida(){
	this.content_vidas.removeChild(document.getElementById("vida"+(this.mono.vidas-1)));
	this.mono.vidas--;
	return this.mono.vidas>0;
}

function agregarBanana(){
	this.mono.bananas++;
	this.bananas.innerHTML=`Bananas: ${this.mono.bananas}`;
}

function moverObjeto(objeto){
	let limite_abajo=window.innerHeight-objeto.height;
	let intervalo;
	intervalo=setInterval(()=>{
		let altura=Number(objeto.style.top.replace("px",""));
		let izquierda=Number(objeto.style.left.replace("px",""));
		let izquierda_mono=Number(this.mono.obj.style.left.replace("px",""));
		//console.log(objeto);
		objeto.style.top=(altura+5)+"px";
		if(altura>=limite_abajo-5){
			content_juego.removeChild(objeto);
			clearInterval(intervalo);
		}else
		if(altura>=window.innerHeight-this.mono.obj.height && izquierda>=izquierda_mono && izquierda<=izquierda_mono+this.mono.obj.width){
			if(objeto.getAttribute("src")==Diccionario.imagenes.banana){
				this.agregarBanana();
			}else
			if(objeto.getAttribute("src")==Diccionario.imagenes.tronco){
				if(!this.quitarVida()){
					this.mostrarPuntaje();
				}
			}
			content_juego.removeChild(objeto);
			clearInterval(intervalo);
		}
	},50);
}

function crearObjeto(num){
	let conta=0;
	for(let a=0; a<num; a++){
		let limite_izq=0;
		let limite_der=window.innerWidth-this.mono.obj.width-10;
		let tronco=document.createElement("img");
		tronco.setAttribute("class","objeto");
		tronco.style.top="0px";
		tronco.style.left=this.numeroAleatorio(limite_der)+"px";
		if(this.numeroAleatorio(2)==0){
			tronco.setAttribute("src",Diccionario.imagenes.banana);
		}else{
			tronco.setAttribute("src",Diccionario.imagenes.tronco);
		}
		this.content_juego.appendChild(tronco);
		this.moverObjeto(tronco);
		if(a>=num){
			this.content_juego.removeChild(tronco);
		}
	}
}

function numeroAleatorio(max=0,min=0){
	return Math.round(Math.random()*(max-min)+min);
}

function inicio(){
	this.modal(content_puntaje_obtenido,false);
	this.modal(content_juego,false);
	this.modal(content_inicio,true);
	this.obtenerPuntajes();
	this.audio.pause();
}

function jugar(){
	this.modal(content_juego,true);
	this.modal(content_inicio,false);
	this.resetear();
	this.audio.play();
	let intervalo;
	intervalo=setInterval(()=>{
		this.crearObjeto(this.numeroAleatorio(3,1));
		if(this.mono.vidas<=0){
			clearInterval(intervalo);
		}
	},1500);
}

function mostrarPuntaje(){
	this.modal(content_juego,false);
	this.modal(content_puntaje_obtenido,true);
	this.caja_nombre.value="Jugador "+(Number((Puntaje.puntajes()??[]).length)+1);
	this.puntaje_obtenido.innerHTML=this.mono.bananas;
	this.audio.pause();
}

function obtenerPuntajes(){
	this.content_puntaje.innerHTML="";
	(Puntaje.puntajes()??[]).forEach((dato)=>{
		let puntaje=document.createElement("li");
		puntaje.innerHTML=`${dato.nombre} - ${dato.bananas}`;
		this.content_puntaje.appendChild(puntaje);
	});
}