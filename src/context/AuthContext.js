// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");

//     if (token && savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     }

//     setLoading(false);
//   }, []);

//   const login = (data) => {
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));

//     setUser(data.user);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         loading,
//         isAuthenticated: Boolean(user),
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const role = String(
    user?.role || user?.userRole || ""
  ).toLowerCase();

  const isAdmin = [
    "admin",
    "super_admin",
    "superadmin",
  ].includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
