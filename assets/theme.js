/* Tiny Beans theme v3 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const isPhone = () => window.matchMedia('(max-width: 700px)').matches;

  /* ---------- Header menu ---------- */
  function initMenu() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!header || !toggle || !menu) return;
    const set = (open) => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    };
    toggle.addEventListener('click', () => set(menu.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
    document.addEventListener('click', (e) => { if (!menu.hidden && !e.target.closest('.site-header')) set(false); });

    // Switch to the menu button whenever the links don't fit, whatever the screen width or number of links.
    const nav = header.querySelector('.desktop-nav');
    const mark = header.querySelector('.wordmark');
    function fit() {
      header.classList.add('is-measuring');
      header.classList.remove('is-collapsed');
      let collapse = false;
      if (nav && getComputedStyle(nav).display !== 'none') {
        const overflow = nav.scrollWidth > nav.clientWidth + 1;
        const tooClose = mark && (mark.getBoundingClientRect().left - nav.getBoundingClientRect().right) < 24 &&
          nav.lastElementChild && nav.lastElementChild.getBoundingClientRect().right > mark.getBoundingClientRect().left - 24;
        collapse = overflow || !!tooClose;
      }
      header.classList.toggle('is-collapsed', collapse);
      header.classList.remove('is-measuring');
      if (!collapse && getComputedStyle(toggle).display === 'none') set(false);
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
      const bar = document.querySelector('.announcement');
      document.documentElement.style.setProperty('--announcement-h', (bar ? bar.offsetHeight : 0) + 'px');
    }
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(document.documentElement);
    else window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  /* ---------- Floating contact ---------- */
  function initContact() {
    const toggle = document.querySelector('[data-contact-toggle]');
    const panel = document.querySelector('[data-contact-panel]');
    if (!toggle || !panel) return;
    const set = (open) => { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); };
    toggle.addEventListener('click', () => set(panel.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { set(false); toggle.focus(); } });
    document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('.floating-contact')) set(false); });
  }

  /* ---------- Hero: optional video, then rotating images ---------- */
  function mountHero(root) {
    if (root.dataset.heroMounted) return;
    root.dataset.heroMounted = '1';

    // Pick the right video for this screen. Skip on data saver or reduced motion.
    let video = null;
    if (!reduceMotion && !saveData) {
      const desktop = root.querySelector('template[data-hero-video="desktop"]');
      const mobile = root.querySelector('template[data-hero-video="mobile"]');
      const chosen = isPhone() ? mobile : (desktop || mobile);
      if (chosen) {
        root.querySelector('.hero-media').prepend(chosen.content.cloneNode(true));
        video = root.querySelector('video');
      }
    }

    const slides = Array.from(root.querySelectorAll('[data-hero-image]'));
    const dots = root.querySelector('[data-hero-dots]');
    let offset = video ? 1 : 0;
    let total = offset + slides.length;
    const delay = Math.max(3000, Number(root.dataset.imageTime) || 5000);
    let timer = null;
    let active = 0;

    function buildDots() {
      if (!dots) return;
      dots.innerHTML = '';
      if (total < 2) return;
      for (let i = 0; i < total; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', i === 0 && video ? 'Play video' : 'Show image ' + (i - offset + 1));
        b.addEventListener('click', () => select(i));
        dots.appendChild(b);
      }
    }

    function schedule() {
      clearTimeout(timer);
      if (reduceMotion || document.hidden || active < offset || slides.length < 2) return;
      const next = active + 1 < total ? active + 1 : offset;
      timer = setTimeout(() => select(next), delay);
    }

    function select(index) {
      clearTimeout(timer);
      active = index;
      slides.forEach((s, i) => s.classList.toggle('is-active', index === i + offset));
      if (video) {
        if (index === 0) {
          video.style.opacity = '1';
          video.currentTime = 0;
          const p = video.play();
          if (p && p.catch) p.catch(() => { if (slides.length) select(1); });
        } else {
          video.pause();
          video.style.opacity = '0';
        }
      }
      if (dots) Array.from(dots.children).forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
      schedule();
    }

    if (video) {
      video.addEventListener('ended', () => { if (slides.length) select(1); });
      video.addEventListener('error', () => {
        video.remove(); video = null; offset = 0; total = slides.length;
        buildDots(); if (slides.length) select(0);
      });
    }
    buildDots();
    if (total) select(0);

    document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else schedule(); });
  }

  function initHeroes(scope) {
    (scope || document).querySelectorAll('[data-hero-section]').forEach(mountHero);
  }

  /* ---------- Product page ---------- */
  function fill(str, map) {
    return Object.keys(map).reduce((acc, k) => acc.split(k).join(map[k]), str || '');
  }
  function listJoin(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(', ') + ' & ' + items[items.length - 1];
  }

  function initProduct(root) {
    if (!root || root.dataset.productMounted) return;
    root.dataset.productMounted = '1';

    let variants = [];
    let strings = { add: 'Add to bag', soldOut: 'Sold out', unavailable: 'Unavailable', soldOutLabel: 'sold out' };
    try { variants = JSON.parse(root.querySelector('[data-variants-json]').textContent); } catch (e) {}
    try { strings = Object.assign(strings, JSON.parse(root.querySelector('[data-product-strings]').textContent)); } catch (e) {}

    const form = root.querySelector('form[action*="/cart/add"]') || root.querySelector('.tb-product-form');
    const select = root.querySelector('[data-variant-select]');
    const addBtn = root.querySelector('[data-add-button]');
    const price = root.querySelector('[data-price]');
    const compare = root.querySelector('[data-compare-price]');
    const saleBadge = root.querySelector('[data-sale-badge]');
    const note = root.querySelector('[data-variant-note]');
    const mainPhoto = root.querySelector('.tb-main-photo');
    const thumbs = Array.from(root.querySelectorAll('[data-gallery-thumb]'));
    const radios = Array.from(root.querySelectorAll('[data-option-position]'));
    const positions = Array.from(new Set(radios.map((r) => Number(r.dataset.optionPosition)))).sort((a, b) => a - b);
    const singleOption = positions.length === 1;
    const sticky = root.querySelector('[data-sticky-buy]');
    const stickyAdd = root.querySelector('[data-sticky-add]');
    const stickyPrice = root.querySelector('[data-sticky-price]');
    const stickyVariant = root.querySelector('[data-sticky-variant]');
    let lastChanged = positions[positions.length - 1] || 1;

    function showMedia(thumb) {
      if (!thumb || !mainPhoto) return;
      mainPhoto.srcset = thumb.dataset.srcset || '';
      mainPhoto.src = thumb.dataset.image;
      mainPhoto.alt = thumb.dataset.alt || '';
      thumbs.forEach((t) => t.removeAttribute('aria-current'));
      thumb.setAttribute('aria-current', 'true');
    }
    thumbs.forEach((t) => t.addEventListener('click', () => showMedia(t)));

    const chosen = () => positions.map((p) => {
      const r = root.querySelector('[data-option-position="' + p + '"]:checked');
      return r ? r.value : null;
    });

    // Mark values that have no available variant with the other current choices.
    // One option (e.g. size only): sold-out values are disabled.
    // Several options: they stay selectable, because another colour may have that size.
    function markAvailability(current) {
      radios.forEach((r) => {
        const idx = positions.indexOf(Number(r.dataset.optionPosition));
        const test = current.slice();
        test[idx] = r.value;
        const ok = variants.some((v) => v.available && v.options.every((o, i) => test[i] === null || o === test[i]));
        const pill = r.closest('.tb-option-pill');
        pill.classList.toggle('is-unavailable', !ok);
        const sr = pill.querySelector('[data-soldout-sr]');
        if (sr) sr.textContent = ok ? '' : ', ' + strings.soldOutLabel;
        if (singleOption) r.disabled = !ok && !r.checked;
      });
      positions.forEach((p, i) => {
        const label = root.querySelector('[data-option-current="' + p + '"]');
        if (label) label.textContent = current[i] || '';
      });
    }

    function explain(variant, current) {
      if (!note) return;
      let text = '';
      if (!variant) {
        text = strings.unavailableCombo || '';
      } else if (!variant.available) {
        const idx = positions.indexOf(lastChanged);
        const value = current[idx];
        const others = current.filter((_, i) => i !== idx);
        if (!others.length) {
          text = fill(strings.soldOutValue, { __V__: value });
        } else {
          text = fill(strings.soldOutIn, { __V__: value, __O__: others.join(' / ') });
          if (positions.length === 2) {
            const otherIdx = idx === 0 ? 1 : 0;
            const alternatives = variants
              .filter((v) => v.available && v.options[idx] === value)
              .map((v) => v.options[otherIdx]);
            if (alternatives.length) text += ' ' + fill(strings.availableIn, { __L__: listJoin(alternatives) });
          }
        }
      }
      note.textContent = text;
      note.hidden = !text;
    }

    const lowStock = root.querySelector('[data-low-stock]');
    function showLowStock(variant) {
      if (!lowStock) return;
      const n = variant && variant.available ? variant.low : null;
      if (!n) { lowStock.hidden = true; lowStock.textContent = ''; return; }
      const tpl = strings.singleVariant
        ? (n === 1 ? strings.lowOne : strings.lowOther)
        : (n === 1 ? strings.lowVariantOne : strings.lowVariantOther);
      lowStock.textContent = fill(tpl, { __N__: String(n), __V__: variant.options.join(' / ') });
      lowStock.hidden = false;
    }

    function apply(variant, updateUrl, current) {
      const ok = !!(variant && variant.available);
      const label = !variant ? strings.unavailable : (variant.available ? strings.add : strings.soldOut);
      addBtn.disabled = !ok;
      addBtn.textContent = label;
      if (stickyAdd) { stickyAdd.disabled = !ok; stickyAdd.textContent = label; }
      explain(variant, current || chosen());
      showLowStock(variant);
      if (!variant) return;
      if (select) select.value = String(variant.id);
      if (price) price.textContent = variant.price;
      if (stickyPrice) stickyPrice.textContent = variant.price;
      if (stickyVariant) stickyVariant.textContent = variant.options.join(' / ');
      if (compare) { compare.hidden = !variant.compare; compare.textContent = variant.compare || ''; }
      if (saleBadge) saleBadge.hidden = !variant.compare;
      if (variant.media) {
        const t = thumbs.find((x) => Number(x.dataset.mediaId) === variant.media);
        if (t) showMedia(t);
      }
      if (updateUrl && /^https?:$/.test(location.protocol)) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('variant', variant.id);
          history.replaceState({}, '', url.toString());
        } catch (e) {}
      }
    }

    function onOptionChange(e) {
      if (e && e.target) lastChanged = Number(e.target.dataset.optionPosition);
      const current = chosen();
      markAvailability(current);
      apply(variants.find((v) => v.options.every((o, i) => o === current[i])), true, current);
    }

    radios.forEach((r) => r.addEventListener('change', onOptionChange));
    if (select) select.addEventListener('change', () => apply(variants.find((v) => String(v.id) === select.value), true));
    if (radios.length) {
      const current = chosen();
      markAvailability(current);
      explain(variants.find((v) => v.options.every((o, i) => o === current[i])), current);
    }

    // Quantity
    const qty = root.querySelector('[data-qty]');
    if (qty) {
      const minus = root.querySelector('[data-qty-minus]');
      const plus = root.querySelector('[data-qty-plus]');
      if (minus) minus.addEventListener('click', () => { qty.value = Math.max(1, (Number(qty.value) || 1) - 1); });
      if (plus) plus.addEventListener('click', () => { qty.value = Math.min(Number(qty.max) || 99, (Number(qty.value) || 1) + 1); });
    }

    // Sticky add-to-bag bar on phones, once the main button scrolls away
    if (sticky && 'IntersectionObserver' in window) {
      const buyRow = root.querySelector('.tb-buy-row');
      new IntersectionObserver(([entry]) => {
        const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        sticky.classList.toggle('is-visible', show);
        sticky.setAttribute('aria-hidden', String(!show));
        if (stickyAdd) stickyAdd.tabIndex = show ? 0 : -1;
        document.body.classList.toggle('has-bottom-bar', show);
      }).observe(buyRow);
      if (stickyAdd) stickyAdd.addEventListener('click', () => {
        if (addBtn.disabled) {
          root.querySelector('.tb-option-set, .tb-buy-row').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          return;
        }
        if (form && form.requestSubmit) form.requestSubmit(addBtn); else addBtn.click();
      });
    }

    // Size guide pop-up
    const dialog = root.querySelector('[data-size-guide]');
    root.querySelectorAll('[data-open-size-guide]').forEach((btn) => btn.addEventListener('click', () => {
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
      else {
        const acc = Array.from(root.querySelectorAll('.tb-accordions details'))[1];
        if (acc) { acc.open = true; acc.scrollIntoView({ block: 'center' }); }
      }
    }));
    if (dialog) {
      dialog.querySelectorAll('[data-close-dialog]').forEach((b) => b.addEventListener('click', () => dialog.close()));
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    }
  }

  /* ---------- Product cards: second photo on hover (mouse only) ----------
     The photo is only requested on devices that can hover, as a card nears the screen.
     Phones never download it. */
  function initCardHover(scope) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const imgs = Array.from((scope || document).querySelectorAll('img.tb-card-hover[data-src]'));
    if (!imgs.length) return;
    const load = (img) => {
      if (!img.dataset.src) return;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      delete img.dataset.src; delete img.dataset.srcset;
    };
    if (!('IntersectionObserver' in window)) { imgs.forEach(load); return; }
    // Watch the card's image frame, not the hidden photo (hidden elements never report as visible)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const img = en.target.querySelector('img.tb-card-hover[data-src]');
        if (img) load(img);
        io.unobserve(en.target);
      });
    }, { rootMargin: '300px 0px' });
    imgs.forEach((img) => io.observe(img.parentElement));
  }

  /* ---------- Floating product video ----------
     A small silent clip floats in a corner; tapping it opens the full video with sound.
     No autoplay on data saver or reduced motion (a poster with a play icon shows instead).
     Hiding it keeps it hidden for the rest of the visit. */
  function initFloatVideo(root) {
    const wrap = root.querySelector('[data-float-video]');
    if (!wrap || wrap.dataset.mounted) return;
    wrap.dataset.mounted = '1';
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('tb-float-video-hidden') === '1'; } catch (e) {}
    if (dismissed) { wrap.remove(); return; }

    const clip = wrap.querySelector('.tb-float-clip');
    const openBtn = wrap.querySelector('[data-float-open]');
    const closeBtn = wrap.querySelector('[data-float-close]');
    const dialog = root.querySelector('[data-float-dialog]');
    const full = dialog ? dialog.querySelector('[data-float-full]') : null;
    const autoplay = !reduceMotion && !saveData;
    let playing = false;

    const playClip = () => {
      if (!autoplay || !clip) return;
      if (!clip.getAttribute('src')) clip.src = wrap.dataset.small;
      const p = clip.play();
      if (p && p.then) p.then(() => { playing = true; wrap.classList.add('is-playing'); }).catch(() => {});
    };
    const pauseClip = () => { if (clip) clip.pause(); };

    // Appear shortly after the page has loaded, so it never slows down the first view
    setTimeout(() => {
      wrap.hidden = false;
      requestAnimationFrame(() => wrap.classList.add('is-in'));
      if (autoplay) playClip(); else wrap.classList.add('is-static');
    }, 1200);

    // Fade out once the shopper has scrolled past the product (reviews, footer), back in on the way up
    let away = false;
    const layout = root.querySelector('.tb-product-layout');
    if (layout && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        away = !en.isIntersecting && en.boundingClientRect.top < 0;
        wrap.classList.toggle('is-away', away);
        if (away) pauseClip(); else if (playing && !(dialog && dialog.open)) playClip();
      }, { rootMargin: '-35% 0px 0px 0px' }).observe(layout);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseClip();
      else if (playing && !away && !(dialog && dialog.open)) playClip();
    });

    openBtn.addEventListener('click', () => {
      pauseClip();
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        if (full) {
          if (!full.dataset.loaded) {
            // Sources are added on first open, so the full video never downloads unless someone asks for it
            if (full.dataset.hls) { const h = document.createElement('source'); h.src = full.dataset.hls; h.type = 'application/x-mpegURL'; full.appendChild(h); }
            const m = document.createElement('source'); m.src = full.dataset.mp4; m.type = 'video/mp4'; full.appendChild(m);
            full.dataset.loaded = '1';
            full.load();
          }
          full.muted = false;
          try { full.currentTime = 0; } catch (e) {}
          const p = full.play();
          if (p && p.catch) p.catch(() => {});
        }
      } else if (full) {
        if (full.dataset.mp4) window.open(full.dataset.mp4, '_blank', 'noopener');
      }
    });

    if (dialog) {
      dialog.querySelector('[data-float-dialog-close]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => {
        if (full) full.pause();
        if (playing && !away) playClip();
        openBtn.focus({ preventScroll: true });
      });
    }

    closeBtn.addEventListener('click', () => {
      pauseClip();
      if (clip) { clip.removeAttribute('src'); clip.load(); }
      wrap.classList.remove('is-in');
      setTimeout(() => wrap.remove(), 250);
      try { sessionStorage.setItem('tb-float-video-hidden', '1'); } catch (e) {}
    });
  }

  /* ---------- Collection filters ----------
     Desktop: filters apply as soon as they're tapped.
     Phones: filters open in a bottom sheet; "Show N pieces" applies them. */
  function initFilters() {
    document.querySelectorAll('[data-filter-form]').forEach((form) => {
      const panel = form.querySelector('[data-filter-panel]');
      const backdrop = form.querySelector('[data-filter-backdrop]');
      const openBtn = form.querySelector('[data-filter-open]');
      const closeBtn = form.querySelector('[data-filter-close]');
      const applyBtn = form.querySelector('[data-filter-apply]');
      const sheetMode = () => window.matchMedia('(max-width: 800px)').matches;
      let lastFocus = null;
      let countRequest = 0;

      const setOpen = (open) => {
        if (!panel) return;
        panel.classList.toggle('is-open', open);
        if (backdrop) backdrop.classList.toggle('is-open', open);
        document.body.classList.toggle('is-locked', open);
        if (open) {
          panel.setAttribute('role', 'dialog');
          panel.setAttribute('aria-modal', 'true');
        } else {
          panel.removeAttribute('role');
          panel.removeAttribute('aria-modal');
        }
        if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
        if (open) {
          lastFocus = document.activeElement;
          const first = panel.querySelector('input:not([disabled]), button');
          if (first) setTimeout(() => first.focus(), 60);
        } else if (lastFocus) {
          lastFocus.focus({ preventScroll: true });
        }
      };

      function updateCount() {
        if (!applyBtn || !form.dataset.sectionId) return;
        const id = ++countRequest;
        const params = new URLSearchParams(new FormData(form));
        params.set('section_id', form.dataset.sectionId);
        fetch(form.action + '?' + params.toString(), { credentials: 'same-origin' })
          .then((r) => r.text())
          .then((html) => {
            if (id !== countRequest) return;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const el = doc.querySelector('[data-count]');
            if (!el) return;
            const n = Number(el.dataset.count);
            const tpl = n === 1 ? form.dataset.showOne : form.dataset.showOther;
            if (tpl) applyBtn.textContent = tpl.split('__N__').join(n);
          })
          .catch(() => {});
      }

      form.querySelectorAll('input[type="checkbox"]').forEach((el) => {
        el.addEventListener('change', () => {
          if (sheetMode() && panel && panel.classList.contains('is-open')) updateCount();
          else form.submit();
        });
      });
      form.querySelectorAll('[data-auto-submit]').forEach((el) => el.addEventListener('change', () => form.submit()));

      if (openBtn) openBtn.addEventListener('click', () => setOpen(true));
      if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
      if (backdrop) backdrop.addEventListener('click', () => setOpen(false));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel && panel.classList.contains('is-open')) setOpen(false); });
      window.matchMedia('(max-width: 800px)').addEventListener('change', (e) => { if (!e.matches) setOpen(false); });

      // Shadow under the sticky bar once it sticks
      const toolbar = form.querySelector('[data-collection-toolbar]');
      if (toolbar && 'IntersectionObserver' in window) {
        const sentinel = document.createElement('div');
        form.before(sentinel);
        new IntersectionObserver(([en]) => toolbar.classList.toggle('is-stuck', !en.isIntersecting && en.boundingClientRect.top < 0)).observe(sentinel);
      }
    });
  }

  /* ---------- Cart: + and − buttons update the bag ---------- */
  function initCart() {
    const form = document.querySelector('[data-cart-form]');
    if (!form) return;
    if (document.querySelector('[data-cart-bar]')) document.body.classList.add('has-cart-bar');
    const updateBtn = form.querySelector('button[name="update"]');
    let timer = null;
    const submitSoon = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (form.requestSubmit && updateBtn) { form.requestSubmit(updateBtn); return; }
        const h = document.createElement('input');
        h.type = 'hidden'; h.name = 'update'; h.value = '1';
        form.appendChild(h); form.submit();
      }, 600);
    };
    form.querySelectorAll('[data-cart-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        input.value = Math.max(0, (Number(input.value) || 0) + Number(btn.dataset.cartStep));
        submitSoon();
      });
    });
    form.querySelectorAll('input[name="updates[]"]').forEach((i) => i.addEventListener('change', submitSoon));
  }

  /* ---------- Start ---------- */
  function init() {
    initMenu();
    initContact();
    initHeroes();
    document.querySelectorAll('[data-product-section]').forEach(initProduct);
    document.querySelectorAll('[data-product-section]').forEach(initFloatVideo);
    initCardHover();
    initFilters();
    initCart();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Theme editor support
  document.addEventListener('shopify:section:load', (e) => {
    initHeroes(e.target);
    e.target.querySelectorAll('[data-product-section]').forEach(initProduct);
    e.target.querySelectorAll('[data-product-section]').forEach(initFloatVideo);
    initCardHover(e.target);
  });
})();
