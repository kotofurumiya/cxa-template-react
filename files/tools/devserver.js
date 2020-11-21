const esbuild = require('esbuild');
const cpx = require('cpx');
const bs = require('browser-sync').create();

let initialBuild;

const build = async () => {
  return esbuild.build({
    entryPoints: ['./src/index.tsx'],
    outfile: `./build/index.js`,
    minify: process.env.NODE_ENV === 'production',
    incremental: true,
    bundle: true,
    sourcemap: process.env.NODE_ENV === 'development',
    define: {
      'process.env.NODE_ENV': process.env.NODE_ENV
    }
  });
};

bs.watch('src/**/*.{js,jsx,ts,tsx}', (event, file) => {
  const currentBuild = initialBuild?.rebuild() || build();
  
  currentBuild
    .then(() => bs.reload('*.js'))
    .catch((e) => console.error(e));
});

cpx.watch('public/**/*', 'build').on('copy', (event) => {
  bs.reload();
});

build()
  .then(() => bs.init({ server: './build' }))
  .catch((e) => console.error(e));
