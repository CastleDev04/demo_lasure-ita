// src/pages/private/Pagos.jsx
import React, { useState, useEffect } from 'react';
import {
  CreditCard, Plus, Filter, Download,
  Edit, Trash2, CheckCircle, XCircle,
  Search, Loader2, AlertCircle, ChevronLeft,
  ChevronRight, DollarSign, Calendar, Receipt,
  BarChart3, TrendingUp, Clock, User,
  Banknote, Wallet, RefreshCw, Eye
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { pagosService, reservasService } from '../../services/ServiceFactory';

// Componente Modal para formularios de Pagos
const PagoModal = ({
  isOpen,
  onClose,
  onSubmit,
  pago,
  reservas,
  loading
}) => {
  const [formData, setFormData] = useState({
    reserva_id: '',
    monto: 0,
    tipo: 'anticipo',
    metodo: 'efectivo',
    estado: 'completado',
    notas: '',
    fecha_pago: new Date().toISOString().split('T')[0]
  });

  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [balanceReserva, setBalanceReserva] = useState(null);

  // Inicializar formulario
  useEffect(() => {
    if (pago) {
      setFormData({
        reserva_id: pago.reserva_id || '',
        monto: pago.monto || 0,
        tipo: pago.tipo || 'anticipo',
        metodo: pago.metodo || 'efectivo',
        estado: pago.estado || 'completado',
        notas: pago.notas || '',
        fecha_pago: pago.fecha_pago ? pago.fecha_pago.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [pago]);

  // Cuando cambia la reserva seleccionada, cargar su balance
  useEffect(() => {
    const cargarBalanceReserva = async () => {
      if (formData.reserva_id) {
        try {
          const reserva = reservas.find(r => r.id === parseInt(formData.reserva_id));
          setReservaSeleccionada(reserva);
          
          const balance = await pagosService.getBalanceReserva(formData.reserva_id);
          setBalanceReserva(balance);
          
          // Sugerir monto del saldo pendiente si es un pago nuevo
          if (!pago && balance.saldo_pendiente > 0) {
            setFormData(prev => ({
              ...prev,
              monto: Math.min(balance.saldo_pendiente, prev.monto || balance.saldo_pendiente)
            }));
          }
        } catch (error) {
          console.error('Error cargando balance:', error);
        }
      } else {
        setReservaSeleccionada(null);
        setBalanceReserva(null);
      }
    };

    cargarBalanceReserva();
  }, [formData.reserva_id, reservas, pago]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {pago ? 'Editar Pago' : 'Registrar Pago'}
            </h2>
            <p className="text-gray-600 mt-1">
              {pago ? `Pago: ${pago.comprobante}` : 'Complete todos los campos requeridos'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Información de la reserva */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reserva *
              </label>
              <select
                name="reserva_id"
                value={formData.reserva_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                disabled={!!pago} // No permitir cambiar reserva si está editando
              >
                <option value="">Seleccionar reserva</option>
                {reservas.map(reserva => (
                  <option key={reserva.id} value={reserva.id}>
                    {reserva.codigo} - {reserva.cliente?.nombre} (${reserva.total})
                  </option>
                ))}
              </select>
            </div>

            {/* Balance de la reserva */}
            {balanceReserva && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-700">Balance de la Reserva</span>
                  {reservaSeleccionada && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reservaSeleccionada.estado === 'confirmada' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservaSeleccionada.estado}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Total Reserva</p>
                    <p className="font-bold">${balanceReserva.total_reserva.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Pagado</p>
                    <p className="font-bold text-green-600">${balanceReserva.total_pagado.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Saldo Pendiente</p>
                    <p className="font-bold text-red-600">${balanceReserva.saldo_pendiente.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">% Pagado</p>
                    <p className="font-bold">{balanceReserva.porcentaje_pagado}%</p>
                  </div>
                </div>

                {balanceReserva.saldo_pendiente > 0 && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        monto: balanceReserva.saldo_pendiente,
                        tipo: 'pago'
                      }))}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Pagar saldo completo (${balanceReserva.saldo_pendiente.toLocaleString()})
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    max={balanceReserva?.saldo_pendiente || 999999}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo permitido: ${balanceReserva?.saldo_pendiente?.toLocaleString() || '0'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="anticipo">Anticipo</option>
                  <option value="pago">Pago Parcial</option>
                  <option value="pago_completo">Pago Completo</option>
                  <option value="reembolso">Reembolso</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  name="metodo"
                  value={formData.metodo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Pago *
                </label>
                <input
                  type="date"
                  name="fecha_pago"
                  value={formData.fecha_pago}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Pago
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >
                <option value="completado">Completado</option>
                <option value="pendiente">Pendiente</option>
                <option value="fallido">Fallido</option>
                <option value="reembolsado">Reembolsado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                placeholder="Ej: Pago realizado en efectivo, número de transacción, observaciones..."
              />
            </div>

            {/* Resumen del pago */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Resumen del Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Monto:</span>
                  <span className="font-bold text-green-600">
                    ${formData.monto.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tipo:</span>
                  <span className="font-medium capitalize">{formData.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Método:</span>
                  <span className="font-medium capitalize">{formData.metodo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Fecha:</span>
                  <span className="font-medium">
                    {new Date(formData.fecha_pago).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.estado === 'completado' ? 'bg-green-100 text-green-800' :
                    formData.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {formData.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.reserva_id || formData.monto <= 0}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {pago ? 'Actualizar Pago' : 'Registrar Pago'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Modal para Pago Rápido (Anticipo o Completo)
const PagoRapidoModal = ({
  isOpen,
  onClose,
  onSubmit,
  reserva,
  loading
}) => {
  const [tipoPago, setTipoPago] = useState('anticipo');
  const [monto, setMonto] = useState(0);
  const [metodo, setMetodo] = useState('efectivo');
  const [balanceReserva, setBalanceReserva] = useState(null);

  useEffect(() => {
    const cargarBalance = async () => {
      if (reserva) {
        try {
          const balance = await pagosService.getBalanceReserva(reserva.id);
          setBalanceReserva(balance);
          setMonto(balance.saldo_pendiente);
        } catch (error) {
          console.error('Error cargando balance:', error);
        }
      }
    };

    cargarBalance();
  }, [reserva]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const pagoData = {
      reserva_id: reserva.id,
      monto: tipoPago === 'completo' ? balanceReserva?.saldo_pendiente : monto,
      tipo: tipoPago === 'completo' ? 'pago_completo' : 'anticipo',
      metodo: metodo,
      notas: tipoPago === 'completo' ? 'Pago completo realizado' : 'Anticipo registrado'
    };

    onSubmit(pagoData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pointer-events-none">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Pago Rápido
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Reserva: <span className="font-semibold">{reserva?.codigo}</span>
            <br />
            Cliente: <span className="font-semibold">{reserva?.cliente?.nombre}</span>
          </p>

          {balanceReserva && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Total:</p>
                  <p className="font-bold">${balanceReserva.total_reserva.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pagado:</p>
                  <p className="font-bold text-green-600">${balanceReserva.total_pagado.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Saldo:</p>
                  <p className="font-bold text-red-600">${balanceReserva.saldo_pendiente.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">% Pagado:</p>
                  <p className="font-bold">{balanceReserva.porcentaje_pagado}%</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoPago('anticipo')}
                    className={`flex-1 py-3 rounded-lg text-center font-medium ${
                      tipoPago === 'anticipo'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    Anticipo
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoPago('completo')}
                    className={`flex-1 py-3 rounded-lg text-center font-medium ${
                      tipoPago === 'completo'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    Pago Completo
                  </button>
                </div>
              </div>

              {tipoPago === 'anticipo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto del Anticipo
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                      min="0"
                      max={balanceReserva?.saldo_pendiente}
                      step="0.01"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo: ${balanceReserva?.saldo_pendiente?.toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              {tipoPago === 'completo' && balanceReserva && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Pago Completo</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Se registrará un pago por ${balanceReserva.saldo_pendiente.toLocaleString()} 
                    para completar el saldo pendiente.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (tipoPago === 'anticipo' && monto <= 0)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {tipoPago === 'completo' ? 'Pagar Completo' : 'Registrar Anticipo'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente Modal para confirmar eliminación
const ConfirmarEliminarModal = ({
  isOpen,
  onClose,
  onConfirm,
  pago,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            ¿Eliminar Pago?
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Esta acción eliminará permanentemente el pago 
            <span className="font-semibold text-gray-900"> {pago?.comprobante}</span> 
            por <span className="font-semibold text-gray-900">${pago?.monto?.toLocaleString()}</span>.
            Esta acción no se puede deshacer.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Advertencia</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Al eliminar este pago, el balance de la reserva se actualizará.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Sí, eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function AdminPagos() {
  const { user } = useAuthContext();
  
  // Estados principales
  const [pagos, setPagos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  
  // Estados para formularios
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPagoRapidoAbierto, setModalPagoRapidoAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [reservaParaPagoRapido, setReservaParaPagoRapido] = useState(null);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    search: '',
    estado: 'todos',
    tipo: 'todos',
    metodo: '',
    fecha_desde: '',
    fecha_hasta: ''
  });
  
  // Paginación
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    porPagina: 10,
    total: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar pagos
      const datosPagos = await pagosService.getAllPagos(filtros);
      setPagos(datosPagos);
      
      // Cargar reservas (para los selects)
      const datosReservas = await reservasService.getAllReservas({});
      setReservas(datosReservas);
      
      // Cargar estadísticas
      const stats = await pagosService.getEstadisticasPagos();
      setEstadisticas(stats);
      
      // Actualizar paginación
      setPaginacion(prev => ({
        ...prev,
        total: datosPagos.length
      }));
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en filtros
  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
  };

  // Abrir modal para crear pago
  const abrirModalCrear = () => {
    setPagoSeleccionado(null);
    setModalAbierto(true);
  };

  // Abrir modal para pago rápido
  const abrirModalPagoRapido = (reserva) => {
    setReservaParaPagoRapido(reserva);
    setModalPagoRapidoAbierto(true);
  };

  // Abrir modal para editar pago
  const abrirModalEditar = (pago) => {
    setPagoSeleccionado(pago);
    setModalAbierto(true);
  };

  // Abrir modal para eliminar pago
  const abrirModalEliminar = (pago) => {
    setPagoAEliminar(pago);
    setModalEliminarAbierto(true);
  };

  // Manejar envío del formulario (crear/editar)
  const handleSubmitPago = async (formData) => {
    try {
      setFormLoading(true);
      
      let resultado;
      
      if (pagoSeleccionado) {
        // Actualizar pago existente
        resultado = await pagosService.actualizarPago(pagoSeleccionado.id, formData);
        alert(`✅ Pago ${resultado.comprobante} actualizado exitosamente`);
      } else {
        // Crear nuevo pago
        resultado = await pagosService.crearPago(formData);
        alert(`✅ Pago ${resultado.comprobante} registrado exitosamente`);
      }
      
      // Cerrar modal y recargar datos
      setModalAbierto(false);
      await cargarDatos();
      
    } catch (err) {
      console.error('❌ Error guardando pago:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar pago rápido
  const handlePagoRapido = async (formData) => {
    try {
      setFormLoading(true);
      
      let resultado;
      
      if (formData.tipo === 'pago_completo') {
        // Registrar pago completo
        resultado = await pagosService.registrarPagoCompleto(formData.reserva_id, formData.metodo);
      } else {
        // Registrar anticipo
        resultado = await pagosService.registrarAnticipo(formData.reserva_id, formData.monto, formData.metodo);
      }
      
      alert(`✅ ${formData.tipo === 'pago_completo' ? 'Pago completo' : 'Anticipo'} registrado exitosamente`);
      
      // Cerrar modal y recargar datos
      setModalPagoRapidoAbierto(false);
      await cargarDatos();
      
    } catch (err) {
      console.error('❌ Error en pago rápido:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar eliminación de pago
  const handleEliminarPago = async () => {
    if (!pagoAEliminar) return;
    
    try {
      setFormLoading(true);
      
      await pagosService.eliminarPago(pagoAEliminar.id);
      
      alert(`✅ Pago ${pagoAEliminar.comprobante} eliminado exitosamente`);
      
      // Cerrar modal y recargar datos
      setModalEliminarAbierto(false);
      setPagoAEliminar(null);
      await cargarDatos();
      
    } catch (err) {
      console.error('❌ Error eliminando pago:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Exportar a CSV
  const handleExportar = () => {
    try {
      const csvContent = [
        ['Comprobante', 'Reserva', 'Cliente', 'Monto', 'Tipo', 'Método', 'Estado', 'Fecha Pago', 'Notas'],
        ...pagos.map(p => [
          p.comprobante,
          p.reserva?.codigo || 'N/A',
          p.reserva?.cliente?.nombre || 'N/A',
          p.monto,
          p.tipo,
          p.metodo,
          p.estado,
          new Date(p.fecha_pago).toLocaleDateString(),
          p.notas || ''
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert('✅ Archivo CSV exportado exitosamente');
    } catch (err) {
      console.error('❌ Error exportando:', err);
      alert('Error al exportar archivo');
    }
  };

  // Ver detalles del pago
  const verDetallesPago = async (pagoId) => {
    try {
      const pagoDetalle = await pagosService.getPagoById(pagoId);
      
      // Mostrar detalles en un alert o modal
      const detalles = `
📋 Comprobante: ${pagoDetalle.comprobante}
💰 Monto: $${pagoDetalle.monto}
📋 Tipo: ${pagoDetalle.tipo}
💳 Método: ${pagoDetalle.metodo}
📅 Fecha: ${new Date(pagoDetalle.fecha_pago).toLocaleString()}
🎯 Estado: ${pagoDetalle.estado}
📝 Notas: ${pagoDetalle.notas || 'Sin notas'}
👤 Reserva: ${pagoDetalle.reserva?.codigo}
👥 Cliente: ${pagoDetalle.reserva?.cliente?.nombre}
      `;
      
      alert(detalles);
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
      alert('No se pudieron cargar los detalles del pago');
    }
  };

  // Estados para filtros
  const estadosPago = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'completado', label: 'Completado' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'fallido', label: 'Fallido' },
    { value: 'reembolsado', label: 'Reembolsado' }
  ];

  const tiposPago = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'anticipo', label: 'Anticipo' },
    { value: 'pago', label: 'Pago Parcial' },
    { value: 'pago_completo', label: 'Pago Completo' },
    { value: 'reembolso', label: 'Reembolso' }
  ];

  const metodosPago = [
    { value: '', label: 'Todos los métodos' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'cheque', label: 'Cheque' }
  ];

  // Calcular pagos paginados
  const inicio = (paginacion.pagina - 1) * paginacion.porPagina;
  const fin = inicio + paginacion.porPagina;
  const pagosPagina = pagos.slice(inicio, fin);

  // Reservas con saldo pendiente para pago rápido
  const reservasConSaldo = reservas.filter(reserva => {
    const total = parseFloat(reserva.total) || 0;
    const anticipo = parseFloat(reserva.anticipo) || 0;
    return total > anticipo;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-600 mt-2">
            {estadisticas ? `${estadisticas.pagos_mes} pagos este mes` : 'Cargando...'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={loading || pagos.length === 0}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={abrirModalCrear}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 flex items-center gap-2 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            Nuevo Pago
          </button>
        </div>
      </div>

      {/* Mostrar error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button 
            onClick={cargarDatos}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold">Total Recaudado</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${estadisticas.total_recaudado.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.pagos_hoy} pagos hoy
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Pagos del Mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.pagos_mes}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Promedio: ${estadisticas.promedio_pago.toFixed(2)}
                </p>
              </div>
              <CreditCard className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold">Métodos de Pago</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Object.keys(estadisticas.por_metodo || {}).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.por_metodo?.efectivo || 0} efectivo • {estadisticas.por_metodo?.tarjeta || 0} tarjeta
                </p>
              </div>
              <Wallet className="w-10 h-10 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-semibold">Estado de Pagos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {estadisticas.por_estado?.completado || 0}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.por_estado?.pendiente || 0} pendientes
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>
      )}

      {/* Pago Rápido para Reservas con Saldo */}
      {reservasConSaldo.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pago Rápido</h3>
              <p className="text-gray-600 text-sm">
                {reservasConSaldo.length} reservas con saldo pendiente
              </p>
            </div>
            <RefreshCw className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {reservasConSaldo.slice(0, 3).map(reserva => {
              const saldoPendiente = parseFloat(reserva.total) - parseFloat(reserva.anticipo || 0);
              return (
                <div key={reserva.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{reserva.codigo}</p>
                      <p className="text-sm text-gray-600">{reserva.cliente?.nombre}</p>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      ${saldoPendiente.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => abrirModalPagoRapido(reserva)}
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Registrar Pago
                  </button>
                </div>
              );
            })}
            
            {reservasConSaldo.length > 3 && (
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <button
                  onClick={() => {
                    // Puedes mostrar todas las reservas en un modal
                    const reservasLista = reservasConSaldo.map(r => 
                      `${r.codigo} - ${r.cliente?.nombre}: $${(parseFloat(r.total) - parseFloat(r.anticipo || 0)).toLocaleString()}`
                    ).join('\n');
                    alert(`Reservas con saldo pendiente:\n\n${reservasLista}`);
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Ver {reservasConSaldo.length - 3} más...
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filtros.search}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
                placeholder="Buscar por comprobante o notas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <select 
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {estadosPago.map((estado, index) => (
                <option key={index} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por tipo */}
          <div>
            <select 
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange('tipo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {tiposPago.map((tipo, index) => (
                <option key={index} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtros de fecha y método */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <select 
              value={filtros.metodo}
              onChange={(e) => handleFiltroChange('metodo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {metodosPago.map((metodo, index) => (
                <option key={index} value={metodo.value}>
                  {metodo.label}
                </option>
              ))}
            </select>
          </div>
          
          <input
            type="date"
            value={filtros.fecha_desde}
            onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            disabled={loading}
          />
          
          <input
            type="date"
            value={filtros.fecha_hasta}
            onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            disabled={loading}
          />
        </div>
        
        <div className="mt-4">
          <button 
            onClick={() => setFiltros({
              search: '',
              estado: 'todos',
              tipo: 'todos',
              metodo: '',
              fecha_desde: '',
              fecha_hasta: ''
            })}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
            <p className="mt-4 text-gray-600">Cargando pagos...</p>
          </div>
        ) : pagos.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No hay pagos registrados</p>
            <button 
              onClick={abrirModalCrear}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Registrar primer pago
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Comprobante</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Reserva/Cliente</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Monto</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Tipo</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Método</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Fecha</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pagosPagina.map((pago) => (
                    <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono font-medium text-gray-900">{pago.comprobante}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {pago.id}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {pago.reserva?.cliente?.nombre?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {pago.reserva?.codigo || 'Sin reserva'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pago.reserva?.cliente?.nombre || 'Cliente no especificado'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">
                          ${parseFloat(pago.monto || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          pago.tipo === 'anticipo' ? 'bg-blue-100 text-blue-800' :
                          pago.tipo === 'pago_completo' ? 'bg-green-100 text-green-800' :
                          pago.tipo === 'reembolso' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pago.tipo === 'pago_completo' ? 'Pago Completo' : 
                           pago.tipo === 'anticipo' ? 'Anticipo' :
                           pago.tipo === 'reembolso' ? 'Reembolso' : 'Pago'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-gray-700">
                          {pago.metodo === 'tarjeta' && <CreditCard className="w-4 h-4" />}
                          {pago.metodo === 'efectivo' && <Banknote className="w-4 h-4" />}
                          {pago.metodo === 'transferencia' && <Receipt className="w-4 h-4" />}
                          {pago.metodo === 'cheque' && <Wallet className="w-4 h-4" />}
                          <span className="capitalize">{pago.metodo}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          pago.estado === 'completado' ? 'bg-green-100 text-green-800' :
                          pago.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          pago.estado === 'fallido' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {pago.estado === 'completado' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {pago.estado === 'pendiente' && <Clock className="w-3 h-3 mr-1" />}
                          {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {new Date(pago.fecha_pago).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(pago.fecha_pago).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => verDetallesPago(pago.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => abrirModalEditar(pago)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => abrirModalEliminar(pago)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {inicio + 1}-{Math.min(fin, paginacion.total)} de {paginacion.total} pagos
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina - 1 }))}
                  disabled={paginacion.pagina === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {paginacion.pagina}
                </span>
                <button 
                  onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina + 1 }))}
                  disabled={fin >= paginacion.total}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      <PagoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleSubmitPago}
        pago={pagoSeleccionado}
        reservas={reservas}
        loading={formLoading}
      />

      <PagoRapidoModal
        isOpen={modalPagoRapidoAbierto}
        onClose={() => setModalPagoRapidoAbierto(false)}
        onSubmit={handlePagoRapido}
        reserva={reservaParaPagoRapido}
        loading={formLoading}
      />

      <ConfirmarEliminarModal
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarPago}
        pago={pagoAEliminar}
        loading={formLoading}
      />
    </div>
  );
}