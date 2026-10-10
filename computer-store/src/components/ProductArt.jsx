const range = (n) => Array.from({ length: n }, (_, i) => i)

const Shadow = ({ rx = 120 }) => <ellipse cx="200" cy="258" rx={rx} ry="11" fill="url(#pa-shadow)" />

function Tower() {
  return (
    <>
      <Shadow rx={100} />
      <rect x="142" y="40" width="116" height="212" rx="16" fill="url(#pa-dark)" />
      <rect x="150" y="50" width="82" height="192" rx="10" fill="url(#pa-glass)" />
      {[100, 168].map((cy) => (
        <g key={cy} fill="none" stroke="#a1a1a6" strokeOpacity=".55">
          <circle cx="191" cy={cy} r="27" />
          <circle cx="191" cy={cy} r="7" />
          <path d={`M191 ${cy - 27}v20M191 ${cy + 7}v20M164 ${cy}h20M198 ${cy}h20`} />
        </g>
      ))}
      <rect x="158" y="206" width="66" height="14" rx="4" fill="#6e6e73" />
      {range(8).map((i) => <rect key={i} x="240" y={78 + i * 14} width="12" height="3" rx="1.5" fill="#000" opacity=".45" />)}
      <circle cx="246" cy="62" r="3.2" fill="#d1d1d6" />
      <rect x="152" y="250" width="14" height="5" rx="2" fill="#0d0d0e" />
      <rect x="234" y="250" width="14" height="5" rx="2" fill="#0d0d0e" />
    </>
  )
}

function Workstation() {
  return (
    <>
      <Shadow rx={118} />
      <rect x="118" y="34" width="164" height="218" rx="14" fill="url(#pa-light)" />
      <rect x="130" y="52" width="140" height="150" rx="8" fill="#c9c8c4" opacity=".55" />
      {range(18).map((i) => <path key={i} d={`M${136 + i * 7.6} 58v138`} stroke="#8e8e93" strokeOpacity=".45" />)}
      {range(10).map((i) => <path key={i} d={`M134 ${64 + i * 14}h132`} stroke="#8e8e93" strokeOpacity=".25" />)}
      <rect x="130" y="214" width="140" height="22" rx="6" fill="#2c2c2e" />
      <circle cx="146" cy="225" r="4" fill="#d1d1d6" />
      <rect x="170" y="222" width="80" height="6" rx="3" fill="#48484a" />
    </>
  )
}

function Laptop() {
  return (
    <>
      <Shadow rx={150} />
      <rect x="80" y="46" width="240" height="154" rx="12" fill="#1d1d1f" />
      <rect x="88" y="54" width="224" height="138" rx="5" fill="url(#pa-screen)" />
      <path d="M88 54h110l-70 138H88z" fill="#fff" opacity=".05" />
      <circle cx="200" cy="50" r="1.6" fill="#48484a" />
      <path d="M48 204h304l16 18q4 8-6 8H38q-10 0-6-8z" fill="url(#pa-light)" />
      <rect x="168" y="204" width="64" height="6" rx="3" fill="#bdbcb8" />
    </>
  )
}

function Monitor({ wide = false }) {
  const w = wide ? 340 : 280
  const h = wide ? 130 : 164
  const x = 200 - w / 2
  const y = wide ? 62 : 40
  return (
    <>
      <Shadow rx={90} />
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#1d1d1f" />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="5" fill="url(#pa-screen)" />
      <path d={`M${x + 6} ${y + 6}h${w * 0.4}l-${w * 0.18} ${h - 12}H${x + 6}z`} fill="#fff" opacity=".05" />
      <rect x="188" y={y + h} width="24" height={238 - y - h} fill="#cfcec9" />
      <rect x="146" y="236" width="108" height="9" rx="4.5" fill="url(#pa-light)" />
    </>
  )
}

