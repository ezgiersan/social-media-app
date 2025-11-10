export const getFullImageUrl = (image: string) => {
  return `${process.env.EXPO_PUBLIC_IMAGE_URL}${image}`;
};
