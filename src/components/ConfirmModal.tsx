import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { ConfirmDialogState } from '../types';

interface ConfirmModalProps {
  state: ConfirmDialogState;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ state, onClose }) => {
  if (!state.isOpen) return null;

  return (
    <div 
      id="confirm-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div 
        id="confirm-modal-box"
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-center space-y-4 transform transition-all animate-scale-in"
      >
        <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${
          state.isDestructive ? 'bg-red-950/80 text-red-400 border border-red-800/60' : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
        }`}>
          <AlertCircle className="w-8 h-8" />
        </div>

        <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif]">
          {state.title}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed">
          {state.message}
        </p>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
          <button
            id="btn-confirm-cancel"
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>{state.cancelLabel || 'BATAL'}</span>
          </button>

          <button
            id="btn-confirm-yes"
            type="button"
            onClick={() => {
              state.onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
              state.isDestructive
                ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{state.confirmLabel || 'YA, LANJUTKAN'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
