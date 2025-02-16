type ImageFilterFn = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => void;

export const imageFilter: ImageFilterFn = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i))
    return callback(new Error('Apenas imagens podem ser enviadas.'), false);
  callback(null, true);
};
