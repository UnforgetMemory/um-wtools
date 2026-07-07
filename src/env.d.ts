/// <reference types="vite/client" />

// Allow importing `.vue` files as Vue components with full type inference.
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
