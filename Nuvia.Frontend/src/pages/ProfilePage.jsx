import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CircleCheckBig, Loader2, Mail, PencilLine, Phone, Save, ShieldCheck, X } from 'lucide-react';
import usersService from '../services/usersService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', phoneNumber: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await usersService.getMe();
        setUser(data);
        setForm({ fullName: data.fullName || '', phoneNumber: data.phoneNumber || '' });
      } catch (err) {
        setError(err?.message || 'No se pudo cargar tu perfil');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const startEdit = () => {
    setSaveError(null);
    setSaveMessage(null);
    setForm({ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setSaveError('El nombre no puede estar vacío.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      const updated = await usersService.updateMe({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
      });
      setUser(updated);
      setEditing(false);
      setSaveMessage('Perfil actualizado correctamente.');
    } catch (err) {
      setSaveError(err?.message || 'No se pudo actualizar tu perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container-xl py-5">
      <Link to="/" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <h1 className="font-heading fw-semibold lh-sm mt-3 mb-4">Mi perfil</h1>

      {loading && <p className="text-muted-nv">Cargando tu información...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && user && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="nv-card p-4">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <p className="text-uppercase-xs text-amber mb-2">Información personal</p>
                  {!editing ? (
                    <>
                      <h2 className="font-heading fs-3 fw-semibold mb-1">{user.fullName}</h2>
                      <p className="text-muted-nv mb-0">{user.email}</p>
                    </>
                  ) : (
                    <h2 className="font-heading fs-3 fw-semibold mb-1">Editar información</h2>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-pill bg-teal-subtle text-teal px-3 py-2">
                    {user.role || 'Cliente'}
                  </span>
                  {!editing && (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="btn btn-sm btn-light border-nv rounded-pill d-inline-flex align-items-center gap-1"
                    >
                      <PencilLine size={14} /> Editar
                    </button>
                  )}
                </div>
              </div>

              {saveMessage && !editing && (
                <div className="alert alert-success small mt-3 mb-0">{saveMessage}</div>
              )}

              {!editing ? (
                <div className="mt-4 d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 text-muted-nv">
                    <Mail size={18} />
                    <span>{user.email}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted-nv">
                    <Phone size={18} />
                    <span>{user.phoneNumber || 'Sin número registrado'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted-nv">
                    <ShieldCheck size={18} />
                    <span>{user.emailVerified ? 'Correo verificado' : 'Correo sin verificar'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted-nv">
                    <CircleCheckBig size={18} />
                    <span>{user.isActive ? 'Cuenta activa' : 'Cuenta inactiva'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="mt-4">
                  <div className="mb-3">
                    <label className="form-label text-uppercase-xs text-muted-nv" htmlFor="fullName">
                      Nombre completo
                    </label>
                    <input
                      id="fullName"
                      className="form-control border-nv"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-uppercase-xs text-muted-nv" htmlFor="phoneNumber">
                      Teléfono
                    </label>
                    <input
                      id="phoneNumber"
                      className="form-control border-nv"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      placeholder="Ej: 3001234567"
                      disabled={saving}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-uppercase-xs text-muted-nv">Correo electrónico</label>
                    <input className="form-control border-nv" value={user.email} disabled />
                    <small className="text-muted-nv">El correo no se puede modificar.</small>
                  </div>

                  {saveError && <div className="alert alert-danger small mb-3">{saveError}</div>}

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-teal rounded-pill px-4 d-inline-flex align-items-center gap-2"
                    >
                      {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={saving}
                      className="btn btn-light border-nv rounded-pill px-4 d-inline-flex align-items-center gap-2"
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="nv-card p-4">
              <p className="text-uppercase-xs text-amber mb-2">Acciones rápidas</p>
              <div className="d-grid gap-2">
                <Link to="/reservations" className="btn btn-light border-nv rounded-pill">Ver mis reservas</Link>
                <Link to="/payments" className="btn btn-light border-nv rounded-pill">Ver pagos</Link>
                <Link to="/favorites" className="btn btn-light border-nv rounded-pill">Ver favoritos</Link>
                <Link to="/cart" className="btn btn-teal rounded-pill">Ir al carrito</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}