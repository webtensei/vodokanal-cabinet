import VConsole from 'vconsole';

export function useVcosole() {
  if (window.location.href.includes('#vc')) {
    return new VConsole({ theme: 'dark', maxLogNumber: 1000 });
  }
}
