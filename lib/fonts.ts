import localFont from 'next/font/local'

export const britti = localFont({
  src: [
    {
      path: '../Font/BrittiSansTrial-Light-BF6757bfd494951.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../Font/BrittiSansTrial-LightItalic-BF6757bfd48c7c7.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../Font/BrittiSansTrial-Regular-BF6757bfd47ffbf.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../Font/BrittiSansTrial-RegularItalic-BF6757bfd44e013.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../Font/BrittiSansTrial-Semibold-BF6757bfd443a8a.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../Font/BrittiSansTrial-SemiboldItalic-BF6757bfd411c3a.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../Font/BrittiSansTrial-Bold-BF6757bfd4a96ed.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../Font/BrittiSansTrial-BoldItalic-BF6757bfd4a2285.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-britti',
}) 