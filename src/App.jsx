import { useState, useRef } from "react"
import Lottie from "lottie-react"
import "./index.css"
import "./App.css"

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="tooltip-wrapper">
      <button
        className="tooltip-trigger"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Aide"
      >?</button>
      {open && <span className="tooltip-box">{text}</span>}
    </span>
  )
}

// ─── NumInput ─────────────────────────────────────────────────────────────────
function NumInput({ label, hint, tooltip, suffix, placeholder, value, onChange, optional, error }) {
  return (
    <div className="input-group">
      <label className="input-label">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
        {optional && <span className="badge-optional">optionnel</span>}
      </label>
      {hint && <span className="input-hint">{hint}</span>}
      <div className="input-with-suffix">
        <input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          min="0"
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
}

// ─── LottieBtn ────────────────────────────────────────────────────────────────
function LottieBtn({ href, children }) {
  const lottieRef1 = useRef(null)
  const lottieRef2 = useRef(null)
  const [animData, setAnimData] = useState(null)

  useState(() => {
    fetch("/lottie-btn.json")
      .then(r => r.json())
      .then(setAnimData)
      .catch(() => {})
  })

  const handleEnter = () => {
    lottieRef1.current?.play()
    lottieRef2.current?.play()
  }
  const handleLeave = () => {
    lottieRef1.current?.stop()
    lottieRef2.current?.stop()
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn--primary lottie-btn"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {animData && (
        <Lottie lottieRef={lottieRef1} animationData={animData} autoplay={false} loop={false} style={{ width: 40, height: 40 }} />
      )}
      <span>{children}</span>
      {animData && (
        <Lottie lottieRef={lottieRef2} animationData={animData} autoplay={false} loop={false} style={{ width: 40, height: 40, transform: "scaleX(-1)" }} />
      )}
    </a>
  )
}

// ─── Formules ─────────────────────────────────────────────────────────────────
function computeSimple(marge) {
  if (!marge || marge <= 0 || marge >= 100) return null
  return 1 / (marge / 100)
}

function computeFull(marge, fraisFixes, ca) {
  if (!marge || marge <= 0 || marge >= 100) return null
  if (!fraisFixes || !ca || ca <= 0) return null
  const margeNette = marge / 100 - fraisFixes / ca
  if (margeNette <= 0) return null
  return 1 / margeNette
}

