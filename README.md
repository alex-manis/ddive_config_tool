# JSON Config Tool

A web-based GUI for managing JSON configuration files. This tool simplifies the process of creating, editing, and deleting publisher configurations, which are stored as JSON files. It provides a user-friendly interface to prevent manual errors when editing complex JSON data.

## Live Demo

[![Demo of JSON Config Tool](https://alex-manis.github.io/config_tool_frontend/assets/demo.gif)](https://alex-manis.github.io/config_tool_frontend)

The application is deployed on GitHub Pages and can be accessed here:
**[https://alex-manis.github.io/config_tool_frontend/](https://alex-manis.github.io/config_tool_frontend)**

## Core Features

- **Publisher Management (CRUD)**: Full Create, Read, Update, and Delete functionality for publisher configurations. The application simulates a backend by fetching and saving data to JSON files located in the `/data` directory.
- **Form-Based Editing**: A structured form with validation to edit publisher settings. It handles various data types, including nested objects and arrays, presenting them in an intuitive way.
- **Dynamic Form Fields**: Easily add or remove items from lists, such as pages and custom key-value fields, through an interactive table interface.
- **Live JSON Diff Viewer**: Visually compare changes between the original and modified configuration in a side-by-side JSON view before saving. This helps to verify changes and understand their impact.
- **Unsaved Changes Warning**: Prevents accidental data loss by using the `beforeunload` event to warn the user if they attempt to navigate away with unsaved changes.
- **Real-time Search and Filter**: Instantly filter the publisher list by name.
- **Auto-Generated Publisher ID**: During creation, the Publisher ID is automatically suggested based on the Alias Name to ensure consistency and save time.
- **Collapsible Sections**: The editor form is organized into collapsible sections to keep the interface clean and allow users to focus on specific parts of the configuration.

## Technologies Used

This project is built with a focus on modern, vanilla web technologies without a heavy framework dependency.

- **Frontend**:
  - **HTML5**: For the core structure of the application.
  - **CSS3**: For styling, layout (using Flexbox and Grid), and animations.
  - **TypeScript**: For all application logic, providing type safety and modern JavaScript features.
- **Build Process**:
  - **TypeScript Compiler (`tsc`)**: Compiles TypeScript source code into JavaScript that runs in the browser.
- **Development & Deployment**:
  - **HTTP-Server**: A simple, zero-configuration command-line HTTP server for local development.
  - **GitHub Pages**: For hosting the static application.

## Branding and Assets

The user interface and branding elements are inspired by the brand book to ensure a familiar look and feel for the target users ( Support Engineers).

## Project Structure

The project is organized into the following main directories:

- `public/`: Contains the main `index.html`, compiled JavaScript (`client/`), CSS (`styles.css`), and static assets (`assets/`). This is the directory that is served to the user.
- `src/`: The TypeScript source code for the application logic.
  - `api/`: Handles communication with the "backend" (simulated via local JSON files on the server).
  - `components/`: UI components like the publisher list, tables, and the JSON diff viewer.
  - `state/`: Global application state management.
  - `utils/`: Helper functions for DOM manipulation, form handling, validation, etc.
  - `app.ts`: The main application entry point that initializes event listeners and starts the app.
- `data/`: Stores the publisher configuration data as individual JSON files.

## Future Improvements

- **User Authorization**: Implement a simple authentication system for a predefined list of internal users, as this is an internal company tool.
- **Change Auditing**: Add metadata to each publisher configuration to track who made the last change and when (user, date, time).
- **Enhanced User Experience**:
  - Replace native browser `alert` and `confirm` dialogs with custom modal windows for a more seamless and modern user experience.
  - Continuously refine form fields and layouts based on user feedback to improve usability.
- **Performance Optimization**: Further optimize the application's performance, especially when handling a large number of publisher configurations.
- **Responsive Design**: Improve the layout and user interface for better usability on tablets and mobile devices.
- **Automated Testing**: Introduce a testing framework (like Jest or Vitest) to add unit and integration tests, ensuring code quality and stability.
- **CI/CD Pipeline**: Set up a GitHub Actions workflow to automate TypeScript compilation and deployment to GitHub Pages on every push to the `main` branch.
