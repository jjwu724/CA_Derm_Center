fetch('./shared.html')
  .then(response => response.text())
  .then(data => {
    const templateDoc = new DOMParser().parseFromString(data, 'text/html');
    const templateHead = templateDoc.querySelector('template#head').content
    document.head.appendChild(templateHead.cloneNode(true));
    const templateHeader = templateDoc.querySelector('template#header').content;
    document.getElementById('header-shared').appendChild(templateHeader.cloneNode(true));
    const templateNav1 = templateDoc.querySelector('template#nav1').content;
    document.getElementById('nav-shared1').appendChild(templateNav1.cloneNode(true));
    const templateNav2 = templateDoc.querySelector('template#nav2').content;
    document.getElementById('nav-shared2').appendChild(templateNav2.cloneNode(true));
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            link.parentElement.classList.add('no-pip');
        }
    });
    const templateContact = templateDoc.querySelector('template#contact').content
    document.getElementById('contact-shared').appendChild(templateContact.cloneNode(true));
    const computedStyle = getComputedStyle(document.documentElement);
    const areaCode = computedStyle.getPropertyValue('--area-code').slice(1, -1);
    const phoneNumber = computedStyle.getPropertyValue('--phone-number').slice(1, -1);
    const fullPhoneNumber = areaCode + phoneNumber;
    const email = computedStyle.getPropertyValue('--email').slice(1, -1);
    const address1 = computedStyle.getPropertyValue('--address-1').slice(1, -1);
    const address2 = computedStyle.getPropertyValue('--address-2').slice(1, -1);
    const webUrl = computedStyle.getPropertyValue('--webUrl').slice(1, -1);
    let i;
    let l;
    const phoneLinks = document.getElementsByClassName('phoneLink');
    l = phoneLinks.length;
    for (i=0; i<l; i++) {phoneLinks[i].href = "tel:" + fullPhoneNumber;}
    const areaCodeSpans = document.getElementsByClassName('areaCode');
    l = areaCodeSpans.length;
    for (i=0; i<l; i++) {areaCodeSpans[i].textContent = areaCode;}
    const phoneNumberSpans = document.getElementsByClassName('phoneNumber');
    l = phoneNumberSpans.length;
    for (i=0; i<l; i++) {phoneNumberSpans[i].textContent = phoneNumber;}
    const emailSpans = document.getElementsByClassName('email');
    l = emailSpans.length;
    for (i=0; i<l; i++) {emailSpans[i].textContent = email;}
    const emailLinks = document.getElementsByClassName('emailLink');
    l = emailLinks.length;
    for (i=0; i<l; i++) {emailLinks[i].href = `mailto:${email}`;}
    const address1Spans = document.getElementsByClassName('address-1');
    l = address1Spans.length;
    for (i=0; i<l; i++) {address1Spans[i].textContent = address1;}
    const address2Spans = document.getElementsByClassName('address-2');
    l = address2Spans.length;
    for (i=0; i<l; i++) {address2Spans[i].textContent = address2;}
    const webUrlSpans = document.getElementsByClassName('webUrl');
    l = webUrlSpans.length;
    for (i=0; i<l; i++) {webUrlSpans[i].textContent = webUrl;}
    const webUrlLinks = document.getElementsByClassName('webUrlLink');
    l = webUrlLinks.length;
    for (i=0; i<l; i++) {webUrlLinks[i].href = `https://${webUrl}`;}
    observeNav();
  })
  .catch(error => console.error('Error loading template:', error));

function observeNav() {
  const shrinkingSpacer = document.getElementById("shrinking-spacer");
  const growingWrapper = document.getElementById("growing-wrapper");
  const nav2 = document.getElementById("nav-shared2");
  const ul1 = document.getElementById('ul1');
  const ul2 = document.getElementById('ul2');
  let wrapperMinWidth;
  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      const target = entry.target;
      const width = entry.contentRect.width;
      if (target === shrinkingSpacer && width === 0) {
        observer.unobserve(shrinkingSpacer);
        nav2.style.display = 'flex';
        const allLi = ul1.querySelectorAll('li');
        const liToMove = Array.from(allLi).slice(4);
        liToMove.forEach(li => ul2.appendChild(li));
        wrapperMinWidth = growingWrapper.offsetWidth + 1;
        requestAnimationFrame(() => {observer.observe(growingWrapper);});
      } else if (target === growingWrapper && width > wrapperMinWidth) {
        observer.unobserve(growingWrapper);
        nav2.style.display = 'none';
        const allLi2 = ul2.querySelectorAll('li');
        allLi2.forEach(li => ul1.appendChild(li));
        requestAnimationFrame(() => {observer.observe(shrinkingSpacer);});
      }
    }
  });
  observer.observe(shrinkingSpacer);
}