function computeBenefice(depenses, roasActuel, marge, fraisFixes, ca) {
  if (!depenses || !roasActuel || !marge) return null
  const caAds = depenses * roasActuel
  const margeEuros = caAds * (marge / 100)
  const fraisImputés = fraisFixes && ca ? fraisFixes * (caAds / ca) : 0
  return margeEuros - depenses - fraisImputés
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // Niveau 1
  const [marge, setMarge] = useState("")
  // Niveau 2
  const [showAffiner, setShowAffiner] = useState(false)
  const [fraisFixes, setFraisFixes] = useState("")
  const [ca, setCa] = useState("")
  // Niveau 3
  const [showComparer, setShowComparer] = useState(false)
  const [roasActuel, setRoasActuel] = useState("")
  const [depenses, setDepenses] = useState("")

  // Validation
  const errMarge = marge !== "" && (Number(marge) <= 0 || Number(marge) >= 100)
    ? "La marge doit être entre 1% et 99%."
    : null
  const errFraisCa = fraisFixes !== "" && ca !== "" && Number(fraisFixes) > Number(ca)
    ? "Tes frais fixes dépassent ton CA — vérifie tes chiffres."
    : null
  const margeNette = marge && ca && fraisFixes
    ? Number(marge) / 100 - Number(fraisFixes) / Number(ca)
    : null
  const errMargeNette = margeNette !== null && margeNette <= 0
    ? "Ta marge nette est négative ou nulle — tu es déjà à perte avant la pub."
    : null

  // Calculs
  const roasSimple = !errMarge && marge !== "" ? computeSimple(Number(marge)) : null
  const roasFull = !errMarge && !errFraisCa && !errMargeNette && marge && fraisFixes && ca
    ? computeFull(Number(marge), Number(fraisFixes), Number(ca))
    : null
  const roasSeuil = roasFull ?? roasSimple
  const benefice = !errMarge && roasActuel && depenses
    ? computeBenefice(
        Number(depenses),
        Number(roasActuel),
        Number(marge),
        fraisFixes ? Number(fraisFixes) : 0,
        ca ? Number(ca) : null
      )
    : null
  const isRentable = roasSeuil !== null && roasActuel !== "" && Number(roasActuel) >= roasSeuil
  const hasVerdict = roasSeuil !== null && roasActuel !== "" && depenses !== ""

  return (
    <div className="tool-wrapper">
      <div className="grain-overlay" />
      <div className="tool-container">

        {/* ── Header ── */}
        <header className="tool-header">
          <a href="https://lutie.webflow.io" target="_blank" rel="noopener noreferrer" className="tool-logo">
            <img src="https://cdn.prod.website-files.com/68b6be52d4cf251987cb0b82/68b7ba9e3b082f85f53e7e3e_lutie-logo.svg" alt="Lutie" height="32" />
          </a>
          <div className="tool-header-text">
            <h1 className="tool-headline">Ton ROAS — est-il vraiment rentable&nbsp;?</h1>
            <p className="tool-subtitle">Entre ta marge brute. On calcule le ROAS minimum en dessous duquel tu perds de l'argent.</p>
          </div>
        </header>

        {/* ── Niveau 1 — Marge brute ── */}
        <div className="card section-card">
          <div className="section-label">Étape 1 — L'essentiel</div>
          <NumInput
            label="Ta marge brute sur les produits vendus"
            tooltip="Prix de vente − coût d'achat / prix de vente. Ex : tu vends 100€, ça te coûte 55€ → 45%"
            suffix="%"
            placeholder="Ex : 45"
            value={marge}
            onChange={setMarge}
            error={errMarge}
          />

          {/* Résultat niveau 1 */}
          {roasSimple && !errMarge && (
            <div className={`result-block ${roasFull ? "result-block--secondary" : "result-block--highlight"}`}>
              <div className="metric-label">ROAS seuil de rentabilité</div>
              <div className="metric-big">{roasSeuil.toFixed(2)}</div>
              <p className="result-phrase">
                Avec ta marge, chaque euro dépensé en Ads doit générer au minimum <strong>{roasSeuil.toFixed(2)}€</strong> de CA.
              </p>
              {!roasFull && (
                <p className="result-note">
                  ⚡ Calcul simplifié — ajoute tes frais fixes ci-dessous pour un ROAS précis.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Niveau 2 — Affiner ── */}
        {marge && !errMarge && (
          <div className="card section-card">
            <button
              className="expand-btn"
              onClick={() => setShowAffiner(!showAffiner)}
            >
              {showAffiner ? "▲ Masquer" : "▼ Affiner avec tes frais fixes"}
            </button>

            {showAffiner && (
              <div className="expand-content">
                <p className="expand-intro">Tes frais fixes (loyer, salaires, logiciels…) impactent ta vraie rentabilité pub. On les intègre au calcul.</p>
                <div className="grid-2">
                  <NumInput
                    label="Frais fixes mensuels"
                    tooltip="Loyer, salaires, abonnements logiciels, comptabilité… Tout ce qui est fixe chaque mois."
                    suffix="€"
                    placeholder="Ex : 8 000"
                    value={fraisFixes}
                    onChange={setFraisFixes}
                    error={errFraisCa}
                  />
                  <NumInput
                    label="CA mensuel total (toutes sources)"
                    tooltip="Ton chiffre d'affaires total, pas seulement via Ads. Sert à calculer la part des frais fixes imputables à la pub."
                    suffix="€"
                    placeholder="Ex : 80 000"
                    value={ca}
                    onChange={setCa}
                  />
                </div>
                {errMargeNette && (
                  <p className="warning-msg">{errMargeNette}</p>
                )}
                {roasFull && (
                  <div className="result-block result-block--highlight">
                    <div className="metric-label">ROAS seuil précis</div>
                    <div className="metric-big">{roasFull.toFixed(2)}</div>
                    <p className="result-phrase">
                      Après frais fixes, ta marge nette est de <strong>{(margeNette * 100).toFixed(1)}%</strong>. Chaque euro en Ads doit générer au minimum <strong>{roasFull.toFixed(2)}€</strong> de CA.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Niveau 3 — Comparer ── */}
        {roasSeuil && (
          <div className="card section-card">
            <button
              className="expand-btn"
              onClick={() => setShowComparer(!showComparer)}
            >
              {showComparer ? "▲ Masquer" : "▼ Comparer avec ton ROAS actuel"}
            </button>

            {showComparer && (
              <div className="expand-content">
                <p className="expand-intro">Entre ton ROAS Google Ads et tes dépenses mensuelles pour voir si tu es rentable — et de combien.</p>
                <div className="grid-2">
                  <NumInput
                    label="Ton ROAS actuel (affiché dans Google Ads)"
                    tooltip="Le ROAS affiché dans l'interface Google Ads ou Meta Ads. Valeur sur les 30 derniers jours."
                    placeholder="Ex : 3.2"
                    value={roasActuel}
                    onChange={setRoasActuel}
                    optional
                  />
                  <NumInput
                    label="Dépenses Ads mensuelles"
                    suffix="€"
                    placeholder="Ex : 5 000"
                    value={depenses}
                    onChange={setDepenses}
                    optional
                  />
                </div>

                {hasVerdict && (
                  <div className={`verdict ${isRentable ? "verdict--ok" : "verdict--ko"}`}>
                    <div className="verdict-icon">{isRentable ? "✅" : "⚠️"}</div>
                    <div className="verdict-content">
                      <div className="verdict-title">
                        {isRentable
                          ? `Ton ROAS de ${Number(roasActuel).toFixed(2)} est rentable`
                          : `Ton ROAS de ${Number(roasActuel).toFixed(2)} est sous le seuil`}
                      </div>
                      <div className="verdict-subtitle">
                        {isRentable
                          ? `Tu es ${(Number(roasActuel) - roasSeuil).toFixed(2)} points au-dessus du seuil de rentabilité (${roasSeuil.toFixed(2)}).`
                          : `Tu es ${(roasSeuil - Number(roasActuel)).toFixed(2)} points en dessous du seuil de rentabilité (${roasSeuil.toFixed(2)}). Tu perds de l'argent.`}
                      </div>
                      {benefice !== null && (
                        <div className={`benefice-line ${benefice >= 0 ? "benefice--pos" : "benefice--neg"}`}>
                          {benefice >= 0
                            ? `+${benefice.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`
                            : `${benefice.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`}
                          <span className="benefice-label"> de résultat mensuel estimé sur tes ventes Ads</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Explication pédagogique ── */}
        {roasSeuil && (
          <div className="card card--neutral explainer">
            <div className="explainer-title">💡 Pourquoi ce chiffre ?</div>
            <p>Le ROAS seuil, c'est le point d'équilibre : en dessous, chaque vente générée par ta pub te coûte plus qu'elle ne te rapporte. Ce n'est pas un objectif de performance — c'est le plancher de survie.</p>
            {roasFull && (
              <div className="explainer-calc">
                <div className="calc-line">Marge brute <span>{Number(marge).toFixed(0)}%</span></div>
                <div className="calc-line">Part des frais fixes <span>−{(Number(fraisFixes) / Number(ca) * 100).toFixed(1)}%</span></div>
                <div className="calc-line calc-line--result">Marge nette <span>{(margeNette * 100).toFixed(1)}%</span></div>
                <div className="calc-line calc-line--roas">ROAS seuil = 1 ÷ {(margeNette * 100).toFixed(1)}% = <span>{roasFull.toFixed(2)}</span></div>
              </div>
            )}
          </div>
        )}

        {/* ── CTA ── */}
        {roasSeuil && (
          <div className="cta-section">
            <p className="cta-text">Tu veux optimiser tes campagnes pour ta vraie rentabilité&nbsp;?</p>
            <LottieBtn href="https://lutie.webflow.io/contact">
              On en parle — audit offert
            </LottieBtn>
            <p className="cta-sub">Réponse sous 24h · Sans engagement</p>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="tool-footer">
          <p>Outil gratuit par <a href="https://lutie.webflow.io" target="_blank" rel="noopener noreferrer">Lutie</a> — Agence Google Ads & Meta Ads</p>
        </footer>

      </div>
    </div>
  )
}
