import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { registerEnumType } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { CreateSignedUrlInput } from './dto/create-signed-url.input';

export enum EnumService {
  CLOUDINARY = 'Cloudinary',
  S3 = 'S3storage',
  WEB_S3 = 'Web3storage',
}

registerEnumType(EnumService, {
  name: 'EnumService',
});

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  // async uploadMultipleToCloudinaryGraphql(args: CreateUploadInput, file: any) {
  //   const arrayResponse: any[] = [];
  //   console.log('args', args);
  //   console.log('file', await args.files);
  //   await Promise.all(
  //     (await args.files).map(async (f: any) => {
  //       const { createReadStream } = await f;
  //       const buffer = await this.streamToBuffer(createReadStream());
  //       const result = await this.cloudinary(buffer, `graphql/${args.folder}`);
  //       arrayResponse.push(result);
  //     }),
  //   );
  //   return arrayResponse;
  // }

  // async streamToBuffer(stream: Readable): Promise<Buffer> {
  //   const buffer: Uint8Array[] = [];

  //   return new Promise((resolve, reject) =>
  //     stream
  //       .on('error', (error) => reject(error))
  //       .on('data', (data) => buffer.push(data))
  //       .on('end', () => resolve(Buffer.concat(buffer))),
  //   );
  // }

  // async cloudinary(buffer: any, folder: any) {
  //   return await new Promise((resolve, reject) => {
  //     const upload = v2.uploader.upload_stream({ folder: folder }, (error, result) => {
  //       if (error) return reject(error);
  //       resolve(result);
  //     });
  //     toStream(buffer).pipe(upload);
  //   });
  // }

  async signedUrlForUpload(createSignedUrlInput: CreateSignedUrlInput) {
    const api_key = this.configService.get('CLOUDINARY_API_KEY');
    const timestamp = Math.round(new Date().getTime() / 1000);
    const public_id = randomUUID();
    const path = createSignedUrlInput?.folder ? `graphql/${createSignedUrlInput.folder}` : 'graphql';
    const signature = v2.utils.api_sign_request(
      {
        timestamp,
        folder: path,
        public_id: public_id,
      },
      this.configService.get('CLOUDINARY_API_SECRET'),
    );

    return {
      timestamp,
      signature,
      url: `https://api.cloudinary.com/v1_1/drezybkfi/upload?timestamp=${timestamp}&signature=${signature}&api_key=${api_key}&folder=${path}&public_id=${public_id}`,
    };
  }
}
