import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from 'src/utils/types';
import * as streamifier from 'streamifier';

@Injectable()
export class ImageService {
  async upload(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMany(files: Express.Multer.File[]) {
    const images: CloudinaryResponse[] = [];
    for (const file of files) {
      console.log(file.filename);
      const result = await this.upload(file);
      images.push(result);
    }
    return images;
  }

  async destroy(file: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(file, {}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async deleteMany(files: string[]) {
    return new Promise<any>((resolve, reject) => {
      cloudinary.api.delete_resources(files, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
