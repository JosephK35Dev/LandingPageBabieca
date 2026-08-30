import { useState } from 'react'
import horseLogo from "@/imports/png-horse-final.png"
// ─── Admin flags ──────────────────────────────────────────────────────────────
// Set to true when there are racing events in Venezuelan hippodromes this Saturday
const SATURDAY_HAS_VENEZUELA_EVENTS = false

// ─── Data ─────────────────────────────────────────────────────────────────────

type CountryGroup = {
  flags: string
  label: string
  items: string[]
}

type PromoDay = {
  days: string
  badge: string
  icon: string
  title: string
  items: string[]
  groups?: CountryGroup[]
  rollovers?: string[]
}

const weeklyPromos: PromoDay[] = [
  {
    days: 'Lunes',
    badge: 'LUN',
    icon: '🐴🔥',
    title: 'SALIDA DE CAMPEONES',
    items: ['1.ª recarga del día', 'Hasta 80% de bono'],
    rollovers: ['50% → X5', '60% → X4', '80% → X3'],
  },
  {
    days: 'Martes',
    badge: 'MAR',
    icon: '🐴🔥',
    title: 'DE MULTIPLICAR',
    items: ['1.ª recarga → Hasta 80%'],
    groups: [
      {
        flags: '🇵🇪🇧🇷🇺🇸',
        label: 'Perú · Brasil · EE. UU.',
        items: ['2.ª recarga → 20 giros'],
      },
      {
        flags: '🌎',
        label: 'Demás países',
        items: ['2.ª recarga → 200% deportivas', 'Rollover 200% → X8'],
      },
    ],
  },
  {
    days: 'Miércoles',
    badge: 'MIÉ',
    icon: '🐴🔥',
    title: 'SALVAJE',
    items: ['1.ª recarga del día', 'Hasta 80% de bono'],
    rollovers: ['50% → X5', '60% → X4', '80% → X3'],
  },
  {
    days: 'Jueves y Viernes',
    badge: 'JUE & VIE',
    icon: '🔥',
    title: '3×3',
    items: [],
    groups: [
      {
        flags: '🇵🇪🇧🇷🇺🇸',
        label: 'Perú · Brasil · EE. UU.',
        items: ['1.ª recarga → Según monto', '2.ª recarga → 20 giros', '3.ª recarga → 30 giros'],
      },
      {
        flags: '🌎',
        label: 'Demás países',
        items: ['1.ª recarga → 30%', '2.ª recarga → 20 giros', '3.ª recarga → 200% deportivas'],
      },
    ],
    rollovers: ['30% → X6', '20% → X5', '200% dep. → X8'],
  },
]

type RangeRow = { bono: string; rango: string }
type CountryBonos = { flag: string; country: string; ranges: RangeRow[] }

// ─── EDITABLE: Agrega o modifica países y rangos en este arreglo ─────────────
const bonosData: CountryBonos[] = [
  {
    flag: '🇨🇴',
    country: 'Colombia',
    ranges: [
      { bono: '50%', rango: '$20.000 – $60.000 COP' },
      { bono: '60%', rango: '$61.000 – $99.900 COP' },
      { bono: '80%', rango: '$100.000 COP o más' },
    ],
  },
  // Para agregar más países descomenta y completa:
  // { flag: '🇻🇪', country: 'Venezuela', ranges: [ { bono: '50%', rango: '...' }, ... ] },
  // { flag: '🇵🇪', country: 'Perú',      ranges: [ ... ] },
]
// ─────────────────────────────────────────────────────────────────────────────

const steps = [
  { n: '01', title: 'Regístrate', desc: 'Crea tu cuenta en menos de 2 minutos.' },
  { n: '02', title: 'Verifica',   desc: 'Confirma tu identidad con un documento válido.' },
  { n: '03', title: 'Deposita',   desc: 'Recarga con tu método de pago favorito.' },
  { n: '04', title: 'Apuesta',    desc: 'Elige tu carrera y vive la emoción.' },
]

