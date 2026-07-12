import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, Compass, CreditCard, PencilLine, Plane, Plus, ShieldCheck, Trash2, CircleCheckBig, Clock3 } from 'lucide-react';
import flightsService from '../services/flightsService';
import hotelsService from '../services/hotelsService';
import toursService from '../services/toursService';
import packagesService from '../services/packagesService';
import bookingsService from '../services/bookingsService';
import paymentsService from '../services/paymentsService';
import usersService from '../services/usersService';

const catalogTabs = [
  { key: 'flights', label: 'Vuelos' },
  { key: 'hotels', label: 'Hoteles' },
  { key: 'tours', label: 'Tours' },
  { key: 'packages', label: 'Paquetes' },
];

const emptyForms = {
  flights: {
    airline: '', flightCode: '', origin: '', destination: '', departureTime: '', arrivalTime: '', price: '', availableSeats: '', isActive: true,
  },
  hotels: {
    name: '', city: '', country: '', address: '', stars: '', pricePerNight: '', isActive: true,
  },
  tours: {
    name: '', city: '', country: '', description: '', durationHours: '', pricePerPerson: '', availableSlots: '', isActive: true, rates: [],
  },
  packages: {
    title: '', destination: '', description: '', nights: '', totalPrice: '', isActive: true,
  },
};

