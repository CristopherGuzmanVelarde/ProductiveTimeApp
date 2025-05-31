
# Tiempo Productivo - Pomodoro & Task Manager

**Tiempo Productivo** is a web application designed to help you boost your productivity and manage your tasks effectively. It combines a flexible Pomodoro timer with a comprehensive task list, all wrapped in a clean and customizable interface.

## Features

*   **Pomodoro Timer:**
    *   Customizable work, short break, and long break durations.
    *   Visual progress indicator for the current timer segment.
    *   Mode switching (Work, Short Break, Long Break).
    *   Pomodoro count tracker with an option to reset.
    *   Browser tab title updates to show current timer status.
    *   Settings modal to adjust timer durations, saved locally.
    *   Pulse animation when a timer segment ends.

*   **Task List:**
    *   Add, complete, and delete tasks.
    *   Edit task details including name, notes, due date, and due time.
    *   Assign due dates and specific times to tasks using a calendar and time picker.
    *   Task sorting options:
        *   Most recent (default)
        *   Due date (ascending/descending)
        *   Completion status (pending first/completed first)
    *   Task templates to quickly add common tasks.
    *   Confetti animation upon task completion for a bit of fun!
    *   Task details are editable via a slide-out sheet.
    *   Empty state with a friendly message when no tasks are present.
    *   Tasks are saved locally in the browser.

*   **Customizable Interface:**
    *   Multiple color palettes to choose from, allowing you to personalize the app's appearance.
    *   The selected theme is saved locally.
    *   Responsive design for use on various screen sizes.

*   **Modern Tech Stack:**
    *   Built with Next.js (App Router) and React.
    *   Styled with Tailwind CSS.
    *   Utilizes ShadCN UI components for a polished look and feel.
    *   Client-side state management with React Hooks and Context API.

## Getting Started

1.  **Explore the Timer:**
    *   Click on the "Temporizador" tab.
    *   Adjust work/break durations via the settings icon (⚙️).
    *   Start, pause, and reset the timer as needed.
2.  **Manage Your Tasks:**
    *   Switch to the "Tareas" tab.
    *   Add new tasks using the input field.
    *   Use task templates (📋 icon) for quick entries.
    *   Click on a task to open the details sheet and set due dates, times, or add notes.
    *   Mark tasks as complete using the checkboxes.
    *   Sort your tasks using the dropdown menu.
3.  **Customize Your Theme:**
    *   Click the palette icon (🎨) in the top right corner to select your preferred color scheme.

## Project Structure

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

This project was built using Firebase Studio.
```