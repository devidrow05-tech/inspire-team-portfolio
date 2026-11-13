import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    if (property) element.setAttribute('property', name);
    else element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export const SeoManager: React.FC = () => {
  const { config } = useApp();
  const { pathname } = useLocation();

  useEffect(() => {
    const pageKey = pathname === '/' ? 'home'
      : pathname.startsWith('/projects') ? 'projects'
      : pathname.startsWith('/team') ? 'team'
      : pathname.startsWith('/about') ? 'about'
      : pathname.startsWith('/contact') ? 'contact'
      : null;
    const page = pageKey ? config.seo_pages?.[pageKey] : undefined;
    const title = page?.title || config.seo_default_title || config.site_name;
    const description = page?.description || config.seo_default_description || config.site_tagline;
    const image = ('og_image' in (page || {}) ? page?.og_image : '') || config.seo_default_og_image || '';

    document.title = title;
    setMeta('description', description);
    setMeta('og:type', 'website', true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', window.location.href, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (image) {
      setMeta('og:image', image, true);
      setMeta('twitter:image', image);
    }

    if (config.favicon_url) {
      let favicon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = config.favicon_url;
    }

    if (config.google_search_console_code) {
      setMeta('google-site-verification', config.google_search_console_code);
    }

    const measurementId = config.google_analytics_id?.trim();
    if (measurementId && /^G-[A-Z0-9]+$/i.test(measurementId) && !document.getElementById('inspire-ga-script')) {
      const script = document.createElement('script');
      script.id = 'inspire-ga-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
      const inline = document.createElement('script');
      inline.id = 'inspire-ga-init';
      inline.text = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}');`;
      document.head.appendChild(inline);
    }
  }, [config, pathname]);

  return null;
};