function getInitialForm(type) {
  return { ...emptyForms[type] };
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('flights');
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [userEdits, setUserEdits] = useState({});
  const [savingUserId, setSavingUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(getInitialForm('flights'));
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadCatalog = async (tab = activeTab) => {
    setLoading(true);
    try {
      const data = tab === 'flights'
        ? await flightsService.getAll()
        : tab === 'hotels'
          ? await hotelsService.getAll()
          : tab === 'tours'
            ? await toursService.getAll()
            : await packagesService.getAll();
      setItems(data || []);
    } catch (error) {
      setFeedback(error?.message || 'No se pudieron cargar los registros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingData, paymentData, userData] = await Promise.all([
          bookingsService.getAll(),
          paymentsService.getAll(),
          usersService.getAll(),
        ]);
        setBookings(bookingData || []);
        setPayments(paymentData || []);
        setUsers(userData || []);
      } catch (error) {
        setFeedback(error?.message || 'No se pudieron cargar reservas y pagos.');
      }
    };

    loadData();
    loadCatalog('flights');
  }, []);

  useEffect(() => {
    setUserEdits((prev) => {
      const next = {};
      users.forEach((user) => {
        const existing = prev[user.id] || {};
        next[user.id] = {
          role: existing.role ?? user.role ?? '3',
          isActive: existing.isActive ?? user.isActive ?? true,
        };
      });
      return next;
    });
  }, [users]);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setEditingId(null);
    setForm(getInitialForm(tab));
    await loadCatalog(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        availableSeats: Number(form.availableSeats),
        stars: Number(form.stars),
        pricePerNight: Number(form.pricePerNight),
        durationHours: Number(form.durationHours),
        // pricePerPerson kept for backward compatibility, primary pricing comes from `rates`
        pricePerPerson: Number(form.pricePerPerson || 0),
        rates: (form.rates || []).map(r => ({ minPeople: Number(r.minPeople), maxPeople: Number(r.maxPeople), totalPrice: Number(r.totalPrice) })),
        availableSlots: Number(form.availableSlots),
        nights: Number(form.nights),
        totalPrice: Number(form.totalPrice),
        isActive: Boolean(form.isActive),
      };

      if (editingId) {
        if (activeTab === 'flights') await flightsService.update(editingId, payload);
        if (activeTab === 'hotels') await hotelsService.update(editingId, payload);
        if (activeTab === 'tours') await toursService.update(editingId, payload);
        if (activeTab === 'packages') await packagesService.update(editingId, payload);
        setFeedback('Registro actualizado correctamente.');
      } else {
        if (activeTab === 'flights') await flightsService.create(payload);
        if (activeTab === 'hotels') await hotelsService.create(payload);
        if (activeTab === 'tours') await toursService.create(payload);
        if (activeTab === 'packages') await packagesService.create(payload);
        setFeedback('Registro creado correctamente.');
      }

      await handleTabChange(activeTab);
      setForm(getInitialForm(activeTab));
      setEditingId(null);
    } catch (error) {
      setFeedback(error?.message || 'No se pudo guardar el registro.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const nextForm = {
      ...item,
      departureTime: item.departureTime?.slice(0, 16) || '',
      arrivalTime: item.arrivalTime?.slice(0, 16) || '',
      price: item.price ?? item.pricePerNight ?? item.pricePerPerson ?? item.totalPrice ?? '',
      availableSeats: item.availableSeats ?? '',
      pricePerNight: item.pricePerNight ?? '',
      pricePerPerson: item.pricePerPerson ?? '',
      rates: item.rates ?? [],
      totalPrice: item.totalPrice ?? '',
      nights: item.nights ?? '',
      stars: item.stars ?? '',
      durationHours: item.durationHours ?? '',
      availableSlots: item.availableSlots ?? '',
    };
    setForm(nextForm);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este registro?')) return;
    try {
      if (activeTab === 'flights') await flightsService.delete(id);
      if (activeTab === 'hotels') await hotelsService.delete(id);
      if (activeTab === 'tours') await toursService.delete(id);
      if (activeTab === 'packages') await packagesService.delete(id);
      await handleTabChange(activeTab);
      setFeedback('Registro eliminado.');
    } catch (error) {
      setFeedback(error?.message || 'No se pudo eliminar el registro.');
    }
  };

  const handleUserUpdate = async (user) => {
    const draft = userEdits[user.id] || {};
    setSavingUserId(user.id);
    try {
      await usersService.update(user.id, {
        ...user,
        role: Number(draft.role ?? user.role ?? 3),
        isActive: Boolean(draft.isActive ?? user.isActive ?? true),
      });
      const refreshed = await usersService.getAll();
      setUsers(refreshed || []);
      setFeedback('Usuario actualizado correctamente.');
    } catch (error) {
      setFeedback(error?.message || 'No se pudo actualizar el usuario.');
    } finally {
      setSavingUserId(null);
    }
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'flights':
        return (
          <div className="row g-3">
            <div className="col-12 col-md-6"><label className="form-label">Aerolinea</label><input className="form-control" value={form.airline || ''} onChange={(e) => setForm({ ...form, airline: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Código</label><input className="form-control" value={form.flightCode || ''} onChange={(e) => setForm({ ...form, flightCode: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Origen</label><input className="form-control" value={form.origin || ''} onChange={(e) => setForm({ ...form, origin: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Destino</label><input className="form-control" value={form.destination || ''} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Salida</label><input type="datetime-local" className="form-control" value={form.departureTime || ''} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Llegada</label><input type="datetime-local" className="form-control" value={form.arrivalTime || ''} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Precio</label><input type="number" className="form-control" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Asientos</label><input type="number" className="form-control" value={form.availableSeats || ''} onChange={(e) => setForm({ ...form, availableSeats: e.target.value })} /></div>
          </div>
        );
      case 'hotels':
        return (
          <div className="row g-3">
            <div className="col-12 col-md-6"><label className="form-label">Nombre</label><input className="form-control" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Ciudad</label><input className="form-control" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">País</label><input className="form-control" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Dirección</label><input className="form-control" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Estrellas</label><input type="number" className="form-control" value={form.stars || ''} onChange={(e) => setForm({ ...form, stars: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Precio por noche</label><input type="number" className="form-control" value={form.pricePerNight || ''} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} /></div>
          </div>
        );
      case 'tours':
        return (
          <div className="row g-3">
            <div className="col-12 col-md-6"><label className="form-label">Nombre</label><input className="form-control" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Ciudad</label><input className="form-control" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">País</label><input className="form-control" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Duración (horas)</label><input type="number" className="form-control" value={form.durationHours || ''} onChange={(e) => setForm({ ...form, durationHours: e.target.value })} /></div>
            <div className="col-12"><label className="form-label">Descripción</label><textarea className="form-control" rows="3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="col-12">
              <label className="form-label">Tarifas por cantidad de personas</label>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Min Personas</th>
                      <th>Max Personas</th>
                      <th>Precio total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.rates || []).map((r, idx) => (
                      <tr key={idx}>
                        <td><input type="number" className="form-control" value={r.minPeople} onChange={(e) => {
                          const next = [...(form.rates || [])]; next[idx] = { ...next[idx], minPeople: e.target.value }; setForm({ ...form, rates: next });
                        }} /></td>
                        <td><input type="number" className="form-control" value={r.maxPeople} onChange={(e) => {
                          const next = [...(form.rates || [])]; next[idx] = { ...next[idx], maxPeople: e.target.value }; setForm({ ...form, rates: next });
                        }} /></td>
                        <td><input type="number" className="form-control" value={r.totalPrice} onChange={(e) => {
                          const next = [...(form.rates || [])]; next[idx] = { ...next[idx], totalPrice: e.target.value }; setForm({ ...form, rates: next });
                        }} /></td>
                        <td><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => { const next = [...(form.rates || [])]; next.splice(idx, 1); setForm({ ...form, rates: next }); }}>Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-sm btn-teal mt-2" onClick={() => { const next = [...(form.rates || [])]; next.push({ minPeople: 1, maxPeople: 1, totalPrice: 0 }); setForm({ ...form, rates: next }); }}>Agregar tarifa</button>
            </div>
            <div className="col-12 col-md-6"><label className="form-label">Cupos</label><input type="number" className="form-control" value={form.availableSlots || ''} onChange={(e) => setForm({ ...form, availableSlots: e.target.value })} /></div>
          </div>
        );
      case 'packages':
        return (
          <div className="row g-3">
            <div className="col-12 col-md-6"><label className="form-label">Título</label><input className="form-control" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Destino</label><input className="form-control" value={form.destination || ''} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
            <div className="col-12"><label className="form-label">Descripción</label><textarea className="form-control" rows="3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Noches</label><input type="number" className="form-control" value={form.nights || ''} onChange={(e) => setForm({ ...form, nights: e.target.value })} /></div>
            <div className="col-12 col-md-6"><label className="form-label">Precio total</label><input type="number" className="form-control" value={form.totalPrice || ''} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} /></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container-xl pb-5" style={{ paddingTop: '7rem' }}>
      <Link to="/" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <div className="nv-card p-4 p-md-5 mt-4">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
          <div>
            <p className="text-uppercase-xs text-amber mb-2">Panel de administración</p>
            <h1 className="font-heading fw-semibold lh-sm mb-0" style={{ fontSize: 'clamp(2rem, 4vw, 2.7rem)' }}>
              Control central del catálogo y reservas
            </h1>
          </div>
          <div className="d-inline-flex align-items-center gap-2 rounded-pill border border-nv px-3 py-2 text-muted-nv">
            <BriefcaseBusiness size={16} />
            <span>Modo operación</span>
          </div>
        </div>

        <div className="row g-4 mt-3">
          <div className="col-12 col-lg-4">
            <div className="p-4 rounded-4xl border border-nv h-100" style={{ backgroundColor: 'var(--nv-cream)' }}>
              <div className="d-flex align-items-center gap-2 text-teal fw-semibold mb-3">
                <Compass size={18} />
                <span>Gestión de catálogo</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {catalogTabs.map((tab) => (
                  <button key={tab.key} type="button" onClick={() => handleTabChange(tab.key)} className={`btn btn-sm rounded-pill ${activeTab === tab.key ? 'btn-teal' : 'btn-light border-nv'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-4">
                {renderFormFields()}
                <div className="form-check form-switch mt-3">
                  <input className="form-check-input" type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="activeSwitch" />
                  <label className="form-check-label" htmlFor="activeSwitch">Activo</label>
                </div>
                <button type="submit" disabled={saving} className="btn btn-teal rounded-pill px-4 mt-3">
                  {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                </button>
                {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(getInitialForm(activeTab)); }} className="btn btn-light border-nv rounded-pill px-4 mt-3 ms-2">Cancelar</button> : null}
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="p-4 rounded-4xl border border-nv">
              <div className="d-flex align-items-center gap-2 text-teal fw-semibold mb-3">
                <Plane size={18} />
                <span>{catalogTabs.find((tab) => tab.key === activeTab)?.label}</span>
              </div>
              {loading ? <p className="text-muted-nv">Cargando registros...</p> : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Detalle</th>
                        <th>Estado</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name || item.title || item.airline || item.flightCode || item.city || item.destination}</td>
                          <td className="small text-muted-nv">{item.destination || item.city || item.origin || item.country || item.flightCode || item.description || ''}</td>
                          <td>{item.isActive ? 'Activo' : 'Inactivo'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button type="button" onClick={() => handleEdit(item)} className="btn btn-sm btn-light border-nv"><PencilLine size={14} /></button>
                              <button type="button" onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 rounded-4xl border border-nv mt-4">
              <div className="d-flex align-items-center gap-2 text-teal fw-semibold mb-3">
                <CreditCard size={18} />
                <span>Reservas y pagos</span>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <h3 className="font-heading fs-5 fw-semibold">Reservas recientes</h3>
                  <ul className="list-unstyled mb-0">
                    {bookings.slice(0, 6).map((booking) => (
                      <li key={booking.id} className="border-bottom py-2 small text-muted-nv d-flex justify-content-between align-items-center gap-3">
                        <span>{booking.bookingCode || `Reserva #${booking.id}`}</span>
                        <span className="d-inline-flex align-items-center gap-1">
                          {booking.status === 2 || booking.status === 'Confirmed' ? <CircleCheckBig size={14} className="text-success" /> : <Clock3 size={14} className="text-warning" />}
                          {booking.status || 'Pendiente'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-12 col-md-6">
                  <h3 className="font-heading fs-5 fw-semibold">Pagos recientes</h3>
                  <ul className="list-unstyled mb-0">
                    {payments.slice(0, 6).map((payment) => (
                      <li key={payment.id} className="border-bottom py-2 small text-muted-nv d-flex justify-content-between align-items-center gap-3">
                        <span>{payment.stripePaymentIntentId || payment.id}</span>
                        <span>{payment.status || 'Pendiente'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-4xl border border-nv mt-4">
              <div className="d-flex align-items-center gap-2 text-teal fw-semibold mb-3">
                <ShieldCheck size={18} />
                <span>Gestión de usuarios</span>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Rol</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 8).map((user) => {
                      const draft = userEdits[user.id] || { role: user.role ?? '3', isActive: user.isActive ?? true };
                      return (
                        <tr key={user.id}>
                          <td>
                            <div className="fw-semibold">{user.fullName || user.email}</div>
                            <div className="small text-muted-nv">{user.email}</div>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={String(draft.role ?? '3')}
                              onChange={(event) => setUserEdits((prev) => ({
                                ...prev,
                                [user.id]: { ...prev[user.id], role: event.target.value },
                              }))}
                            >
                              <option value="1">Admin</option>
                              <option value="2">Agent</option>
                              <option value="3">Customer</option>
                            </select>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={Boolean(draft.isActive ?? true)}
                                  onChange={(event) => setUserEdits((prev) => ({
                                    ...prev,
                                    [user.id]: { ...prev[user.id], isActive: event.target.checked },
                                  }))}
                                />
                              </div>
                              <button type="button" className="btn btn-sm btn-teal" onClick={() => handleUserUpdate(user)} disabled={savingUserId === user.id}>
                                {savingUserId === user.id ? 'Guardando...' : 'Guardar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
