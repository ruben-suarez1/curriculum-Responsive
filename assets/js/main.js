/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    // Validate that variables exist
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            const isOpen = nav.classList.toggle('show-menu')
            toggle.setAttribute('aria-expanded', String(isOpen))
            toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    const navToggle = document.getElementById('nav-toggle')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
    navToggle.setAttribute('aria-expanded', 'false')
    navToggle.setAttribute('aria-label', 'Abrir menú')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id')
        const sectionLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (sectionLink) {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                sectionLink.classList.add('active-link')
            }else{
                sectionLink.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== SHOW SCROLL TOP ====================*/ 
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 200) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'
const updateThemeState = () => themeButton.setAttribute('aria-pressed', String(getCurrentTheme() === 'dark'))

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}
updateThemeState()

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    updateThemeState()
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== GENERATE VISUAL PDF ====================*/
const areaCv = document.getElementById('area-cv')
const resumeButton = document.getElementById('resume-button')
let html2PdfLoadPromise

const loadHtml2Pdf = () => {
    if (window.html2pdf) return Promise.resolve()
    if (html2PdfLoadPromise) return html2PdfLoadPromise

    html2PdfLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'assets/js/html2pdf.bundle.min.js'
        script.onload = () => {
            if (window.html2pdf) {
                resolve()
            } else {
                script.remove()
                html2PdfLoadPromise = undefined
                reject(new Error('html2pdf no está disponible'))
            }
        }
        script.onerror = () => {
            script.remove()
            html2PdfLoadPromise = undefined
            reject(new Error('No se pudo cargar html2pdf'))
        }
        document.head.appendChild(script)
    })

    return html2PdfLoadPromise
}

const pdfOptions = {
    margin: 0,
    filename: 'RubenSuarez-CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 4 },
    jsPDF: { format: 'legal', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' }
}

resumeButton.addEventListener('click', async () => {
    if (resumeButton.disabled) return

    resumeButton.disabled = true
    resumeButton.setAttribute('aria-busy', 'true')

    try {
        await loadHtml2Pdf()
        document.body.classList.add('scale-cv')
        await window.html2pdf().set(pdfOptions).from(areaCv).save()
    } catch (error) {
        console.error('No se pudo generar el PDF visual.', error)
    } finally {
        document.body.classList.remove('scale-cv')
        resumeButton.disabled = false
        resumeButton.removeAttribute('aria-busy')
    }
})

