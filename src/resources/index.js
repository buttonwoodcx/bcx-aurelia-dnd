export function configure(config) {
  config.globalResources([
    './elements/display-source',
    './elements/display-sources',
    './elements/mark-down',
    './elements/show-mark-down-file',
    './value-converters/nav-section',
    './value-converters/ends-with',
    './attributes/if-not'
  ]);
}
