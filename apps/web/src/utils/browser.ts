'use client';

export const getBrowserInfo = () => {
  if (typeof navigator === 'undefined') {
    return {
      isSafari: false,
      isFirefox: false,
      isOpera: false,
      isChrome: false,
    };
  }

  const ua = navigator.userAgent;

  return {
    isSafari: /Safari/.test(ua) && !/Chrome|Chromium/.test(ua),
    isFirefox: /Firefox/.test(ua),
    isOpera: /OPR/.test(ua),
    isChrome: /Chrome|Chromium/.test(ua),
  };
};


export const { isSafari , isChrome, isFirefox, isOpera} = getBrowserInfo();
