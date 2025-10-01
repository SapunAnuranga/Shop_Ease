// ===== Header Slider Images =====
import header_headphone_image from "./header_headphone_image.png";
import header_playstation_image from "./header_playstation_image.png";
import header_macbook_image from "./header_macbook_image.png";

// ===== General Icons =====
import arrow_icon from "./arrow_icon.svg";
import facebook_icon from "./facebook_logo.svg";
import instagram_icon from "./instagram_logo.svg";
import twitter_icon from "./twitter_logo.svg";

// Export for Header Slider
export const headerAssets = {
  arrow_icon,
  header_headphone_image,
  header_playstation_image,
  header_macbook_image,
};

// Export for Footer
export const footerAssets = {
  facebook_icon,
  instagram_icon,
  twitter_icon,
};

// Combined export for backward compatibility (Footer.jsx is still using `assets`)
export const assets = {
  ...headerAssets,
  ...footerAssets,
};
