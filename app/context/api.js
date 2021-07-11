import { getImagesFromStore } from '../misc/helper';

const getImages = async () => {
  const images = await getImagesFromStore();
  let imgs = [];
  //console.log('After call ');
  //console.log(images);
  images.forEach((element) => {
    const img = {
      key: element['key'],
      path: element['path'],
    };
    imgs.push(img);
  });
  //console.log('Hello');
  //console.log(imgs);
  //console.log('C' + typeof imgs);
  return imgs;
};

export default getImages;