function Keyboard() {
  const rows = [14, 14, 13, 13]
  return (
    <>
      <Shadow rx={150} />
      <rect x="36" y="84" width="328" height="132" rx="16" fill="url(#pa-light)" />
      {rows.map((n, r) =>
        range(n).map((c) => (
          <rect key={`${r}-${c}`} x={50 + c * 22.5 + (r % 2) * 6} y={96 + r * 22} width="19" height="18" rx="4" fill="#fff" stroke="#cfcdc8" />
        )),
      )}
      <rect x="86" y="184" width="40" height="18" rx="4" fill="#fff" stroke="#cfcdc8" />
      <rect x="130" y="184" width="130" height="18" rx="4" fill="#fff" stroke="#cfcdc8" />
      <rect x="264" y="184" width="40" height="18" rx="4" fill="#fff" stroke="#cfcdc8" />
    </>
  )
}

function Mouse() {
  return (
    <>
      <Shadow rx={70} />
      <path d="M200 44C252 44 270 96 270 158c0 58-28 96-70 96s-70-38-70-96c0-62 18-114 70-114z" fill="url(#pa-light)" />
      <path d="M200 46v78M132 132q68 14 136 0" fill="none" stroke="#b8b7b3" strokeWidth="1.5" />
      <rect x="193" y="72" width="14" height="30" rx="7" fill="#4a4a50" />
    </>
  )
}

function Ssd() {
  return (
    <>
      <Shadow rx={150} />
      <rect x="44" y="112" width="22" height="76" rx="3" fill="#bab7ae" />
      {range(8).map((i) => <rect key={i} x="48" y={118 + i * 8.5} width="14" height="4" fill="#8e8b83" />)}
      <rect x="62" y="108" width="286" height="84" rx="8" fill="url(#pa-dark)" />
      <rect x="82" y="122" width="62" height="56" rx="4" fill="#4a4a50" />
      <rect x="154" y="122" width="62" height="56" rx="4" fill="#4a4a50" />
      <rect x="228" y="122" width="38" height="56" rx="4" fill="#3a3a3d" />
      <rect x="276" y="130" width="56" height="5" rx="2.5" fill="#8e8e93" />
      <rect x="276" y="142" width="38" height="5" rx="2.5" fill="#6e6e73" />
      <circle cx="334" cy="150" r="7" fill="none" stroke="#8e8e93" strokeOpacity=".6" />
    </>
  )
}

function Ram() {
  return (
    <>
      <Shadow rx={150} />
      <rect x="40" y="188" width="320" height="22" rx="3" fill="#2c2c2e" />
      {range(40).map((i) => (i === 19 || i === 20 ? null : <rect key={i} x={46 + i * 7.8} y="196" width="4.6" height="14" fill="#bab7ae" />))}
      <rect x="40" y="92" width="320" height="98" rx="8" fill="url(#pa-dark)" />
      <rect x="40" y="92" width="320" height="22" rx="8" fill="#5a5a5f" />
      {range(7).map((i) => <path key={i} d={`M${64 + i * 44} 118v66`} stroke="#000" strokeOpacity=".35" />)}
      <rect x="64" y="140" width="110" height="6" rx="3" fill="#8e8e93" />
      <rect x="64" y="154" width="64" height="6" rx="3" fill="#6e6e73" />
    </>
  )
}

const ARTS = { tower: Tower, workstation: Workstation, laptop: Laptop, monitor: Monitor, ultrawide: () => <Monitor wide />, keyboard: Keyboard, mouse: Mouse, ssd: Ssd, ram: Ram }

export default function ProductArt({ art }) {
  const Art = ARTS[art]
  if (!Art) return null
  return (
    <svg className="product-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pa-dark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b3b3f" /><stop offset="1" stopColor="#151517" /></linearGradient>
        <linearGradient id="pa-light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fdfdfc" /><stop offset="1" stopColor="#d3d2ce" /></linearGradient>
        <linearGradient id="pa-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#58585d" /><stop offset="1" stopColor="#1c1c1f" /></linearGradient>
        <linearGradient id="pa-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4d4d54" /><stop offset="1" stopColor="#0f0f11" /></linearGradient>
        <radialGradient id="pa-shadow"><stop offset="0" stopColor="#000" stopOpacity=".3" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>
      <Art />
    </svg>
  )
}
