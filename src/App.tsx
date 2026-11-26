import {
  ChevronLeft,
  ChevronRight,
  Download,
  Menu,
  Moon,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { downloadTextFile } from './components/CodeBlock';
import { ConfigPanel } from './components/ConfigPanel';
import { SectionViews } from './components/SectionViews';
import {
  DEFAULT_CONFIG,
  SECTION_NAV,
  buildInteractiveSetupScript,
} from './data/novaBlueprint';
import { NovaDeployConfig, SectionId } from './types/nova';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('00-guia-consola');
  const [config, setConfig] = useState<NovaDeployConfig>(DEFAULT_CONFIG);
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const currentIndex = SECTION_NAV.findIndex((s) => s.id === activeSection);
  const currentMeta = SECTION_NAV[currentIndex] ?? SECTION_NAV[0];
  const prevSection = currentIndex > 0 ? SECTION_NAV[currentIndex - 1] : null;
  const nextSection =
    currentIndex < SECTION_NAV.length - 1 ? SECTION_NAV[currentIndex + 1] : null;

  const setupWizardScript = useMemo(() => buildInteractiveSetupScript(config), [config]);

  const selectSection = (id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100">
        {/* Top Bar Contract: strictly 3 zones separated by gap-8 */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
                className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  selectSection('00-guia-consola');
                }}
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
              >
                Nova Blueprint
              </a>
            </div>

            <nav
              aria-label="Navegación rápida"
              className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              <button
                type="button"
                onClick={() => selectSection('00-guia-consola')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSection === '00-guia-consola' ? 'text-slate-900 dark:text-slate-100 underline underline-offset-4' : ''
                }`}
              >
                Guía Consola
              </button>
              <button
                type="button"
                onClick={() => selectSection('01-soul')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSection === '01-soul' ? 'text-slate-900 dark:text-slate-100 underline underline-offset-4' : ''
                }`}
              >
                Soul
              </button>
              <button
                type="button"
                onClick={() => selectSection('04-memoria')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSection === '04-memoria' ? 'text-slate-900 dark:text-slate-100 underline underline-offset-4' : ''
                }`}
              >
                Memoria
              </button>
              <button
                type="button"
                onClick={() => selectSection('08-plugged-host')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSection === '08-plugged-host' ? 'text-slate-900 dark:text-slate-100 underline underline-offset-4' : ''
                }`}
              >
                Plugged Host
              </button>
              <button
                type="button"
                onClick={() => selectSection('10-pack-final')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSection === '10-pack-final' ? 'text-slate-900 dark:text-slate-100 underline underline-offset-4' : ''
                }`}
              >
                Pack Final
              </button>
            </nav>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => downloadTextFile('setup-nova.sh', setupWizardScript)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Descargar setup-nova.sh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace Container */}
        <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
          {/* Desktop Sidebar (260px) */}
          <aside className="hidden lg:block w-[260px] shrink-0 border-r border-slate-200 dark:border-slate-800 px-4 py-6">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 mb-3">
              Arquitectura en 10 entregas
            </div>
            <nav aria-label="Entregables de Nova" className="space-y-1">
              {SECTION_NAV.map((item) => {
                const active = item.id === activeSection;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-slate-500 shrink-0">
                      {item.index}.
                    </span>
                    <span className="truncate">{item.shortTitle}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 px-3 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div>Stack objetivo</div>
              <div className="font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                tota-agent
                <br />
                Ollama · {config.ollamaModel}
                <br />
                Playwright headless
                <br />
                Telegram · Plugged Host
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />
              <aside className="relative z-50 w-72 max-w-[85vw] bg-white dark:bg-[#0B0F17] border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Entregables de Nova
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Cerrar menú"
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {SECTION_NAV.map((item) => {
                    const active = item.id === activeSection;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="font-mono tabular-nums text-xs text-slate-400">
                          {item.index}.
                        </span>
                        <span className="truncate">{item.shortTitle}</span>
                      </button>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content Viewport */}
          <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
            {/* Workspace Toolbar: Breadcrumb + Parameters Toggle + Theme Switch */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <span>Nova</span>
                <span aria-hidden="true">/</span>
                <span className="font-mono tabular-nums">{currentMeta.index}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium truncate">
                  {currentMeta.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowConfigPanel((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showConfigPanel
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{showConfigPanel ? 'Ocultar parámetros' : 'Ajustar parámetros'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Oscuro</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {showConfigPanel && (
              <ConfigPanel config={config} onChange={setConfig} />
            )}

            {/* Section Hero Heading */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono tabular-nums">Entrega {currentMeta.index} de 10</span>
                <span aria-hidden="true">·</span>
                <span>Solo bot de Telegram</span>
                <span aria-hidden="true">·</span>
                <span>Ollama {config.ollamaModel}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1.5 text-balance">
                {currentMeta.index}. {currentMeta.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentMeta.subtitle}
              </p>
            </div>

            {/* Active Section Body */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionViews sectionId={activeSection} config={config} />
            </motion.div>

            {/* Footer Section Pager */}
            <div className="pt-6 mt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              {prevSection ? (
                <button
                  type="button"
                  onClick={() => selectSection(prevSection.id)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {prevSection.index}. {prevSection.shortTitle}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextSection && (
                <button
                  type="button"
                  onClick={() => selectSection(nextSection.id)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="truncate">
                    {nextSection.index}. {nextSection.shortTitle}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
