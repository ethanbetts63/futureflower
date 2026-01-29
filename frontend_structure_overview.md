# Frontend Architecture Overview (ForeverFlower) - Detailed Structure

The `foreverflower` frontend is a React application. The core of the application resides within the `src` directory, which is organized as follows:

*   **`api/`**: This directory contains modules responsible for interacting with the backend API. It abstracts away the details of HTTP requests and responses, providing a clean interface for data fetching and submission.
*   **`assets/`**: This directory is dedicated to static assets such as images, icons, fonts, and other media files used throughout the application.
    *   **`assets/fonts/`**:
        *   **`assets/fonts/Playfair_Display/`**:
            *   **`assets/fonts/Playfair_Display/static/`**:
*   **`components/`**: All custom components. 
    *   **`components/ui/`**: All shadcn components. 
*   **`context/`**: This directory manages React Context API implementations for global state management. Contexts defined here provide a way to share data across the component tree without prop-drilling.
*   **`data/`**: This directory holds mock data, constants, or any other static data that might be used by the application, often for development purposes or for configuration.
*   **`forms/`**: Form-related components, logic, and validation schemas are organized within this directory. This includes definitions for form resolvers and data structures.
*   **`pages/`**: Top-level components that represent different views or routes of the application are found here.
    *   **`pages/admin/`**: Pages specific to the administration section of the application.
    *   **`pages/articles/`**
    *   **`pages/upfront_flow/`**
    *   **`pages/user_dashboard/`**: Pages related to the user's personal dashboard and account management.
*   **`types/`**
*   **`utils/`**
Beyond these directories, `App.tsx` serves as the main application component, orchestrating the layout and routing, while `main.tsx` is the entry point of the React application, responsible for rendering the root component into the DOM.