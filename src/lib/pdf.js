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

// Renders `element` to a multi-page A4 PDF and triggers a download named
// `filename`. A fixed, solid background colour is passed to html2canvas
// rather than relying on the page's own fixed-position backdrop image and
// semi-transparent panels — html2canvas doesn't reliably capture
// `position: fixed` layers or `backdrop-filter` blur, and a flat page
// colour is what you want in a document meant to be read/printed anyway.
export async function downloadElementAsPdf(element, filename) {
  await ensurePdfLibs()

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

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}
