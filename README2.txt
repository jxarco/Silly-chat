# ECV

Segunda práctica
- CANVAS 3D

Alejandro Rodríguez Corrales
174249
alejandro.rodriguez04@estudiant.upf.edu

David Moreno Esteban
174440
david.moreno04@estudiant.upf.edu

Alexis Ruiz Alcalá
174746
alexis.ruiz01@estudiant.upf.edu

##############################################################################

NOTA: El chat tiene disponibles notificaciones por cada mensaje. Habrá que
dar permisos al navegador para mostrarlas y además, dado que nuestro chat se
encuentra en una carpeta local, tendremos que abrirlo desde el host que 
nos ofrece GitHub:

				https://jxarco.github.io/ECV1

Una vez dentro, clicar al escudo de la barra navegación para permitir todas
las cargas de scripts, sino no funcionará nada.

Si se abre localmente, funcionará de la misma manera todo excepto que no
dispondremos de notificaciones.

!!!!!!!				!!!!!!!				 	    !!!!!!
UPDATE: Con XAMPP funcionan!!! No hace falta usar el servidor de GitHub
!!!!!!!				!!!!!!!				 	    !!!!!!

##############################################################################

Añadido el canvas 3d y aplicada una nueva distribución: 

	- En la nueva distribución, podemos abrir la información con la tecla P.
	Para cerrarla, pulsamos ESC o haciendo clic en HIDE.

		o INFORMACION desde ahora = PERFIL + GENTE

	- De la misma manera, podemos abrir el chat rápidamente con la tecla C.
	Cerramos con ESC.

##############################################################################

CANVAS 3D:

	- Inicialmente:
		o Servidor OFF: Veremos la escena sin muñecos ni luces.
		o Servidor ON: Cuando alguien se conecta, se añade a la escena
		automáticamente una luz propia y un jugador.
	
		Este jugador podrá moverse con WASD dentro del ring y además podrá
		crear cubos pulsando SPACE.
	
	- Cada vez que alguien se conecte, el resto verán una nueva luz y otro 
	jugador. El mundo está sincronizado para todos ellos.

	- Cada uno podrá ver donde esta situada la cámara de cada jugador.
	(Esfera del color de la luz)

	- Cuando un usuario se desconecte, se eliminará de la escena su luz
	y su jugador.

	- GUI: 
		o Lanzar confeti: Visible para todos los presentes
			- Audio junto con el lanzamiento.
			- Cuando colisiona con ring o suelo se quedará hasta…
		o … Eliminar confeti: Simplemente borramos todo el confeti, 
		para todos. (Se para la música.)

		o Opciones del ring: Cambiar color del ring.
		Para que los demás lo vean visible, cambiar + SEND COLOR.
		
		o Opciones de cámara: Podemos cambiar la visualización de la
		cámara tanto por orbit controls o por la GUI.

		o Botón de cámara por defecto.

##############################################################################

(PRÁCTICA 1 DE AQUÍ HACIA ABAJO)

##############################################################################


Selección de sala: Pantalla de inicio. Escribir “room” a la que queremos
entrar y pulsar ENTER. 

	- Al entrar, focus automático a la caja de texto del 
	chat.

##############################################################################

Menú: Podemos abrirlo en la parte superior izquierda. En el podremos:

	- Abrir o cerrar el chat
	- Eliminar la conversación existente
	- Abrir Información (Desde la P2 PERFIL + PERSONAS ONLINE)
	- Cambiar tema: Hay 4 disponibles, cada uno con un CSS distinto.
		o Simple
		o Elegant
		o Fashion
		o Console
	
	Podemos cerrar el menú haciendo clic a la X o pulsando ESC.

##############################################################################

Mi Perfil: Representación de nuestro avatar y de nuestro nombre de usuario.
Dos botones para poder cambiar dicha información.
	
	- Botón 1: Abrir área de texto y selección de avatares haciendo clic.
	DETALLE: Al clicar, focus automático al area de texto y scroll down para
	ver el panel de modificación entero o el panel de avatares.
	- Cerrar pulsando ESC cualquiera de los submenús.
	- Cuando los cambiemos se enviará un auto-mensaje a los demás en el chat.
	- Se cambiará en el chat de la otra persona automáticamente.
	- Otro botón para ocultar el cuadro de “Mi perfil”.

##############################################################################

Gente conectada: Parte donde aparecerá la gente conectada al chat. Cuando una
persona ingrese al chat, se enviará un auto-mensaje a las personas que ya 
están en el chat.

	- Desaparecerán del panel los usuarios que se desconecten.

##############################################################################

Cuadro de chat: En el podremos realizar 3 operaciones distintas:
	
	- Enviar mensajes públicos: llegarán a todas las personas conectadas.
	Enviar usando el botón SEND o la tecla ENTER. Usando el botón se hará
	focus automático a la caja de texto para volver a enviar otro msg.

	- Enviar mensajes privados al estilo “whispers”: Escribir el mensaje
	y una vez queramos enviar, hacer clic en el avatar de la persona a la
	queramos enviar el mensaje. Este solo le llegará a dicha persona.

	- Zoom al avatar de cada persona dentro del chat. Hacer clic al avatar
	que aparece junto al mensaje de cada persona.
	
	NOTA: En los dos tipos de mensajes podremos activar o desactivar la casilla
	de mayúscula automática en la primera letra del mensaje.

##############################################################################
