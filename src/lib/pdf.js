// Client-side "Download PDF" for the report page.
//
// "Print / Save as PDF" (the existing button) just calls window.print(),
// which opens the browser's print dialog — the respondent still has to
// pick "Save as PDF" themselves, and the result depends on that browser's
// own print renderer. This produces an actual .pdf file and downloads it
// directly, no dialog involved (Issue_Set_2, item 12).
//
// html2canvas + jsPDF are not bundled — they're lazy-loaded from cdnjs the
// first time a respondent clicks "Download PDF", so nobody pays for this
// on every page load, and no new build-time dependency is needed.
const HTML2CANVAS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
const JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Could not load ${src}`))
    document.head.appendChild(script)
  })
}

async function ensurePdfLibs() {
  if (!window.html2canvas) await loadScript(HTML2CANVAS_URL)
  if (!window.jspdf) await loadScript(JSPDF_URL)
  if (!window.html2canvas || !window.jspdf) {
    throw new Error('PDF libraries failed to load')
  }
}

// Content blocks a page break should never land inside. html2canvas renders
// the whole report as one tall image and jsPDF used to slice it at a fixed
// pixel height per page, with no awareness of what was underneath that
// line — so a heading or a line of a paragraph could land exactly on a
// slice boundary and come out visibly cut in two, with the line above and
// below it both rendered half-height (reported: the "Anuvigna, Pressure
// Non-Reactivity" paragraph splitting mid-sentence across a page break).
// Keeping this selector in sync with the @media print break-inside: avoid
// rules in index.css is good practice but not required for correctness —
// this walks the live DOM itself rather than relying on the print
// stylesheet, which @media print doesn't even apply to this image-based
// path.
const UNSPLITTABLE_SELECTOR = [
  'h2', 'h3', 'p', 'li', 'blockquote',
  '.orientation-dominance-block', '.dqi-callout', '.pattern-text-block',
  '.capacity-line-row', '.capacity-bar-row', '.report-margin-note',
].join(', ')

// Renders `element` to a multi-page A4 PDF and triggers a download named
// `filename`. A fixed, solid background colour is passed to html2canvas
// rather than relying on the page's own fixed-position backdrop image and
// semi-transparent panels — html2canvas doesn't reliably capture
// `position: fixed` layers or `backdrop-filter` blur, and a flat page
// colour is what you want in a document meant to be read/printed anyway.
export async function downloadElementAsPdf(element, filename) {
  await ensurePdfLibs()

  // Measured before the page is torn down to an image — these are CSS-pixel
  // offsets relative to `element`'s own top, which stay valid regardless of
  // how far the page happens to be scrolled.
  const elementRect = element.getBoundingClientRect()

  const canvas = await window.html2canvas(element, {
    backgroundColor: '#0d1220',
    scale: Math.min(2, window.devicePixelRatio || 1.5),
    useCORS: true,
  })

  const { jsPDF } = window.jspdf
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const imgData = canvas.toDataURL('image/jpeg', 0.92)

  // Convert each unsplittable block's live CSS-pixel extent into the same
  // top-to-bottom point space as imgHeight (i.e. "where it ends up in the
  // rendered image"), so it can be compared against candidate page-break
  // positions below.
  const scaleToPt = imgWidth / (elementRect.width || imgWidth)
  const blocks = Array.from(element.querySelectorAll(UNSPLITTABLE_SELECTOR))
    .map((el) => {
      const rect = el.getBoundingClientRect()
      return {
        top: (rect.top - elementRect.top) * scaleToPt,
        bottom: (rect.bottom - elementRect.top) * scaleToPt,
      }
    })
    // A block taller than a full page can never be kept whole no matter
    // where the boundary falls — leave those out so they can't force an
    // unmovable (and therefore infinitely-looping) boundary.
    .filter((b) => b.bottom - b.top < pageHeight)
    .sort((a, b) => a.top - b.top)

  // Given a candidate boundary (in image-point space), pull it back to the
  // top of whichever block it would otherwise cut through.
  function clearOfBlocks(candidate) {
    for (const b of blocks) {
      if (candidate > b.top && candidate < b.bottom) return b.top
    }
    return candidate
  }

  let pageTop = 0 // how far into the full image (pt) the current page starts
  let page = 0
  while (pageTop < imgHeight) {
    let pageBottom = Math.min(imgHeight, pageTop + pageHeight)
    const adjusted = clearOfBlocks(pageBottom)
    // Guard against an adjustment that makes no progress (shouldn't happen
    // given the height filter above, but never loop forever over it).
    pageBottom = adjusted > pageTop ? adjusted : pageBottom

    if (page > 0) pdf.addPage()
    // jsPDF draws the full image every time and the page itself clips
    // whatever falls outside its bounds — so "showing" just this slice is
    // simply a matter of shifting the whole image up by pageTop before
    // drawing, same technique the previous fixed-height version used.
    pdf.addImage(imgData, 'JPEG', 0, -pageTop, imgWidth, imgHeight)

    pageTop = pageBottom
    page += 1
  }

  pdf.save(filename)
}
