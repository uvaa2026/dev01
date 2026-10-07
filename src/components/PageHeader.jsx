// Shared page-level header used by every marketing page other than Home
// (Home keeps its own full-bleed hero). Same editorial treatment as the
// Home hero and the Why UVAA page — small-caps tracked label, serif
// "big statement" headline — so every page opens in the same visual
// language instead of the old pill-badge eyebrow banner.
export default function PageHeader({ eyebrow, title, lead }) {
  return (
    <section className="editorial-hero">
      <div className="container">
        {eyebrow && <p className="editorial-label center">{eyebrow}</p>}
        <h1 className="editorial-statement">{title}</h1>
        {lead && <p className="editorial-lead">{lead}</p>}
      </div>
    </section>
  )
}
