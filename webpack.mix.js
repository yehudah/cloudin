let mix = require('laravel-mix');
mix.options({
    legacyNodePolyfills: true
});
mix.js('src/script.js', 'dist').setPublicPath('dist');
