'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo?: React.ReactNode;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  initialLoadAnimation?: boolean;
  onNavClick?: (href: string) => void;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#12121a',
  pillColor = '#1e1e2e',
  hoveredPillTextColor = '#6366f1',
  pillTextColor = '#94a3b8',
  initialLoadAnimation = true,
  onNavClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }
        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    document.fonts?.ready.then(layout).catch(() => {});

    const menu = mobileMenuRef.current;
    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0 });

    if (initialLoadAnimation) {
      if (logoRef.current) {
        gsap.from(logoRef.current, { scale: 0, duration: 0.5, ease });
      }
      if (navItemsRef.current) {
        gsap.set(navItemsRef.current, { width: 0, overflow: 'hidden' });
        gsap.to(navItemsRef.current, { width: 'auto', duration: 0.6, ease });
      }
    }

    return () => window.removeEventListener('resize', layout);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      onNavClick?.(href);
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    const next = !isMobileMenuOpen;
    setIsMobileMenuOpen(next);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll<HTMLSpanElement>('.hamburger-line');
      if (next) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (next) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease });
      } else {
        gsap.to(menu, {
          opacity: 0, y: 10, duration: 0.2, ease,
          onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); },
        });
      }
    }
  };

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': pillTextColor,
    '--nav-h': '42px',
    '--pill-pad-x': '18px',
    '--pill-gap': '3px',
  } as React.CSSProperties;

  return (
    <div className={`relative w-full flex justify-center ${className}`} style={cssVars}>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-2" aria-label="Primary">
        {/* Logo pill */}
        {logo && (
          <div
            ref={logoRef}
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--base)' }}
          >
            {logo}
          </div>
        )}

        {/* Nav items */}
        <div
          ref={navItemsRef}
          className="relative flex items-center rounded-full"
          style={{ height: 'var(--nav-h)', background: 'var(--base)' }}
        >
          <ul role="menubar" className="list-none flex items-stretch m-0 h-full" style={{ padding: '3px', gap: 'var(--pill-gap)' }}>
            {items.map((item, i) => (
              <li key={item.href} role="none" className="flex h-full">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={e => handleClick(e, item.href)}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full font-semibold text-[14px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer"
                  style={{
                    background: 'var(--pill-bg)',
                    color: activeHref === item.href ? hoveredPillTextColor : 'var(--pill-text)',
                    paddingLeft: 'var(--pill-pad-x)',
                    paddingRight: 'var(--pill-pad-x)',
                    outline: activeHref === item.href ? `1.5px solid ${hoveredPillTextColor}33` : undefined,
                  }}
                >
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{ background: 'var(--base)', willChange: 'transform' }}
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: 'transform' }}>
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{ color: 'var(--hover-text)', willChange: 'transform, opacity' }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile: logo + hamburger */}
      <div className="md:hidden flex items-center justify-between w-full px-4">
        {logo && (
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--base)' }}
          >
            {logo}
          </div>
        )}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer border-0 p-0"
          style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--base)' }}
        >
          <span className="hamburger-line block w-4 h-0.5 rounded origin-center" style={{ background: pillColor }} />
          <span className="hamburger-line block w-4 h-0.5 rounded origin-center" style={{ background: pillColor }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[calc(var(--nav-h)+8px)] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-[998]"
        style={{ background: 'var(--base)', ...cssVars }}
      >
        <ul className="list-none m-0 flex flex-col" style={{ padding: '3px', gap: '3px' }}>
          {items.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={e => handleClick(e, item.href)}
                className="block py-3 px-5 text-[14px] font-semibold uppercase tracking-wider rounded-[50px] transition-colors duration-200"
                style={{
                  background: activeHref === item.href ? hoveredPillTextColor + '22' : 'var(--pill-bg)',
                  color: activeHref === item.href ? hoveredPillTextColor : 'var(--pill-text)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = hoveredPillTextColor + '22';
                  (e.currentTarget as HTMLAnchorElement).style.color = hoveredPillTextColor;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = activeHref === item.href ? hoveredPillTextColor + '22' : 'var(--pill-bg)';
                  (e.currentTarget as HTMLAnchorElement).style.color = activeHref === item.href ? hoveredPillTextColor : 'var(--pill-text)';
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/resume.pdf"
              download
              className="block py-3 px-5 text-[14px] font-semibold uppercase tracking-wider rounded-[50px] text-center transition-colors duration-200"
              style={{ background: hoveredPillTextColor + '22', color: hoveredPillTextColor }}
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
