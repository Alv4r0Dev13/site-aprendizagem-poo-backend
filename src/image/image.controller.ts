import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageFilter as fileFilter } from 'src/utils/functions/multer/imageFilter.function';
import { DeleteManyImagesDTO } from './dto/delete-many-images.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { fileFilter }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new HttpException(
        'Nenhuma imagem enviada.',
        HttpStatus.BAD_REQUEST,
      );
    try {
      return await this.imageService.upload(file);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Não foi possível enviar a imagem.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('upload/many')
  @UseInterceptors(FilesInterceptor('image[]', 5, { fileFilter }))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    if (!files || !files.length)
      throw new HttpException(
        'Nenhuma imagem enviada.',
        HttpStatus.BAD_REQUEST,
      );
    try {
      return await this.imageService.uploadMany(files);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Não foi possível enviar as imagens.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('deletemany')
  async deleteMany(@Body() deleteManyImagesDTO: DeleteManyImagesDTO) {
    try {
      if (deleteManyImagesDTO.files.length === 1)
        return await this.imageService.destroy(deleteManyImagesDTO.files[0]);
      return await this.imageService.deleteMany(deleteManyImagesDTO.files);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Não foi possível deletar a imagem.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':filename')
  async destroy(@Param('filename') filename: string) {
    if (!filename)
      throw new HttpException(
        'Nenhum nome de arquivo enviado.',
        HttpStatus.BAD_REQUEST,
      );
    try {
      return await this.imageService.destroy(filename);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Não foi possível deletar a imagem.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
