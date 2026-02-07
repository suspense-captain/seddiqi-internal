
interface BackgroundStyleProps {
  backgroundColor: string;
}

// Define text color mapping based on background styles
const textColorForBackground = {
  'bgWhiteTextDarkGreen': 'greenDark',
  'bgCreamTextMidnightBrown': 'midnightBrown',
  "bgDefaultTextGreen": 'greenDark'
};

// Get the background style class based on the background color
const getBackgroundStyle = (backgroundColor: string): string => {
  switch (backgroundColor) {
    case 'white':
      return 'bgWhiteTextDarkGreen';
    case 'cream':
      return 'bgCreamTextMidnightBrown';
    default:
      return 'bgDefaultTextGreen';
  }
};

// Get the text color based on the background style class
const getTextColor = (backgroundStyle: string): string => {
  return textColorForBackground[backgroundStyle];
};

//Get background style and text color
export const BackgroundStyle = ({ backgroundColor }: BackgroundStyleProps): { backgroundStyle: string, textColor: string } => {
  const backgroundStyle = getBackgroundStyle(backgroundColor);
  const textColor = getTextColor(backgroundStyle);

  return { backgroundStyle, textColor };
};
