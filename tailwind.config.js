import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/@material-tailwind/react/components/**/*.{js,ts}',
    'node_modules/@material-tailwind/react/theme/components/**/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
