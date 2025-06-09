
# Tiempo Productivo - Pomodoro y Gestor de Tareas

**Tiempo Productivo** es una aplicación web diseñada para ayudarte a aumentar tu productividad y gestionar tus tareas de forma eficaz. Combina un temporizador Pomodoro flexible con una lista completa de tareas, todo envuelto en una interfaz limpia y personalizable.

## ✨ Features
## ✨ Características

*   **🍅 Temporizador Pomodoro:**
    *   Duraciones personalizables para el trabajo, pausas cortas y pausas largas.
    *   Indicador visual de progreso para el segmento de temporizador actual.
    *   Cambio de modo sencillo (Trabajo, Pausa Corta, Pausa Larga).
    *   Contador de Pomodoros con opción de reinicio.
    *   Actualizaciones dinámicas del título de la pestaña del navegador para mostrar el estado actual del temporizador.
    *   Modal de configuración persistente para ajustar las duraciones del temporizador (guardado localmente).
    *   Sutil animación de pulso cuando termina un segmento del temporizador.

*   **✅ Lista de Tareas:**
    *   Añade, completa y elimina tareas sin problemas.
    *   Edita los detalles de la tarea, incluyendo nombre, notas, fecha de vencimiento y hora de vencimiento.
    *   Asigna fechas y horas específicas a las tareas usando un calendario y selector de hora intuitivos.
    *   Opciones flexibles para ordenar tareas:
        *   Más reciente (por defecto)
        *   Fecha de vencimiento (ascendente/descendente)
        *   Estado de completado (pendientes primero/completadas primero)
    *   Añade rápidamente tareas comunes usando plantillas de tareas predefinidas.
    *   🎉 ¡Divertida animación de confeti al completar una tarea!
    *   Los detalles de la tarea se pueden editar a través de una cómoda hoja deslizante.
    *   Mensaje amigable de estado vacío cuando no hay tareas presentes.
    *   Las tareas se guardan localmente en el navegador para persistencia.

*   **🎨 Interfaz Personalizable:**
    *   Múltiples paletas de colores para elegir, lo que te permite personalizar la apariencia de la aplicación.
    *   El tema seleccionado se guarda localmente.
    *   Diseño responsivo para un uso óptimo en varios tamaños de pantalla.

*   **🚀 Stack Tecnológico Moderno:**
    *   Construido con Next.js (App Router) y React.
    *   Diseñado con Tailwind CSS.
    *   Utiliza componentes ShadCN UI para un aspecto pulido y profesional.
    *   Gestión de estado del lado del cliente con React Hooks y Context API.

## 🚀 Empezando

1.  **Explora el Temporizador:**
    *   Navega a la pestaña "Temporizador".
    *   Ajusta las duraciones de trabajo/pausa a través del icono de configuración (⚙️).
    *   Inicia, pausa y reinicia el temporizador según sea necesario.
2.  **Gestiona tus Tareas:**
    *   Cambia a la pestaña "Tareas".
    *   Añade nuevas tareas usando el campo de entrada.
    *   Usa plantillas de tareas (icono 📋) para entradas rápidas.
    *   Haz clic en una tarea para abrir la hoja de detalles y establecer fechas de vencimiento, horas o añadir notas.
    *   Marca las tareas como completadas usando las casillas de verificación.
    *   Ordena tus tareas usando el menú desplegable.
3.  **Personaliza tu Tema:**
    *   Haz clic en el icono de paleta (🎨) en la esquina superior derecha para seleccionar tu esquema de colores preferido.

## 📂 Project Structure
## 📂 Estructura del Proyecto

*   `src/app/`: Contains the main application pages and layout.
    *   `page.tsx`: The main page component.
    *   `layout.tsx`: The root layout for the application.
    *   `globals.css`: Global styles and theme variables.
*   `src/components/`: Reusable React components.
    *   `ui/`: ShadCN UI components.
    *   `pomodoro-timer.tsx`: The Pomodoro timer logic and UI.
    *   `task-list.tsx`: The task list logic and UI.
    *   `color-palette-selector.tsx`: Component for changing themes.
    *   `task-details-sheet.tsx`: Sheet for editing task details.
    *   `time-picker.tsx` & `time-picker-input.tsx`: Components for selecting time.
*   `src/context/`: React context providers (e.g., `theme-context.tsx`).
*   `src/lib/`: Utility functions and library configurations (e.g., `themes.ts`, `utils.ts`).
*   `src/hooks/`: Custom React hooks (e.g., `use-toast.ts`, `use-mobile.ts`).
*   `public/`: Static assets.

