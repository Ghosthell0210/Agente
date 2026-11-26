import { RotateCcw } from 'lucide-react';
import { DEFAULT_CONFIG } from '../data/novaBlueprint';
import { HumorTone, NodeRamTier, NovaDeployConfig, PluggedDbEngine } from '../types/nova';

interface ConfigPanelProps {
  config: NovaDeployConfig;
  onChange: (next: NovaDeployConfig) => void;
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const update = <K extends keyof NovaDeployConfig>(key: K, value: NovaDeployConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const ramPresetChange = (tier: NodeRamTier) => {
    const recommendedCtx = tier === '8gb' ? 4096 : tier === '12gb' ? 8192 : 16384;
    onChange({ ...config, nodeRamTier: tier, numCtx: recommendedCtx });
  };

  return (
    <section
      aria-label="Parámetros de despliegue"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Parámetros de tu despliegue en Plugged Host
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ajusta estos valores y todos los archivos (SOUL.md, tota.config.json, scripts y SQL) se actualizan al instante.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_CONFIG)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Restablecer valores</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Tu nombre o apodo
          </span>
          <input
            type="text"
            value={config.ownerName}
            onChange={(e) => update('ownerName', e.target.value)}
            placeholder="Cristian"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Telegram User ID autorizado
          </span>
          <input
            type="text"
            value={config.telegramUserId}
            onChange={(e) => update('telegramUserId', e.target.value.replace(/[^\d]/g, ''))}
            placeholder="123456789"
            className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Ruta raíz en Plugged Host
          </span>
          <input
            type="text"
            value={config.containerRoot}
            onChange={(e) => update('containerRoot', e.target.value)}
            placeholder="/home/container"
            className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Modelo Ollama base
          </span>
          <input
            type="text"
            value={config.ollamaModel}
            onChange={(e) => update('ollamaModel', e.target.value)}
            placeholder="qwen2.5:7b"
            className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            RAM del nodo Plugged Host
          </span>
          <select
            value={config.nodeRamTier}
            onChange={(e) => ramPresetChange(e.target.value as NodeRamTier)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="8gb">8 GB RAM (num_ctx 4096)</option>
            <option value="12gb">12 GB RAM (num_ctx 8192)</option>
            <option value="16gb">16 GB RAM (num_ctx 16384)</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Ventana contexto (num_ctx)
          </span>
          <select
            value={config.numCtx}
            onChange={(e) => update('numCtx', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={4096}>4096 tokens</option>
            <option value={8192}>8192 tokens</option>
            <option value={16384}>16384 tokens</option>
            <option value={32768}>32768 tokens</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            BD futura de Plugged Host
          </span>
          <select
            value={config.pluggedDbEngine}
            onChange={(e) => update('pluggedDbEngine', e.target.value as PluggedDbEngine)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mysql">MySQL / MariaDB (puerto 3306)</option>
            <option value="postgresql">PostgreSQL (puerto 5432)</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Matiz de humor de Nova
          </span>
          <select
            value={config.humorTone}
            onChange={(e) => update('humorTone', e.target.value as HumorTone)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cercano">Cercano y natural</option>
            <option value="sutil">Sutil y seco</option>
            <option value="ingenioso">Ingenioso con chispa</option>
          </select>
        </label>
      </div>
    </section>
  );
}
