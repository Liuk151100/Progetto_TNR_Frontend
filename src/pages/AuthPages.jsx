// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axiosInstance from "../../data/axios";
// import { useNavigate } from "react-router-dom";

// export default function AuthPages() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     nome: "",
//     cognome: "",
//     email: "",
//     dataDiNascita: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const navigate = useNavigate()

//   const googleLogInPath = `${import.meta.env.VITE_BACKEND_HOST}${import.meta.env.VITE_GOOGLE_PATH}`;

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setError(null);
//     setSuccess(null);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {

//       const endpoint = isLogin ? "/auth/login" : "/auth/register";
//       const response = await axiosInstance.post(
//         endpoint,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );


//       const data = response.data

//       if (!response) {
//         throw new Error(data.message || "Errore nella richiesta");
//       }

//       if (isLogin) {
//         // Salva il token JWT (puoi anche usare localStorage o context API)
//         localStorage.setItem("token", data.jwt);
//         setSuccess("Login effettuato con successo!");
//         navigate("/")
//         window.location.reload(); // 🔄 forza il refresh completo
//       } else {
//         setSuccess("Registrazione completata! Ora puoi effettuare il login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center" style={{height:"80vh"}}>
//       <div className="card shadow p-4" style={{ width: "400px" }}>
//         <h3 className="text-center mb-3">{isLogin ? "Login" : "Registrati"}</h3>

//         {error && <div className="alert alert-danger">{error}</div>}
//         {success && <div className="alert alert-success">{success}</div>}

//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <>
//               <div className="mb-3">
//                 <label className="form-label">Nome</label>
//                 <input
//                   type="text"
//                   name="nome"
//                   className="form-control"
//                   value={formData.nome}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Cognome</label>
//                 <input
//                   type="text"
//                   name="cognome"
//                   className="form-control"
//                   value={formData.cognome}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Data di nascita</label>
//                 <input
//                   type="text"
//                   name="dataDiNascita"
//                   className="form-control"
//                   value={formData.dataDiNascita}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="form-control"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//             {loading ? "Attendere..." : isLogin ? "Login" : "Registrati"}
//           </button>
//         </form>

//         <div className="text-center mt-3">
//           <small>
//             {isLogin ? "Non hai un account?" : "Hai già un account?"} {" "}
//             <button
//               type="button"
//               className="btn btn-link p-0"
//               onClick={toggleMode}
//             >
//               {isLogin ? "Registrati" : "Login"}
//             </button>
//           </small>

//           <div className="d-flex justify-content-center m-3">
//             <a
//               variant="light"
//               className="d-flex align-items-center border shadow-sm px-3 py-2 rounded-3"
//               style={{ textDecoration: "none" }}
//               href={googleLogInPath}
//             >
//               {/* Logo Google */}
//               <img
//                 src="https://www.svgrepo.com/show/355037/google.svg"
//                 alt="Google logo"
//                 width="20"
//                 height="20"
//                 className="me-2"
//               />
//               <span className="fw-semibold text-muted">Login with Google</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../data/axios";
import { useNavigate } from "react-router-dom";

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataDiNascita: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const googleLogInPath = `${import.meta.env.VITE_BACKEND_HOST}${import.meta.env.VITE_GOOGLE_PATH}`;

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await axiosInstance.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      if (!response) {
        throw new Error(data.message || "Errore nella richiesta");
      }

      if (isLogin) {
        localStorage.setItem("token", data.jwt);
        setSuccess("Login effettuato con successo!");
        navigate("/");
        window.location.reload();
      } else {
        setSuccess("Registrazione completata! Ora puoi effettuare il login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3"
      style={{
        minHeight: "400px",
        height: "80vh",
      }}
    >
      <div
        className="card shadow w-100"
        style={{
          maxWidth: "420px",
          width: "90%",
          maxHeight: "80vh", // massimo 80% della viewport
          overflowY: "auto", // scroll solo se necessario (es. tastiera)
          padding: "1rem",
        }}
      >
        <div className="card-body d-flex flex-column justify-content-center" style={{ gap: "0.5rem" }}>
          <h3 className="text-center mb-2" style={{ fontSize: "1.5rem" }}>
            {isLogin ? "Login" : "Registrati"}
          </h3>

          {error && <div className="alert alert-danger p-1">{error}</div>}
          {success && <div className="alert alert-success p-1">{success}</div>}

          <form onSubmit={handleSubmit} className="d-flex flex-column" style={{ gap: "0.5rem" }}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="nome"
                  className="form-control form-control-sm"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="cognome"
                  className="form-control form-control-sm"
                  placeholder="Cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="dataDiNascita"
                  className="form-control form-control-sm"
                  value={formData.dataDiNascita}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              className="form-control form-control-sm"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-control form-control-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn btn-primary btn-sm w-100" disabled={loading}>
              {loading ? "Attendere..." : isLogin ? "Login" : "Registrati"}
            </button>
          </form>

          <div className="text-center mt-2">
            <small>
              {isLogin ? "Non hai un account?" : "Hai già un account?"}{" "}
              <button type="button" className="btn btn-link p-0" onClick={toggleMode}>
                {isLogin ? "Registrati" : "Login"}
              </button>
            </small>
          </div>

          <div className="d-flex justify-content-center mt-2">
            <a
              className="d-flex align-items-center border shadow-sm px-2 py-1 rounded-3 text-decoration-none"
              href={googleLogInPath}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                width="20"
                height="20"
                className="me-2"
              />
              <span className="fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
                Login with Google
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}