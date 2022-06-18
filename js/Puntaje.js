class Puntaje{

	static agregar(datos){
		let puntajes=JSON.parse(localStorage.getItem("puntajes"));
		if(puntajes==null){
			localStorage.setItem("puntajes",JSON.stringify([datos]));
		}else{
			puntajes.push(datos);
			localStorage.setItem("puntajes",JSON.stringify(puntajes));
		}
		return true;
	}

	static puntajes=JSON.parse(localStorage.getItem("puntajes"));

}