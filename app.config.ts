export default defineAppConfig({
  ui: {
    // Updated colors structure per migration guide
    colors: {
      primary: 'green',
      neutral: 'slate', // Changed from gray to neutral
    },
    // Set strategy to merge to avoid overwriting defaults
    strategy: 'merge',
  },
})
