# Padel Arena League

Plataforma web gratuita y flexible diseñada para la gestión automática de ligas y torneos de pádel no oficiales.

## Descripción

Padel Arena League es una aplicación web que permite a los jugadores inscribirse, organizar partidos y seguir su evolución en tiempo real. La plataforma genera encuentros automáticamente según la disponibilidad de los jugadores, actualiza los resultados y gestiona la clasificación sin intervención manual.

## Características Principales

- **Inscripción Simplificada**: Registro en ligas según la temporada en curso o en torneos específicos.
- **Generación Automática de Partidos**: Asignación de encuentros según disponibilidad semanal.
- **Clasificación en Tiempo Real**: Actualización automática de resultados y tabla de clasificación.
- **Gestión de Equipos**: Formación de equipos y consulta de estadísticas.
- **Seguimiento de Encuentros**: Calendario de partidos con fechas y horarios sugeridos.
- **Comunicación**: Sistema de mensajes para coordinar partidos y recibir notificaciones.

## Tecnologías Utilizadas

- **Frontend**: React.js con Vite
- **Estilos**: CSS Modules
- **Backend**: Supabase (autenticación, base de datos y mensajería en tiempo real)
- **Autenticación**: Email y Google con Supabase Auth
- **Enrutamiento**: React Router
- **Estado Global**: Context API

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/tu-usuario/padel-arena-league.git
   cd padel-arena-league
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu-url-de-supabase
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
   ```

4. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

## Estructura del Proyecto

- `/src/components`: Componentes reutilizables
- `/src/pages`: Páginas principales
- `/src/context`: Context API para gestionar el estado global
- `/src/services`: Conexión con Supabase
- `/src/hooks`: Custom hooks
- `/src/styles`: Estilos en CSS Modules
- `/src/utils`: Funciones auxiliares
- `/src/assets`: Imágenes y recursos estáticos

## Contribución

Si deseas contribuir al proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