const faqs = [
  {
    q: '¿Cómo registro mi cuenta?',
    a: 'Haz clic en "Regístrate Ahora", completa el formulario con tus datos personales y confirma tu correo electrónico. El proceso toma menos de 2 minutos.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito, Nequi, Daviplata, Zinli y otras billeteras digitales según tu país de residencia.',
  },
  {
    q: '¿Cuál es el depósito mínimo?',
    a: 'El depósito mínimo varía por país. En Colombia desde $20.000 COP. Consulta la tabla "Recarga más, recibe más" para ver los rangos completos.',
  },
  {
    q: '¿Cómo funciona el rollover?',
    a: 'El rollover es el número de veces que debes apostar el bono antes de poder retirar. Un bono de $100 con rollover X5 requiere apostar $500 en total, en cuotas de 1.50 o superiores.',
  },
  {
    q: '¿El 200% en deportivas tiene condiciones especiales?',
    a: 'Sí. Aplica en fútbol, solo en apuestas combinadas de 3 a 20 selecciones, con cuota mínima de 1.90 por selección, y exclusivamente en modalidad prepartido.',
  },
  {
    q: '¿El Sábado de Galope siempre está disponible?',
    a: 'El bono del 20% en hipismo aplica los sábados en los que no haya eventos en hipódromos de Venezuela. Cuando hay jornada venezolana, esa semana no hay promo de galope.',
  },
  {
    q: '¿Puedo apostar desde el celular?',
    a: 'Sí, la plataforma está totalmente optimizada para móviles. Accede desde tu navegador — sin apps ni descargas.',
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F0E8] font-inter overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#090909]/92 backdrop-blur-sm border-b border-[#C9A227]/15">
        <BrandMark compact />
        <a
          href="#registro"
          className="font-barlow font-bold text-xs tracking-[0.2em] uppercase text-[#090909] bg-[#C9A227] px-5 py-2.5 hover:bg-[#DDB52E] active:scale-95 transition-all duration-150"
        >
          REGÍSTRATE
        </a>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-5 pt-16">
        <div className="absolute inset-0 bg-[#090909]">
          <img
            src="https://images.unsplash.com/photo-1495543377553-b2aba1f925d7?w=1400&h=900&fit=crop&auto=format"
            alt="Jinete en plena carrera de caballos"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/70 via-[#090909]/30 to-[#090909]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/40 via-transparent to-[#090909]/40" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <BrandMark />
          <div className="mt-8 mb-5">
            <div className="inline-flex items-center gap-2 border border-[#BF1E2E]/60 bg-[#BF1E2E]/10 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BF1E2E] animate-pulse" />
              <span className="font-barlow font-bold text-xs tracking-[0.2em] text-[#F5F0E8]/80 uppercase">
                En vivo · Apostando ahora
              </span>
            </div>
          </div>
          <h1 className="font-barlow font-black text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.95] tracking-tight text-white mb-5">
            Promociones,<br />carreras y<br />
            <span className="text-[#C9A227]">emoción</span> toda<br />
            la semana. 🐴🔥
          </h1>
          <p className="text-[#F5F0E8]/60 text-sm md:text-base leading-relaxed mb-9 max-w-sm">
            La casa hípica con las mejores cuotas y bonos de América Latina.
            Miles de apostadores ya ganan con nosotros cada semana.
          </p>
          <a
            href="#registro"
            className="group inline-flex items-center gap-3 bg-[#BF1E2E] text-white font-barlow font-black text-xl tracking-[0.15em] uppercase px-10 py-5 hover:bg-[#D42235] active:scale-95 transition-all duration-150 shadow-lg shadow-[#BF1E2E]/25"
          >
            REGÍSTRATE AHORA
            <span className="text-white/60 group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <p className="mt-4 text-[10px] text-[#F5F0E8]/30 tracking-widest uppercase">
            +18 · Juega responsablemente
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-[#C9A227]/0 to-[#C9A227]/50" />
          <div className="w-1 h-1 rounded-full bg-[#C9A227]/50" />
        </div>
      </section>

      {/* ── PROMO DE HOY ── */}
      <section className="px-5 py-16 max-w-2xl mx-auto">
        <SectionDivider label="PROMOCIÓN DE HOY" />
        <div className="relative overflow-hidden border border-[#C9A227]/40 bg-[#0F0F0F] group">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1516673699707-4f2a243fafaf?w=900&h=400&fit=crop&auto=format"
              alt="Jockey en carrera"
              className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-[#0F0F0F]/30" />
          </div>
          <div className="absolute top-0 right-0 bg-[#BF1E2E] px-4 py-2">
            <span className="font-barlow font-bold text-xs tracking-[0.2em] text-white uppercase">HOY · VÁLIDO 24H</span>
          </div>
          <div className="relative p-7 md:p-10">
            <div className="font-barlow font-black text-7xl md:text-8xl text-[#C9A227] leading-none mb-1">80%</div>
            <h2 className="font-barlow font-black text-2xl md:text-3xl uppercase text-white mb-3">
              Recarga del día 🐴🔥
            </h2>
            <p className="text-[#F5F0E8]/55 text-sm leading-relaxed mb-7 max-w-xs">
              Recarga hoy y recibe hasta el{' '}
              <strong className="text-[#C9A227]">80% de bono</strong> en tu primera recarga del
              día. Rollover según el porcentaje recibido.
            </p>
            <a
              href="#registro"
              className="inline-block bg-[#C9A227] text-[#090909] font-barlow font-bold text-sm tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-[#DDB52E] active:scale-95 transition-all duration-150"
            >
              RECLAMAR BONO
            </a>
          </div>
        </div>
      </section>

      {/* ── PROMOS DE LA SEMANA ── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="PROMOCIONES DE LA SEMANA" />
          <div className="grid grid-cols-2 gap-3">
            {weeklyPromos.map((p, i) => (
              <PromoCard key={i} promo={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SÁBADO ── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="SÁBADO" />
          {!SATURDAY_HAS_VENEZUELA_EVENTS ? (
            <div className="border border-[#C9A227]/40 bg-[#0F0F0F] p-7">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-barlow font-bold text-[10px] tracking-[0.3em] text-[#C9A227] uppercase mb-1">
                    Sábado
                  </div>
                  <h2 className="font-barlow font-black text-3xl uppercase text-white leading-tight">
                    SÁBADO DE GALOPE
                  </h2>
                  <div className="text-xl mt-1">🐴🔥</div>
                </div>
                <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 px-4 py-3 text-center flex-shrink-0">
                  <div className="font-barlow font-black text-3xl text-[#C9A227] leading-none">20%</div>
                  <div className="text-[9px] text-[#F5F0E8]/50 uppercase tracking-wider mt-1">en hipismo</div>
                </div>
              </div>
              <div className="w-full h-px bg-[#C9A227]/15 mb-5" />
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <div className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase mb-2">Categoría</div>
                  <div className="font-barlow font-bold text-lg text-white">Hipismo</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase mb-2">Rollover</div>
                  <div className="font-barlow font-black text-lg text-[#C9A227]">X5</div>
                </div>
              </div>
              <div className="bg-[#C9A227]/5 border border-[#C9A227]/15 px-4 py-3">
                <p className="text-xs text-[#F5F0E8]/55 leading-relaxed">
                  Sin recarga mínima. Disponible los sábados sin eventos en hipódromos de Venezuela.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-[#BF1E2E]/30 bg-[#0F0F0F] p-7">
              <div className="text-3xl mb-3">🏇</div>
              <h2 className="font-barlow font-black text-3xl uppercase text-white mb-2">
                SÁBADO DE CARRERAS
              </h2>
              <p className="font-barlow font-bold text-xl text-[#C9A227] mb-4">Jornada hípica nacional</p>
              <p className="text-sm text-[#F5F0E8]/55 leading-relaxed">
                Sin promociones disponibles durante eventos en Venezuela.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── DOMINGO ── */}
      <section className="py-16 px-5 bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="DOMINGO" />
          <div className="relative overflow-hidden border border-[#C9A227]/20 bg-[#0F0F0F] p-7">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1631448829489-6228f21df74c?w=900&h=350&fit=crop&auto=format"
                alt="Carreras de caballos"
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] to-[#0F0F0F]/60" />
            </div>
            <div className="relative">
              <div className="text-3xl mb-3">🏆</div>
              <h2 className="font-barlow font-black text-3xl uppercase text-white mb-3">
                CARRERAS NACIONALES
              </h2>
              <p className="text-[#F5F0E8]/55 text-sm leading-relaxed max-w-sm">
                Vive la emoción de las carreras nacionales con Babieca. Cada domingo es una jornada épica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECARGA MÁS, RECIBE MÁS ── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="RECARGA MÁS, RECIBE MÁS" />
          <p className="text-[#F5F0E8]/50 text-sm mb-8 text-center leading-relaxed max-w-md mx-auto">
            El porcentaje de bono que recibes depende del monto depositado.
            A mayor recarga, mayor bono.
          </p>
          <div className="space-y-4">
            {bonosData.map((country, ci) => (
              <div key={ci} className="border border-[#C9A227]/20 overflow-hidden">
                <div className="bg-[#C9A227]/8 border-b border-[#C9A227]/20 px-5 py-3 flex items-center gap-3">
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-barlow font-bold text-sm tracking-[0.2em] text-[#C9A227] uppercase">
                    {country.country}
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#C9A227]/10">
                      <th className="text-left py-2.5 px-5 font-barlow font-bold text-[10px] tracking-[0.2em] text-[#F5F0E8]/35 uppercase w-24">
                        Bono
                      </th>
                      <th className="text-left py-2.5 px-5 font-barlow font-bold text-[10px] tracking-[0.2em] text-[#F5F0E8]/35 uppercase">
                        Rango de depósito
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {country.ranges.map((r, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-[#C9A227]/10 last:border-0 hover:bg-[#C9A227]/5 transition-colors"
                      >
                        <td className="py-3.5 px-5 font-barlow font-black text-xl text-[#C9A227]">
                          {r.bono}
                        </td>
                        <td className="py-3.5 px-5 text-[#F5F0E8]/65">{r.rango}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#F5F0E8]/25 tracking-wider mt-3 text-right uppercase">
            * Aplican términos y condiciones
          </p>
        </div>
      </section>

      {/* ── ROLLOVER ── */}
      <section className="py-16 px-5 bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="ROLLOVER" />
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div className="border-l-2 border-[#C9A227] pl-6">
              <h2 className="font-barlow font-black text-3xl md:text-4xl uppercase text-white mb-4 leading-tight">
                ¿Qué es el rollover?
              </h2>
              <p className="text-[#F5F0E8]/55 text-sm leading-relaxed mb-4">
                Es el número de veces que debes apostar el bono antes de poder retirar. Un bono de{' '}
                <strong className="text-[#F5F0E8]">$100</strong> con rollover{' '}
                <strong className="text-[#C9A227]">X5</strong> significa apostar{' '}
                <strong className="text-[#F5F0E8]">$500 en total</strong> en cuotas de 1.50 o superiores.
              </p>
              <div className="bg-[#C9A227]/5 border border-[#C9A227]/15 p-4 space-y-1.5">
                <div className="text-[9px] text-[#C9A227] uppercase tracking-widest mb-2 font-bold">
                  Rollover por bono
                </div>
                {['50% → X5', '60% → X4', '80% → X3', '30% → X6', '20% → X5', '200% deportivas → X8'].map(
                  (r) => (
                    <div key={r} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#C9A227]/50 flex-shrink-0" />
                      <span className="text-xs text-[#F5F0E8]/60 font-barlow">{r}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex md:flex-col gap-3">
              {[
                { label: 'Cuota mín.', value: '1.50' },
                { label: 'Límite', value: '30d' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 md:flex-none bg-[#0F0F0F] border border-[#C9A227]/20 p-5 text-center min-w-[80px]"
                >
                  <div className="font-barlow font-black text-3xl text-[#C9A227] leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-[#F5F0E8]/40 tracking-widest uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 200% EN DEPORTIVAS ── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="200% EN DEPORTIVAS" />
          <div className="relative overflow-hidden bg-[#BF1E2E]">
            <div className="absolute right-0 top-0 bottom-0 w-3/5 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1723750601138-34f901f70aaf?w=700&h=400&fit=crop&auto=format"
                alt="Caballos corriendo"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#BF1E2E] via-[#BF1E2E]/60 to-transparent" />
            </div>
            <div className="relative p-8 md:p-10">
              <div className="font-barlow font-black text-7xl md:text-8xl text-[#FFE08A] leading-none mb-1">
                200%
              </div>
              <h2 className="font-barlow font-black text-xl uppercase text-white mb-1">
                2.ª Recarga → 200% de bono
              </h2>
              <p className="text-white/70 font-barlow font-bold text-lg mb-5">Rollover X8</p>
              <div className="bg-white/10 border border-white/20 p-4 mb-7 space-y-2">
                <p className="text-[10px] text-white/60 uppercase tracking-widest mb-2 font-bold">
                  Condiciones
                </p>
                {[
                  'Solo fútbol',
                  'Apuestas combinadas',
                  '3 a 20 selecciones',
                  'Cuota mínima 1.90 por selección',
                  'Solo apuestas prepartido',
                ].map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#FFE08A] flex-shrink-0" />
                    <span className="text-xs text-white/80">{c}</span>
                  </div>
                ))}
              </div>
              <a
                href="#registro"
                className="inline-block bg-white text-[#BF1E2E] font-barlow font-bold text-sm tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-[#F5F0E8] active:scale-95 transition-all duration-150"
              >
                OBTENER 200%
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO PARTICIPAR ── */}
      <section className="py-16 px-5 bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="CÓMO PARTICIPAR" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%+12px)] right-[-12px] h-px bg-[#C9A227]/15 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 border border-[#C9A227]/40 flex items-center justify-center mb-4">
                    <span className="font-barlow font-black text-sm text-[#C9A227]">{s.n}</span>
                  </div>
                  <div className="w-6 h-[2px] bg-[#C9A227] mb-3" />
                  <div className="font-barlow font-black text-xl uppercase text-white mb-2 leading-tight">
                    {s.title}
                  </div>
                  <div className="text-xs text-[#F5F0E8]/45 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#registro"
              className="inline-block border border-[#C9A227]/40 text-[#C9A227] font-barlow font-bold text-sm tracking-[0.2em] uppercase px-8 py-3 hover:bg-[#C9A227] hover:text-[#090909] transition-all duration-200"
            >
              COMENZAR AHORA →
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <SectionDivider label="PREGUNTAS FRECUENTES" />
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#C9A227]/15 bg-[#0F0F0F] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left group"
                >
                  <span className="font-barlow font-bold text-base uppercase text-white group-hover:text-[#C9A227] transition-colors pr-4 leading-tight">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 text-[#C9A227] transition-transform duration-200 ${
                      openFaq === i ? 'rotate-45' : ''
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#F5F0E8]/55 leading-relaxed border-t border-[#C9A227]/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section id="registro" className="relative py-28 px-5 overflow-hidden">
        <div className="absolute inset-0 bg-[#090909]">
          <img
            src="https://images.unsplash.com/photo-1598362042346-70c59713811f?w=1200&h=700&fit=crop&auto=format"
            alt="Siluetas de caballos al atardecer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-[#090909]/60 to-[#090909]" />
        </div>
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <BrandMark />
          <h2 className="font-barlow font-black text-4xl sm:text-5xl md:text-6xl uppercase text-white mt-8 mb-4 leading-[0.95]">
            Únete hoy y<br />
            <span className="text-[#C9A227]">gana desde el inicio</span>
          </h2>
          <p className="text-[#F5F0E8]/50 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Más de 50.000 jugadores ya viven la emoción de las carreras con Babieca.
            Tu bono de bienvenida te espera.
          </p>
          <a
            href="#"
            className="inline-block bg-[#BF1E2E] text-white font-barlow font-black text-xl tracking-[0.2em] uppercase px-12 py-5 hover:bg-[#D42235] active:scale-95 transition-all duration-150 shadow-xl shadow-[#BF1E2E]/20"
          >
            REGÍSTRATE AHORA
          </a>
          <p className="mt-6 text-[10px] text-[#F5F0E8]/25 tracking-widest uppercase">
            +18 · Juega con responsabilidad · Términos y condiciones aplican
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-5 border-t border-[#C9A227]/10">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <BrandMark compact />
          <p className="text-[10px] text-[#F5F0E8]/25 tracking-wider text-center md:text-right">
            © 2024 Hípicas Babieca · Todos los derechos reservados
            <br />
            Juego responsable · +18 · Términos y condiciones
          </p>
        </div>
      </footer>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PromoCard({ promo }: { promo: PromoDay }) {
  return (
    <div className="border border-[#C9A227]/20 bg-[#0F0F0F] p-5 hover:border-[#C9A227]/50 transition-all duration-200 group flex flex-col">
      <div className="font-barlow font-black text-3xl text-[#C9A227]/12 group-hover:text-[#C9A227]/22 transition-colors mb-3 leading-none">
        {promo.badge}
      </div>
      <div className="font-barlow font-bold text-[10px] tracking-[0.25em] text-[#C9A227] uppercase mb-1">
        {promo.days}
      </div>
      <div className="font-barlow font-black text-base uppercase text-white leading-tight mb-1">
        {promo.title}
      </div>
      <div className="text-base mb-3">{promo.icon}</div>

      {promo.items.length > 0 && (
        <div className="space-y-1 mb-3">
          {promo.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#C9A227]/50 flex-shrink-0" />
              <span className="text-xs text-[#F5F0E8]/65 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      )}

      {promo.groups && (
        <div className="space-y-2.5 mb-3 flex-1">
          {promo.groups.map((g, i) => (
            <div key={i} className="border-l border-[#C9A227]/25 pl-2.5">
              <div className="text-[10px] text-[#F5F0E8]/45 mb-1 leading-tight">
                {g.flags} <span className="hidden sm:inline">{g.label}</span>
              </div>
              {g.items.map((item, j) => (
                <div key={j} className="text-[11px] text-[#F5F0E8]/60 leading-snug">
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {promo.rollovers && (
        <div className="bg-[#C9A227]/5 border border-[#C9A227]/15 p-2.5 mt-auto">
          <div className="text-[9px] text-[#C9A227] uppercase tracking-widest mb-1.5 font-bold">
            Rollover
          </div>
          <div className="flex flex-col gap-0.5">
            {promo.rollovers.map((r, i) => (
              <span key={i} className="text-[11px] text-[#F5F0E8]/55 font-barlow leading-tight">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <HorseSymbol height={30} />
        <div className="flex flex-col leading-none gap-0.5">
          <span className="font-barlow font-black text-[14px] tracking-[0.3em] text-[#C9A227] uppercase leading-none">
            BABIECA
          </span>
          <span className="font-barlow font-bold text-[9px] tracking-[0.3em] text-[#F5F0E8]/45 uppercase leading-none">
            HÍPICAS
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <HorseSymbol height={80} />
      <div className="h-px w-16 bg-[#C9A227]/30 mt-1" />
      <span className="font-barlow font-black text-3xl tracking-[0.4em] text-[#C9A227] uppercase leading-none">
        BABIECA
      </span>
      <span className="font-barlow font-bold text-xs tracking-[0.45em] text-[#F5F0E8]/45 uppercase leading-none">
        HÍPICAS
      </span>
    </div>
  )
}

// Crops the image to just the horse symbol using overflow + mix-blend-mode:screen
// mix-blend-mode:screen makes the black background invisible on our dark canvas
function HorseSymbol({ height = 100 }: { height?: number }) {
  return (
      <div
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        lineHeight: 0,
      }}
    >
      <img
        src={horseLogo}
        alt="Caballo Babieca"
        style={{
          height,
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A227]/30" />
      <span className="font-barlow font-bold text-[10px] tracking-[0.35em] text-[#C9A227] uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A227]/30" />
    </div>
  )
}
