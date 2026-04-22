export {};

declare global {
  interface Window {
    selectBundleAndScroll?: () => void;
  }
}
