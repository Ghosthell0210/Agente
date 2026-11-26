import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  LINUX_WHITELIST_RULES,
  buildAllInOneInstaller,
  buildBackupScript,
  buildConversationExamples,
  buildEnvExample,
  buildMigrationSql,
  buildModelfile,
  buildPackFiles,
  buildSoulMarkdown,
  buildStartScript,
  buildSystemPrompt,
  buildTotaConfigJson,
} from '../data/novaBlueprint';
import { LinuxCommandRule, NovaDeployConfig, SectionId } from '../types/nova';
import { CodeBlock, downloadTextFile } from './CodeBlock';

interface SectionViewProps {
  sectionId: SectionId;
  config: NovaDeployConfig;
}

export function SectionViews({ sectionId, config }: SectionViewProps) {
  switch (sectionId) {
    case '01-soul':
      return <SoulSection config={config} />;
    case '02-personalidad':
      return <PersonalitySection config={config} />;
    case '03-prompt':
      return <PromptSection config={config} />;
    case '04-memoria':
      return <MemorySection config={config} />;
    case '05-comportamiento':
      return <BehaviorSection config={config} />;
    case '06-ejemplos':
      return <ExamplesSection config={config} />;
    case '07-telegram':
      return <TelegramSection config={config} />;
    case '08-plugged-host':
      return <PluggedHostSection config={config} />;
    case '09-seguridad':
      return <SecuritySection config={config} />;
    case '10-pack-final':
      return <FinalPackSection config={config} />;
  }
}

function SoulSection({ config }: { config: NovaDeployConfig }) {
  const soulCode = useMemo(() => buildSoulMarkdown(config), [config]);
  const targetPath = `${config.containerRoot}/.tota/soul/SOUL.md`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Diseño para qwen2.5:7b</div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
            Reglas directas y sin ruido
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Los modelos locales de 7B pierden consistencia cuando el archivo de identidad supera las 1,500 palabras o usa prosa ambigua. Este SOUL.md condensa tono, memoria y herramientas en bloques claros.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Ubicación persistente</div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1 font-mono truncate">
            {targetPath}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Al ubicarse dentro del volumen de Plugged Host mediante <span className="font-mono text-xs">TOTA_HOME</span>, el alma de Nova sobrevive a reinicios y actualizaciones del contenedor.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Control de acceso</div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1 font-mono tabular-nums">
            ID {config.telegramUserId || 'Sin definir'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Reconoce exclusivamente a {config.ownerName} como usuario principal, manteniendo continuidad sobre su PS4, Android, hardware y proyectos.
          </p>
        </div>
      </div>

      <CodeBlock
        title="SOUL.md completo para tota-agent"
        targetPath={targetPath}
        language="markdown"
        code={soulCode}
        downloadFilename="SOUL.md"
        maxHeightClass="max-h-[600px]"
      />
    </div>
  );
}

