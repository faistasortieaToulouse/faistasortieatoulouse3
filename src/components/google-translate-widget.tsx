'use client';

import { useEffect } from 'react';

export function GoogleTranslateWidget() {
  useEffect(() => {
    const addScript = () => {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    if (!(window as any).googleTranslateElementInit) {
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement({
            pageLanguage: 'fr',
            includedLanguages: 'en,es,it,de,pt,ru,ar,tr,zh-CN,ja',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.NONE,
            autoDisplay: false
            }, 'google_translate_element');
        };
    }
    
    if (!document.getElementById('google-translate-script')) {
        addScript();
    }

  }, []);

  return <div id="google_translate_element" className="w-full h-full"></div>;
}
