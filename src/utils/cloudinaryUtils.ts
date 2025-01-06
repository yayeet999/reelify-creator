export const calculateCloudinaryScale = (previewWidth: number, actualWidth: number) => {
  const SCALE_FACTOR = actualWidth / previewWidth;
  const FINE_TUNE_FACTOR = 0.8;
  return Math.round(SCALE_FACTOR * FINE_TUNE_FACTOR);
};

export const getCloudinaryPosition = (position: "top" | "middle" | "bottom") => {
  switch (position) {
    case "top":
      return "g_north,y_200";
    case "middle":
      return "g_center";
    case "bottom":
      return "g_south,y_200";
  }
};

export const getCloudinaryAnimation = (animation: "none" | "fade") => {
  switch (animation) {
    case "none":
      return "";
    case "fade":
      return "e_fade:2000";
  }
};