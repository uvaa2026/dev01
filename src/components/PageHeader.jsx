// Shared page-level header used by every marketing page other than Home
// (Home keeps its own full-bleed hero). Keeps the eyebrow/title/lead
// treatment identical across pages — see .section-head / .section-head h1
// in index.css.
export default function PageHeader({ eyebrow, title, lead }) {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          {eyebrow && (
            <span className="eyebrow"><span className="dot"></span> {eyebrow}</span>
          )}
          <h1>{title}</h1>
          {lead && <p>{lead}</p>}
        </div>
      </div>
    </section>
  )
}
