// vamos a optimizar el codigo viejo , del juego anterior, paso a paso 
// PATRON MODULO, encapsulacion:
// hacemos ejemplos de funciones anonimas
// modelo 1 (mas resumido): ()=>{}
// 'funcion autoinvocada', para llamarla inmediatamente se le agregan dos parentesis, así:
// Las funciones anonimas crean un escope 
// por ultimo encapsulamos todo el codigo del juego en una f anonima autoinvocada con use strict
const miModulo=(()=>{
    'use strict' // ayuda a ejecutar de forma mas limia el codigo js // Elimina errores silenciosos de JavaScript haciendo que lancen excepciones
                // crea un scope de un solo blocke 

    let     mazo  =[];
    const   palos =['C','D','H','S'], 
            ases  =['A','J','Q','K'];
    let     puntosJugadores=[];

    // Referencias del html , indico a js el elemento en el dom
    const   btnPedir          = document.querySelector('#btnPedir'),
            btnDetener        = document.querySelector('#btnDetener'), 
            btnNuevoJuego     = document.querySelector('#btnNuevo');
    //referencias a los div html:
    const   divCartasJugadores  = document.querySelectorAll('.divCartas'),
            puntosHtml          = document.querySelectorAll('small');   // selecciono el elemento html en el cual quiero aplicar
                                                                        // querySelectorAll mediante arreglo [0,1 etc] se referencia mediante la posicion del elemento a trabajar
    

    //fincion para iniciar el juego
    const   inicializarJuego=(numeroJugadores=2)=>{
            mazo = crearMazo();

            puntosJugadores= [];
            for(let i=0; i < numeroJugadores; i++ ){
                puntosJugadores.push(0);
            }

        // limpio la acumulacion de cartas
        console.clear();

        //vuelvo a 0 los elementos html
        puntosHtml.forEach( elem => elem.innerText = 0); // por cada elemento los vuelvo a 0

        // elimino las imagenes y elementos html
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
        
    }
    // funcion para crear mazo y mezlcarlo en aleatorio
    const crearMazo = () => {

        mazo = [];
        for( let i=2; i<= 10; i++ ){        // que se sume hasta 10
            for(let palo of palos){         
                mazo.push(i + palo);        //metodo push envio el numero actual 1,2,3 etc... con el palo actual: c,d,j,q...        
            }
        }
        for(let palo of palos){
            for( let as of ases){            
                mazo.push( as + palo);      // mando cada as actual  sumado con el palo actual
            }
        }
                  
        return _.shuffle(mazo);         // libreria underscore , usamos una de sus funciones (_.shufle) , que sirve para enviar en aleatorio los arreglos
    }
    // crearMazo();    

    // funcion para pedir carta
    const pedirCarta = () =>{
        if(mazo.length === 0){
            throw 'No hay más cartas en el mazo';   // throw muestra un error y deja de ejecutar

        }
         return mazo.pop();    // remueve el ultimo elemento del arreglo y lo devuelve ;  //carta que va sacando al azar, y descontando  
    }


    //funcion para obtener valor de la carta (21 puntos )
    const valorCarta =( carta )=>{
        const valor = carta.substring(0 , carta.length-1 ); // substring(): devuelve una cadena de caracteres recortada, donde se indica un inicio y un fin, con indices como en los arreglos[], tenemos que decir cuantos caracteres vamos a devolver
        // Reducido codigo : 
        return (isNaN(valor)) ?             // isNaN = es una letra ? if...(letra) else(numero)
            (valor=== 'A') ? 11:10
            : valor * 1;
    }

    // Turno: 0 = al primer jugador y el ultimo es la computadora
    const acumularPuntos=( carta, turno )=>{            // pedimos como parametro el valor de la carta

        puntosJugadores[turno]= puntosJugadores[turno] + valorCarta(carta); // standarizamos el valor del turno de quien este jugando, usando un arreglo
        puntosHtml[turno].innerText = puntosJugadores[turno];   // Abrimos en el html, turn (porque representa a quien este jugando ) 
        return puntosJugadores[turno];
    }
    
    const crearCarta=(carta, turno) =>{
            const imgCarta = document.createElement('img'); // creo imagen 
            imgCarta.src=`assets/cartas/${ carta }.png`;    //indico la ruta y añado la variable ${} de las cartas que voy a mostrar
            imgCarta.classList.add('carta');    // indicamos el nombre de la clase usada en css (en este caso en styles)
            divCartasJugadores[turno].append( imgCarta ) //creo la imagen 'vacia'

    }

    const determinarGanador=()=>{
        const [ puntosMinimos, puntosComputador ] = puntosJugadores; // desestructuracion de arreglos
        setTimeout(()=>{                            //  es una funcion , que hace ejecutar este callback(funcion pasada como argumento) un poquito despues la condicion para que muestre las cartas y luego el alert
            if(puntosComputador === puntosMinimos){
                swal('Nadie gana :(' );
            }else if(puntosMinimos > 21){
                swal('Ganó la computadora');
            }else if(puntosComputador > 21 ){
                swal('Ganasteee !!!');

            }else if(puntosComputador > puntosMinimos ){
                swal('Ganó la computadora...');
            }
        },100 );  
    }
    /////// TURNO DE LA COMPUTADORA:
    const turnoComputadora = (puntosMinimos)=>{
        let puntosComputador=0; // cargo la variable acá para poder usar el resto de la loguca existente
        do{
            const carta= pedirCarta();  // el valor que salga en la carta
            puntosComputador = acumularPuntos(carta, puntosJugadores.length - 1 ); // optimizamos el turno de cada jugador, con un formato standard | Usamos la ultima posicion del arreglo para referirnos a la computadora
            crearCarta(carta, puntosJugadores.length - 1); 
        
        }while((puntosComputador < puntosMinimos) && (puntosMinimos <=  21) );  //se ejecuta cuando...
        
        determinarGanador(puntosJugadores);
        
    }

    //////** * EVENTOS : **////////  en base al jugador !!
    //* Cuando creamos elementos en los eventos debemos indicar hasta las clases *//

    //* Apunte , callback : es una funcion que se pasa como argumento
    btnPedir.addEventListener('click', ()=>{
        
        const carta= pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta(carta, 0 );

        if(puntosJugador > 21){
            swal('Perdiste!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador); // envio como argumento los puntos del jugador, no es obligatorio pero es buena practica
        }else if(puntosJugador === 21){
            swal('21, Muy bien !!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }/* else if(puntosComputador != 21 && 0 ){
            alert('ganaste!');
        } */


    });

    //botón detener:
    btnDetener.addEventListener('click', ()=>{
        btnDetener.disabled = true;
        btnPedir.disabled   =true;
        
        // turnoComputadora(puntosJugador);
        turnoComputadora(puntosJugadores[0]);

    }); 

    //Boton nuevo juego:
    btnNuevoJuego.addEventListener('click',()=>{
        
        inicializarJuego();

    });



    return {
           nuevoJuego : inicializarJuego // lo que se retorne acá va a ser publico y TODO lo demas , privado. y se va a poder acceder a el , mediante el modulo
    };

})();

/* //funcion normal para entender (funciona igual):
(function(){

})();
 */
 

/***** CONTINUAR CON EL VIDEO 06 DE OPTIMIZACIONES 2DA PARTE || MIN 4:40 , 'creacion de imagen de carta' *****/