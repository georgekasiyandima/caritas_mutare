const path = require('path');
const webpack = require('webpack');

/**
 * CRACO config to avoid source-map-loader and babel-loader EIO errors when
 * reading node_modules (e.g. @mui/icons-material). We alias @mui/icons-material
 * to a local barrel that uses path imports so the package entry (and Alarm.js) is never loaded.
 */
function ruleUsesSourceMapLoader(rule) {
  if (!rule) return false;
  if (rule.loader && rule.loader.toString().includes('source-map-loader')) return true;
  const uses = rule.use ? (Array.isArray(rule.use) ? rule.use : [rule.use]) : [];
  return uses.some((u) => {
    if (typeof u === 'string') return u.includes('source-map-loader');
    return u && (u.loader || '').toString().includes('source-map-loader');
  });
}

function ruleUsesBabelLoader(rule) {
  if (!rule) return false;
  if (rule.loader && rule.loader.toString().includes('babel-loader')) return true;
  const uses = rule.use ? (Array.isArray(rule.use) ? rule.use : [rule.use]) : [];
  return uses.some((u) => {
    if (typeof u === 'string') return u.includes('babel-loader');
    return u && (u.loader || '').toString().includes('babel-loader');
  });
}

function removeSourceMapLoaderRule(rules) {
  if (!Array.isArray(rules)) return;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule.oneOf) {
      removeSourceMapLoaderRule(rule.oneOf);
      continue;
    }
    if (ruleUsesSourceMapLoader(rule)) {
      rules.splice(i, 1);
      return;
    }
  }
}

function excludeNodeModulesFromBabel(rules) {
  if (!Array.isArray(rules)) return;
  for (const rule of rules) {
    if (rule.oneOf) {
      excludeNodeModulesFromBabel(rule.oneOf);
      continue;
    }
    if (ruleUsesBabelLoader(rule)) {
      // Prevent babel from processing node_modules (fixes EIO on @mui/icons-material)
      rule.exclude = rule.exclude
        ? [].concat(rule.exclude).concat(/node_modules/)
        : /node_modules/;
    }
  }
}

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      removeSourceMapLoaderRule(webpackConfig.module?.rules);
      excludeNodeModulesFromBabel(webpackConfig.module?.rules);
      // Disable devtool to avoid any source map reads that can cause EIO
      webpackConfig.devtool = false;
      // Resolve only the bare '@mui/icons-material' to our barrel; subpaths like @mui/icons-material/Home stay in node_modules
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        // Exact match only (so @mui/icons-material/Home still resolves to node_modules)
        '@mui/icons-material$': path.resolve(__dirname, 'src/icons/mui.ts'),
      };
      return webpackConfig;
    },
  },
};
