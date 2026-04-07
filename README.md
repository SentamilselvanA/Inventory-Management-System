# Inventory Management System with Role-Based Access

The Inventory Management System with Role-Based Access is a full-stack web application designed to manage inventory operations efficiently within an organization. The system allows different users (Admin, Manager, Staff) to access specific features based on their roles. It helps track products, stock levels, suppliers, sales, and reports in real-time, reducing manual errors and improving operational efficiency.

## 🚀 Features Implemented So Far

The project is currently in the **Frontend Phase** with dummy data mapping to simulate future backend functionality.

*   **Modern Premium UI Grid**: Fully responsive user interface built using **React** and **Tailwind CSS**.
*   **Role-Based Layouts**: The dashboard dynamically updates navigation items based on the user's role (Admin, Manager, Staff).
*   **Collapsible Sidebar**: A sleek, animated sidebar that gracefully collapses into a compact icon-only view.
*   **Light & Dark Mode**: A custom theme toggler built into the UI, persisting preference via Local Storage and smoothly transitioning colors.
*   **Authentication Screen**: A placeholder login screen mapping emails containing `admin`, `manager`, or `staff` to specific application views.
*   **Dashboard Analytics**: Visual representation of metrics in a responsive Grid.
*   **Inventory & Product Tables**: Data grids displaying catalogues and transaction logs with specific visual indicators (e.g., colored badges for "In Stock", "Out of Stock").
*   **Admin User Management**: Admin-only view to handle application users.

## 💻 Tech Stack (Frontend)

*   **Vite**: extremely fast development server and bundler.
*   **React**: UI Library.
*   **React Router**: Client-side routing (`react-router-dom`).
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **Lucide React**: Beautiful and consistent SVG icons.

## 🛠️ Installation & Setup

Currently, only the **Frontend** is available to run.

### Prerequisites
*   [Node.js](https://nodejs.org/en/) installed on your machine (v18 or higher recommended).

### Steps to Run

1.  **Open terminal inside the project directory**
2.  **Navigate directly to the frontend folder:**
    ```bash
    cd frontend
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    npm install lucide-react
    npm install talwindcss @tailwindcss/vite
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
5.  **Open the application:**
    Open your browser to `http://localhost:5173/` (or whichever port Vite outputs in the terminal).

### 🔑 Demo Login Instructions
To test the role-based functionality without connecting to a database, you can use the "Demo Access" buttons on the Login page, or manually input an email matching a role:
- **Admin Layout**: Use `admin@nexusims.com`
- **Manager Layout**: Use `manager@nexusims.com` 
- **Staff Layout**: Use `staff@nexusims.com`

---
*Note: The Node.js/Express and MongoDB backend implementation is listed as the next phase.*
