import React, { useContext, useState  } from "react";
import { Context } from "../js/store/appContext";
import User from "../components/User.jsx";

const AdminPage = () => {
  const { actions } = useContext(Context); // Obtenemos el store y las acciones desde Flux
  const [selectAll, setSelectAll] = useState(false); 

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    actions.selectUsers([], !selectAll); // Actualiza el estado de selección de todos los usuarios en el store
  };


  // Manejar Bloquear o Desbloquear
  const handleBlockUnblock = (isBlock) => {
    actions.blockUnblockUsers(isBlock); // Bloquea (True) o Desbloquea (False) según el parámetro
    setSelectAll(false); // Deselecciona "select all" después de la acción
  };

  // Manejar Eliminar
  const handleDelete = () => {
    actions.deleteSelectedUsers(); // Eliminar usuarios seleccionados
    setSelectAll(false); // Deselecciona "select all" después de la acción
  };


  // Función handleSearch
const handleSearch = (e) => {
  const query = e.target.value || "";
  actions.searchUser(query); // Llama a la acción de búsqueda
};

  return (
    <div className="container mt-3">
      <nav className="navbar navbar-expand-lg bg-light mb-3">
        <div className="container-fluid">
          <div className="navbar-nav d-flex flex-row flex-wrap-nowrap">
          <button className="btn btn-sm btn-outline-secondary m-1" onClick={() => handleBlockUnblock(true)}>
            Block <i className="fas fa-lock"></i>
          </button>

          <button className="btn btn-sm btn-outline-primary m-1" onClick={() => handleBlockUnblock(false)}>
          <i className="fas fa-lock-open"></i>
          </button>

          <button className="btn btn-sm btn-outline-danger m-1" onClick={handleDelete}>
          <i className="fas fa-trash"></i>
          </button>
          </div>

          <form className="d-flex ms-auto" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search users"
              aria-label="Search"
              onChange={handleSearch} // Filtrado en tiempo real
            />
          </form>
        </div>
      </nav>
     
      <User selectAll={selectAll} onSelectAllChange={toggleSelectAll}/>

    </div>
  );
};

export default AdminPage;
