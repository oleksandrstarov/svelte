<div class="w-screen h-screen flex justify-center items-center">
  <div class="loader bg-primary-700 w-12 h-12 rounded-full p-2 animate-spin"></div>
</div>

<style>
  .loader {
    aspect-ratio: 1;
    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
  }
</style>
