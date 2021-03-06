const miModulo=(()=>{
    'use strict' // ayuda a ejecutar de forma mas limpia el codigo js // Elimina errores silenciosos de JavaScript haciendo que lancen excepciones
                // crea un scope 

    let     mazo  =[];
    const   palos =['C','D','H','S'], 
            ases  =['A','J','Q','K'];
    let     puntosJugadores=[];

    // Referencias del html , indico a js el elemento en el dom
    const   btnPedir          = document.querySelector('#btnPedir'),
            btnDetener        = document.querySelector('#btnDetener'), 
            btnNuevoJuego     = document.querySelector('#btnNuevo'),
            btnReglas         = document.querySelector('#btnReglas');
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
            throw 'No hay m??s cartas en el mazo';   // throw muestra un error y deja de ejecutar

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
            imgCarta.src=`assets/cartas/${ carta }.png`;    //indico la ruta y a??ado la variable ${} de las cartas que voy a mostrar
            imgCarta.classList.add('carta');    // indicamos el nombre de la clase usada en css (en este caso en styles)
            divCartasJugadores[turno].append( imgCarta ) //creo la imagen 'vacia'

    }

    const determinarGanador=()=>{
        const [ puntosMinimos, puntosComputador ] = puntosJugadores; // desestructuracion de arreglos
        setTimeout(()=>{                            //  es una funcion , que hace ejecutar este callback(funcion pasada como argumento) un poquito despues la condicion para que muestre las cartas y luego el alert
            if(puntosComputador === puntosMinimos){
                Swal.fire('Nadie gana :(' );
                // swal('Nadie gana :(' );
            }else if(puntosMinimos > 21){
                // alert('Gan?? la computadora');
                // swal('Gan?? la computadora');
            }else if(puntosComputador > 21 ){
                // Swal.fire('Ganasteee !!!');
                
                Swal.fire({
                    title: 'Felicitaciones GANASTE !!',
                    width: 600,
                    padding: '1em',
                    background: '#fff url(/images/trees.png)',
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("./assets/images/victoria.gif")
                      left top
                      no-repeat
                    `
                  }) 
                    const sonido=()=>{
                        let sonidito = new Audio();
                        sonidito.src="./assets/music/aplausos.ogg";
                        sonidito.play();  
                    }
                  sonido();
                

                // swal('Ganasteee !!!');

            }else if(puntosComputador > puntosMinimos ){
                Swal.fire('Gan?? la computadora...');
                // swal('Gan?? la computadora...');
            }
        },100 );  
    }
    /////// TURNO DE LA COMPUTADORA:
    const turnoComputadora = (puntosMinimos)=>{
        let puntosComputador=0; // cargo la variable ac?? para poder usar el resto de la loguca existente
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
        
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta(carta, 0 );
        setTimeout(()=>{ 
        if(puntosJugador > 21){
            
            // swal('Perdiste!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador); // envio como argumento los puntos del jugador, no es obligatorio pero es buena practica
            // Swal.fire('Perdiste, Volv?? a intentarlo!')
            Swal.fire('Perdiste, volv?? a intentarlo!')
        }else if(puntosJugador === 21){
            
            
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
            // alert('21, Muy bien !!');
            
        }/* else if(puntosComputador != 21 && 0 ){
            alert('ganaste!');
        } */
    },100);

    });

    //bot??n detener:
    btnDetener.addEventListener('click', ()=>{
        btnDetener.disabled = true;
        btnPedir.disabled   = true;
        
        // turnoComputadora(puntosJugador);
        turnoComputadora(puntosJugadores[0]);

    }); 

    //Boton nuevo juego:
    btnNuevoJuego.addEventListener('click',()=>{
        
        inicializarJuego();

    });

    // reglas
    btnReglas.addEventListener('click',()=>{
        Swal.fire({
            title: 'El objetivo es simple: ganarle al Croupier(computadora) obteniendo el puntaje m??s cercano a 21. Las figuras (el Valet, la Reina y el Rey) valen 10, el As vale 11 o 1 y todas las otras cartas conservan su valor. El Black Jack se produce cuando las dos (2) primeras cartas son un diez o cualquier figura m??s un As, para comenzar presion?? NUEVO JUEGO, luego pedi las cartas que consideres, por ultimo detenelo para saber quien gana, en caso que llegues a 21, el juego se detiene automaticamente',
            width: 700,
            padding: '1em',
            background: '#fff url(/images/trees.png)',
            backdrop: `
              rgba(0,0,123,0.4)
              no-repeat
            `
          })
    });


    return {
           nuevoJuego : inicializarJuego // lo que se retorne ac?? va a ser publico y TODO lo demas , privado. y se va a poder acceder a el , mediante el modulo
    };

})();

 
