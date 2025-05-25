export const googleFonts = [
  { name: "Roboto", value: "Roboto, sans-serif", linkName: "Roboto" },
  { name: "Open Sans", value: "'Open Sans', sans-serif", linkName: "Open+Sans" },
  { name: "Lato", value: "Lato, sans-serif", linkName: "Lato" },
  { name: "Montserrat", value: "'Montserrat', sans-serif", linkName: "Montserrat" },
  { name: "Oswald", value: "Oswald, sans-serif", linkName: "Oswald" },
  { name: "Source Sans Pro", value: "'Source Sans Pro', sans-serif", linkName: "Source+Sans+Pro" },
  { name: "Raleway", value: "Raleway, sans-serif", linkName: "Raleway" },
  { name: "PT Sans", value: "'PT Sans', sans-serif", linkName: "PT+Sans" },
  { name: "Nunito Sans", value: "'Nunito Sans', sans-serif", linkName: "Nunito+Sans" },
  { name: "Playfair Display", value: "'Playfair Display', serif", linkName: "Playfair+Display" },
  { name: "Merriweather", value: "Merriweather, serif", linkName: "Merriweather" },
  { name: "Inter", value: "Inter, sans-serif", linkName: "Inter" },
  // Adding a few more diverse options
  { name: "Poppins", value: "Poppins, sans-serif", linkName: "Poppins" },
  { name: "Ubuntu", value: "Ubuntu, sans-serif", linkName: "Ubuntu" },
  { name: "Noto Sans", value: "'Noto Sans', sans-serif", linkName: "Noto+Sans" },
  { name: "Roboto Condensed", value: "'Roboto Condensed', sans-serif", linkName: "Roboto+Condensed"},
  { name: "Lora", value: "Lora, serif", linkName: "Lora" },
  { name: "Fira Sans", value: "'Fira Sans', sans-serif", linkName: "Fira+Sans" },
  { name: "Work Sans", value: "'Work Sans', sans-serif", linkName: "Work+Sans" },
  { name: "Quicksand", value: "Quicksand, sans-serif", linkName: "Quicksand" }
];

// Function to generate Google Font import URLs
// This can be used to generate the <link> tags content if needed elsewhere,
// but for this task, we'll manually construct them based on the list.
export const generateGoogleFontLinks = (fonts) => {
  return fonts.map(font => {
    const family = font.linkName || font.name.replace(/ /g, '+');
    // Including common weights: 300 (light), 400 (regular), 500 (medium), 700 (bold)
    // and italic styles for these weights: 300italic, 400italic, 500italic, 700italic
    // Some fonts may not support all these weights/styles, Google Fonts API handles this.
    return `https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap`;
  });
};

export const fontWeightOptions = [
  { label: 'Normal', value: 'normal', cssValue: '400' },
  { label: 'Bold', value: 'bold', cssValue: '700' },
  { label: 'Extra Bold', value: 'xbold', cssValue: '800' }, // Common value for extra-bold
];
