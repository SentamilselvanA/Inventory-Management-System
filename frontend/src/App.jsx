import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import Suppliers from "./pages/Suppliers";

function App() {
  const [user, setUser] = useState(null); // mock user state: { role: 'admin' | 'manager' | 'staff', name: 'John Doe' }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            user ? (
              <DashboardLayout user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="products" element={<Products user={user} />} />
          <Route path="inventory" element={<Inventory user={user} />} />
          {user?.role !== 'staff' && (
            <Route path="suppliers" element={<Suppliers user={user} />} />
          )}
          {user?.role === 'admin' && (
            <Route path="users" element={<Users user={user} />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