function PersonalitySection({ config }: { config: NovaDeployConfig }) {
  const toneContrasts = [
    {
      situation: 'Saludo o charla casual',
      banned: '¡Hola! Soy Nova, tu asistente virtual de IA. ¿En qué puedo asistirte hoy?',
      novaWay: '¿Qué tal? ¿En qué andas metido hoy, algo de la PS4, scripts o puro chisme tech?',
    },
    {
      situation: 'Explicar un tema técnico complejo',
      banned: 'La memoria swap es una partición o archivo de intercambio en disco utilizada cuando la RAM física se satura.',
      novaWay: 'Piensa en la RAM como tu escritorio y en el SSD como el cajón. El swap es cuando ya no cabe nada en la mesa y empiezas a dejar cosas en el cajón: no se rompe nada, pero todo va más lento.',
    },
    {
      situation: 'Cuando comete un error',
      banned: 'Mis disculpas por la confusión generada anteriormente. Como modelo de lenguaje, puedo cometer imprecisiones.',
      novaWay: 'Ahí patiné yo por dar por hecho que el contenedor era MP4. Pásale el audio a AAC con este comando y te queda listo.',
    },
    {
      situation: 'Cuando falta información',
      banned: 'Para proporcionarle una respuesta óptima, por favor especifique todos los parámetros de su sistema operativo.',
      novaWay: '¿Ese tirón te pasa solo con juegos pesados o también en el menú? Así descartamos si es disco o temperatura.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Voz y registro en español
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Tuteo natural, frases cortas y ritmo conversacional de Telegram. Evita traducciones literales del inglés y reserva términos técnicos solo cuando aportan precisión real.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Calibración de humor ({config.humorTone})
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Humor ligero y cómplice sobre bugs, ventiladores de PS4 o cables infinitos, nunca chistes largos ni sarcasmo cuando {config.ownerName} esté frustrado con un fallo real.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Profundidad adaptativa
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Si preguntas algo rápido desde la calle, contesta en 3 líneas. Si estás depurando Linux, ADB o hardware, sube el nivel técnico sin rellenos introductorios.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Contraste de tono: respuesta corporativa vs. voz real de Nova
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Guía práctica de calibración incluida en el comportamiento del modelo.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F1522]">
                <th className="py-3 px-4 font-medium w-48">Escenario</th>
                <th className="py-3 px-4 font-medium">Evitar (suena a bot)</th>
                <th className="py-3 px-4 font-medium">Estilo Nova</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {toneContrasts.map((row) => (
                <tr key={row.situation} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 align-top">
                    {row.situation}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 align-top">
                    {row.banned}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 align-top">
                    {row.novaWay}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PromptSection({ config }: { config: NovaDeployConfig }) {
  const sysPrompt = useMemo(() => buildSystemPrompt(config), [config]);
  const modelfile = useMemo(() => buildModelfile(config), [config]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Ajustes clave para Ollama + {config.ollamaModel}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Temperature</div>
            <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              0.65
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Naturalidad sin alucinar tools
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Repeat Penalty</div>
            <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              1.12
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evita muletillas repetitivas
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Contexto (num_ctx)</div>
            <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {config.numCtx}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ajustado al nodo {config.nodeRamTier.toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Keep Alive</div>
            <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              15m
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Libera RAM si no hay chat
            </div>
          </div>
        </div>
      </div>

      <CodeBlock
        title="System Prompt Operativo"
        targetPath={`${config.containerRoot}/.tota/system-prompt.md`}
        language="markdown"
        code={sysPrompt}
        downloadFilename="system-prompt.md"
      />

      <CodeBlock
        title="Modelfile personalizado para Ollama (nova-qwen25)"
        targetPath={`${config.containerRoot}/.tota/Modelfile.nova`}
        language="dockerfile"
        code={modelfile}
        downloadFilename="Modelfile.nova"
      />
    </div>
  );
}

function MemorySection({ config }: { config: NovaDeployConfig }) {
  const migrationSql = useMemo(() => buildMigrationSql(config), [config]);

  const categories = [
    {
      category: 'preference',
      what: 'Formato de respuesta, editor, distribuciones Linux, tono preferido',
      trigger: 'Cuando el usuario expresa un gusto ("prefiero comandos cortos", "no uses emojis")',
      ttl: 'Permanente (se sobrescribe si cambia)',
    },
    {
      category: 'project',
      what: 'Proyectos activos (mantenimiento PS4, scripts Termux/ADB, servidor Plugged Host)',
      trigger: 'Cuando inicia, avanza o cierra una tarea multi-día',
      ttl: 'Activo hasta marcarse completado',
    },
    {
      category: 'interest',
      what: 'Temas recurrentes (IA local, hardware, Android, automatización, videojuegos)',
      trigger: 'Temas consultados más de 2 veces',
      ttl: 'Permanente con ponderación reciente',
    },
    {
      category: 'fact',
      what: 'Hardware real del usuario (modelo PS4, móvil Android, RAM del nodo)',
      trigger: 'Datos técnicos concretos que evitan preguntar lo mismo luego',
      ttl: 'Permanente editable',
    },
    {
      category: 'summary',
      what: 'Resumen breve al cerrar una sesión larga de Telegram',
      trigger: 'Cada 15 turnos o tras cambio de tema relevante',
      ttl: 'Histórico indexado por FTS5 / FULLTEXT',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Taxonomía de Memoria (SQLite Second Brain → BD de Plugged Host)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fase 1 corre 100% local en <span className="font-mono">{config.containerRoot}/.tota/memory/nova-brain.db</span> con FTS5. Fase 2 migra exactamente estas mismas entidades al motor {config.pluggedDbEngine === 'mysql' ? 'MySQL / MariaDB' : 'PostgreSQL'} de tu panel Plugged Host.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F1522]">
                <th className="py-3 px-4 font-medium">Categoría</th>
                <th className="py-3 px-4 font-medium">Qué guarda Nova</th>
                <th className="py-3 px-4 font-medium">Cuándo se actualiza</th>
                <th className="py-3 px-4 font-medium">Ciclo de vida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {categories.map((item) => (
                <tr key={item.category} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-medium align-top">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 align-top">
                    {item.what}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 align-top">
                    {item.trigger}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 align-top">
                    {item.ttl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Cómo migrar a la base de datos del panel de Plugged Host sin perder recuerdos
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
          <li>Crea la base de datos en la pestaña Databases de Plugged Host y anota host, puerto, usuario y contraseña en tu <span className="font-mono text-xs">.env</span>.</li>
          <li>Ejecuta el archivo <span className="font-mono text-xs">migrate-plugged-db.sql</span> sobre esa instancia para crear tablas e índices de búsqueda en español.</li>
          <li>Exporta tus tablas actuales desde <span className="font-mono text-xs">nova-brain.db</span> a CSV/JSON y cárgalas en <span className="font-mono text-xs">nova_memories</span> preservando <span className="font-mono text-xs">telegram_user_id</span>.</li>
        </ol>
      </div>

      <CodeBlock
        title={`Esquema SQL para Plugged Host (${config.pluggedDbEngine === 'mysql' ? 'MySQL / MariaDB' : 'PostgreSQL'})`}
        targetPath={`${config.containerRoot}/.tota/memory/migrate-plugged-db.sql`}
        language="sql"
        code={migrationSql}
        downloadFilename="migrate-plugged-db.sql"
      />
    </div>
  );
}

function BehaviorSection({ config }: { config: NovaDeployConfig }) {
  const decisionMatrix = [
    {
      tool: 'Playwright / Browser Tools',
      whenYes: 'Precios, lanzamientos de firmware PS4, versiones recientes de apps Android/GitHub, documentación cambiante o verificar un enlace enviado por Telegram.',
      whenNo: 'Conceptos estables (ej. qué es un SSD NVMe), charla casual o dudas que ya están en memoria local.',
      guardrail: `Máximo ${config.playwrightMaxPages} pestaña simultánea, bloqueo de imágenes/fuentes y timeout de 20s.`,
    },
    {
      tool: 'Lectura y análisis de archivos',
      whenYes: 'Logs enviados por el usuario, archivos JSON/YAML/Python/TS dentro de nova-workspace o notas técnicas.',
      whenNo: 'Archivos de sistema fuera del contenedor o credenciales (.env, llaves SSH).',
      guardrail: `Restringido estrictamente a ${config.containerRoot}/nova-workspace.`,
    },
    {
      tool: 'Linux Shell (Modo Seguro)',
      whenYes: 'Revisar RAM disponible antes de tareas pesadas, ver espacio libre en disco, confirmar que Ollama sigue activo.',
      whenNo: 'Reiniciar el servidor, borrar datos o modificar configuración sin haberlo consultado antes por Telegram.',
      guardrail: 'Lecturas en lista blanca automáticas; cualquier escritura exige confirmación explícita.',
    },
    {
      tool: 'Memoria Second Brain',
      whenYes: 'Al mencionar hardware propio, preferencias duraderas o avances de un proyecto.',
      whenNo: 'Errores pasajeros, contraseñas o conversación trivial sin valor futuro.',
      guardrail: 'Si hay conflicto con un dato antiguo, actualiza el registro existente (upsert).',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Matriz de Decisión Autónoma de Herramientas
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nova evalúa la intención del mensaje antes de invocar Chromium o comandos del servidor para mantener respuestas rápidas en {config.ollamaModel}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F1522]">
                <th className="py-3 px-4 font-medium w-44">Herramienta</th>
                <th className="py-3 px-4 font-medium">Cuándo usarla</th>
                <th className="py-3 px-4 font-medium">Cuándo NO usarla</th>
                <th className="py-3 px-4 font-medium">Límite técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {decisionMatrix.map((row) => (
                <tr key={row.tool} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 align-top">
                    {row.tool}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 align-top">
                    {row.whenYes}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 align-top">
                    {row.whenNo}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 align-top">
                    {row.guardrail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            1. Soluciones concretas primero
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Entrega el comando o paso accionable en las primeras líneas y deja la explicación breve debajo para no obligar a hacer scroll infinito en Telegram.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            2. Preguntas inteligentes
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Cuando falte un dato decisivo (ej. modelo de teléfono o si usa Linux/Windows), pregunta máximo 1 o 2 cosas concretas antes de inventar soluciones genéricas.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            3. Sugerencias útiles sin invadir
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Si detecta una optimización real (ej. automatizar un backup o evitar desgaste térmico), la propone en una frase corta al cierre.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExamplesSection({ config }: { config: NovaDeployConfig }) {
  const examples = useMemo(() => buildConversationExamples(config), [config]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Referencia de conversaciones reales en Telegram
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Estos 4 casos de prueba ilustran el tono exacto que debe producir <span className="font-mono text-xs">{config.ollamaModel}</span> con el SOUL.md y las reglas de memoria activas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {examples.map((scenario) => (
          <article
            key={scenario.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden flex flex-col"
          >
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F1522]">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {scenario.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{scenario.topic}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{scenario.toolsUsed.join(', ')}</span>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 bg-slate-50/40 dark:bg-[#0B0F17]">
              {scenario.turns.map((turn, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${turn.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      turn.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-[#161E2E] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>{turn.text}</div>
                    <div
                      className={`text-[11px] font-mono tabular-nums mt-1.5 text-right ${
                        turn.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {turn.sender === 'user' ? config.ownerName : 'Nova'} · {turn.time}
                    </div>
                  </div>
                  {turn.internalNote && (
                    <div className="mt-1.5 px-1 text-xs text-slate-500 dark:text-slate-400">
                      {turn.internalNote}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827]">
              Efecto en memoria: {scenario.memoryEffect}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TelegramSection({ config }: { config: NovaDeployConfig }) {
  const totaConfig = useMemo(() => buildTotaConfigJson(config), [config]);

  const checklist = [
    {
      step: '1. Crear el bot en @BotFather',
      detail: 'Usa /newbot, guarda el token únicamente en .env y ejecuta /setprivacy en Disabled si algún día lo usas en un grupo privado tuyo (en chat 1-a-1 da igual).',
    },
    {
      step: '2. Obtener tu User ID numérico',
      detail: `Escribe a @userinfobot o @RawDataBot en Telegram para confirmar tu ID numérico exacto y reemplazar "${config.telegramUserId}" en tota.config.json y .env.`,
    },
    {
      step: '3. Bloqueo estricto de desconocidos',
      detail: 'Con rejectUnauthorizedUsers: true, cualquier persona en Telegram que encuentre tu @bot recibirá silencio o rechazo inmediato sin gastar ciclos de Ollama ni acceder a Playwright.',
    },
    {
      step: '4. Higiene de mensajes largos y escritura',
      detail: 'sendTypingAction: true muestra "escribiendo..." mientras qwen2.5:7b genera o navega con Playwright, y splitLongReplies divide respuestas >3800 caracteres para evitar errores 400 de la API de Telegram.',
    },
  ];

  const cliSnippet = `# Vincular Telegram manualmente con tota-agent usando TOTA_HOME persistente
export HOME="${config.containerRoot}"
export TOTA_HOME="${config.containerRoot}/.tota"

tota setup telegram
# Pega el token de @BotFather cuando el asistente lo solicite
# Verifica que ~/.tota/tota.config.json mantenga allowedUserIds: [${config.telegramUserId}]`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklist.map((item) => (
          <div
            key={item.step}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {item.step}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      <CodeBlock
        title="Comando de vinculación en tota-agent"
        language="bash"
        code={cliSnippet}
      />

      <CodeBlock
        title="tota.config.json completo (Telegram + Ollama + Playwright + Linux Safe)"
        targetPath={`${config.containerRoot}/.tota/tota.config.json`}
        language="json"
        code={totaConfig}
        downloadFilename="tota.config.json"
      />
    </div>
  );
}

function PluggedHostSection({ config }: { config: NovaDeployConfig }) {
  const startScript = useMemo(() => buildStartScript(config), [config]);
  const backupScript = useMemo(() => buildBackupScript(config), [config]);

  const folderStructure = `${config.containerRoot}/
├── .env                         # Secretos (chmod 600): TELEGRAM_BOT_TOKEN, PLUGGED_DB_*
├── start-nova.sh                # Supervisor 24/7: levanta ollama serve + tota up en bucle
├── backup-nova.sh               # Hot-copy SQLite + SOUL.md con rotación de 14 copias
├── nova-workspace/              # Única carpeta donde Nova puede leer/escribir archivos
│   ├── notas/                   # Resúmenes y apuntes útiles
│   ├── docs/                    # PDFs, textos o logs que envíes para analizar
│   └── scripts/                 # Automatizaciones aprobadas por ti
├── ollama/
│   └── models/                  # Pesos de ${config.ollamaModel} (~4.7 GB) en disco persistente
├── pw-browsers/                 # Binario Chromium headless de Playwright (~420 MB)
└── .tota/                       # TOTA_HOME fijado explícitamente
    ├── Modelfile.nova           # Perfil calibrado de ${config.ollamaModel}
    ├── tota.config.json         # Configuración central del agente
    ├── soul/
    │   └── SOUL.md              # Personalidad y reglas operativas de Nova
    ├── memory/
    │   ├── nova-brain.db        # Second Brain SQLite + índice FTS5
    │   └── migrate-plugged-db.sql
    ├── logs/                    # Logs rotados (< 20 MB cada uno)
    └── backups/                 # Archivos tar.gz locales`;

  const ramBudgetRows = [
    {
      component: `Ollama (${config.ollamaModel} Q4_K_M)`,
      idleRam: '4.7 GB',
      peakRam: config.nodeRamTier === '8gb' ? '5.4 GB' : config.nodeRamTier === '12gb' ? '6.1 GB' : '7.0 GB',
      notes: `Con num_ctx=${config.numCtx}, OLLAMA_NUM_PARALLEL=1 y OLLAMA_KEEP_ALIVE=15m`,
    },
    {
      component: 'Playwright Chromium (headless)',
      idleRam: '0 MB',
      peakRam: '450 - 750 MB',
      notes: 'Solo arranca bajo demanda con --no-sandbox, --disable-dev-shm-usage y max 1 pestaña',
    },
    {
      component: 'tota-agent + Node.js + SQLite FTS5',
      idleRam: '140 MB',
      peakRam: '260 MB',
      notes: 'Escucha Telegram 24/7 con impacto mínimo de memoria',
    },
    {
      component: 'Total estimado en contenedor',
      idleRam: '~4.85 GB',
      peakRam: config.nodeRamTier === '8gb' ? '~6.4 GB' : config.nodeRamTier === '12gb' ? '~7.1 GB' : '~8.0 GB',
      notes:
        config.nodeRamTier === '8gb'
          ? 'Margen ajustado en nodo 8 GB: mantén num_ctx en 4096 y no abras más de 1 tab.'
          : 'Margen saludable para evitar OOM Kill del contenedor en Plugged Host.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Despliegue directo desde GitHub a Plugged Host
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
          <li>Crea un repositorio privado en GitHub con los archivos de la sección 10 (<span className="font-mono text-xs">SOUL.md</span>, <span className="font-mono text-xs">tota.config.json</span>, <span className="font-mono text-xs">Modelfile.nova</span>, <span className="font-mono text-xs">start-nova.sh</span>, <span className="font-mono text-xs">package.json</span> y <span className="font-mono text-xs">.gitignore</span>).</li>
          <li>Conecta ese repositorio en el panel de Plugged Host (Git Auto-Update) o clónalo dentro de <span className="font-mono text-xs">{config.containerRoot}</span>.</li>
          <li>Sube o crea manualmente <span className="font-mono text-xs">{config.containerRoot}/.env</span> con tu <span className="font-mono text-xs">TELEGRAM_BOT_TOKEN</span> real (nunca lo subas a GitHub).</li>
          <li>Configura el Startup Command del servidor en Plugged Host a <span className="font-mono text-xs">bash start-nova.sh</span> (o <span className="font-mono text-xs">npm start</span>): en cada reinicio sincronizará tu <span className="font-mono text-xs">SOUL.md</span> sin tocar tu memoria SQLite.</li>
        </ol>
      </div>

      <CodeBlock
        title="Organización recomendada de carpetas en Plugged Host"
        targetPath={config.containerRoot}
        language="text"
        code={folderStructure}
      />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Presupuesto de RAM y Optimización de Recursos ({config.nodeRamTier.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Plugged Host ejecuta en contenedor aislado sin systemd de root; controlar el pico de RAM entre Ollama y Chromium evita que el panel mate el proceso por OOM.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F1522]">
                <th className="py-3 px-4 font-medium">Componente</th>
                <th className="py-3 px-4 font-medium text-right">En reposo</th>
                <th className="py-3 px-4 font-medium text-right">Pico activo</th>
                <th className="py-3 px-4 font-medium">Ajuste recomendado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {ramBudgetRows.map((row) => (
                <tr key={row.component} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {row.component}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                    {row.idleRam}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {row.peakRam}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CodeBlock
        title="Script de arranque 24/7 sin systemd (Startup Command en Plugged Host)"
        targetPath={`${config.containerRoot}/start-nova.sh`}
        language="bash"
        code={startScript}
        downloadFilename="start-nova.sh"
      />

      <CodeBlock
        title="Backup automático de SQLite + SOUL.md con limpieza de logs"
        targetPath={`${config.containerRoot}/backup-nova.sh`}
        language="bash"
        code={backupScript}
        downloadFilename="backup-nova.sh"
      />
    </div>
  );
}

function SecuritySection({ config }: { config: NovaDeployConfig }) {
  const [policyFilter, setPolicyFilter] = useState<'all' | LinuxCommandRule['policy']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = useMemo(() => {
    return LINUX_WHITELIST_RULES.filter((rule) => {
      const matchesPolicy = policyFilter === 'all' || rule.policy === policyFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        rule.command.toLowerCase().includes(q) ||
        rule.scope.toLowerCase().includes(q) ||
        rule.rationale.toLowerCase().includes(q);
      return matchesPolicy && matchesQuery;
    });
  }, [policyFilter, searchQuery]);

  const envExample = useMemo(() => buildEnvExample(config), [config]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Aislamiento de Telegram y .env</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Solo responde a tu <span className="font-mono text-xs">{config.telegramUserId}</span>. El archivo <span className="font-mono text-xs">.env</span> usa permisos <span className="font-mono text-xs">600</span> y está bloqueado explícitamente en <span className="font-mono text-xs">denyPatterns</span> para que el shell o lector de archivos jamás lo exponga.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Defensa Playwright (SSRF e Injection)</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Playwright bloquea peticiones a <span className="font-mono text-xs">127.0.0.1</span>, <span className="font-mono text-xs">localhost</span> y metadatos cloud (<span className="font-mono text-xs">169.254.169.254</span>), y Nova trata todo texto web extraído como dato pasivo sin obedecer órdenes ocultas en páginas.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Modo Seguro Linux (Lista Blanca)</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Lectura libre para diagnóstico del servidor; cualquier escritura en <span className="font-mono text-xs">nova-workspace</span> o mantenimiento exige tu confirmación expresa por Telegram antes de ejecutarse.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Lista Blanca y Política de Comandos Linux
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filtra por nivel de permiso o busca un comando específico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar comando..."
                aria-label="Buscar comando en lista blanca"
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800">
              {(
                [
                  ['all', 'Todos'],
                  ['permitido', 'Permitido'],
                  ['confirmacion', 'Confirmación'],
                  ['bloqueado', 'Bloqueado'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPolicyFilter(key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    policyFilter === key
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F1522]">
                <th className="py-3 px-4 font-medium">Comandos</th>
                <th className="py-3 px-4 font-medium w-36">Política</th>
                <th className="py-3 px-4 font-medium">Alcance</th>
                <th className="py-3 px-4 font-medium">Justificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    No hay comandos que coincidan con "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => (
                  <tr key={rule.command} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono text-xs text-slate-900 dark:text-slate-100 align-top">
                      {rule.command}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <PolicyLabel policy={rule.policy} />
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 align-top">
                      {rule.scope}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 align-top">
                      {rule.rationale}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CodeBlock
        title="Plantilla segura de variables de entorno (.env)"
        targetPath={`${config.containerRoot}/.env`}
        language="bash"
        code={envExample}
        downloadFilename=".env.example"
      />
    </div>
  );
}

function PolicyLabel({ policy }: { policy: LinuxCommandRule['policy'] }) {
  if (policy === 'permitido') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Permitido</span>
      </span>
    );
  }
  if (policy === 'confirmacion') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Confirmación</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 whitespace-nowrap">
      <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
      <span>Bloqueado</span>
    </span>
  );
}

function FinalPackSection({ config }: { config: NovaDeployConfig }) {
  const files = useMemo(() => buildPackFiles(config), [config]);
  const [selectedId, setSelectedId] = useState<string>('installer');

  const activeFile = files.find((f) => f.id === selectedId) ?? files[0];
  const installerScript = useMemo(() => buildAllInOneInstaller(config), [config]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Versión final lista para copiar o desplegar en tota-agent
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Puedes copiar cada archivo individualmente o descargar <span className="font-mono text-xs">install-nova-plugged.sh</span> para crear toda la estructura dentro de <span className="font-mono text-xs">{config.containerRoot}</span> en un solo paso.
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadTextFile('install-nova-plugged.sh', installerScript)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Descargar instalador completo (.sh)</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {files.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => setSelectedId(file.id)}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFile.id === file.id
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {file.filename}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 px-1">
        {activeFile.summary}
      </div>

      <CodeBlock
        title={activeFile.filename}
        targetPath={activeFile.targetPath}
        language={activeFile.language}
        code={activeFile.content}
        downloadFilename={activeFile.filename}
        maxHeightClass="max-h-[620px]"
      />
    </div>
  );
}
