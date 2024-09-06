import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'request';

@Injectable()
export class DiDService {
  private readonly client: typeof request;

  constructor(private readonly configService: ConfigService) {
    this.client = request;
  }

  async uploadAudio(id: number) {
    const options = {
      method: 'POST',
      url: 'https://api.d-id.com/audios',
      headers: {
        accept: 'application/json',
        'content-type':
          'multipart/form-data; boundary=---011000010111000001101001',
        authorization: `Basic ${Buffer.from(
          this.configService.get<string>('D_ID_API_KEY'),
        ).toString('base64')}`,
      },
      formData: {
        audio: {
          value: fs.createReadStream(`generated/output-game-${id}.mp3`),
          options: {
            filename: `output-game-${id}.mp3`,
            contentType: 'audio/mpeg',
          },
        },
      },
      json: true,
    };

    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          if (response.statusCode === 201) {
            resolve(body.url);
          } else {
            reject(body.description);
          }
        }
      });
    });
  }

  async generateVideo(id: number) {
    // create folder if not exists
    if (!fs.existsSync('generated')) {
      fs.mkdirSync('generated');
    }

    // upload audio
    const audioUrl = await this.uploadAudio(id);

    const options = {
      method: 'POST',
      url: 'https://api.d-id.com/clips',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${Buffer.from(
          this.configService.get<string>('D_ID_API_KEY'),
        ).toString('base64')}`,
      },
      body: {
        presenter_id: 'amy-Aq6OmGZnMt',
        script: {
          type: 'audio',
          subtitles: 'false',
          audio_url: audioUrl,
        },
        config: { result_format: 'mp4', output_resolution: 360 },
        presenter_config: { crop: { type: 'wide' } },
        driver_id: 'Vcq0R4a8F0',
      },
      json: true,
    };

    let clipId = '';

    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          console.log(body);
          if (response.statusCode === 201) {
            clipId = body.id;
            resolve(clipId);
          } else {
            throw new Error(body.description);
            reject(body.description);
          }
        }
      });
    });

    const fetchClipOptions = {
      method: 'GET',
      url: `https://api.d-id.com/clips/${clipId}`,
      headers: {
        accept: 'application/json',
        authorization: `Basic ${Buffer.from(
          this.configService.get<string>('D_ID_API_KEY'),
        ).toString('base64')}`,
      },
      json: true,
    };

    return new Promise<string>((resolve, reject) => {
      request(fetchClipOptions, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          console.log(body);
          if (response.statusCode === 200) {
            if (body.clips) {
              resolve(body.clips[0].result_url || body.clips[0].pending_url);
            } else {
              resolve(body.result_url || body.pending_url);
            }
          } else {
            reject(body.description);
          }
        }
      });
    });
  }

  async isReady(clipId: string): Promise<boolean> {
    if (!clipId || clipId === '') {
      return false;
    }

    const options = {
      method: 'GET',
      url: `https://api.d-id.com/clips/${clipId}`,
      headers: {
        accept: 'application/json',
        authorization: `Basic ${Buffer.from(
          this.configService.get<string>('D_ID_API_KEY'),
        ).toString('base64')}`,
      },
      json: true,
    };

    // keep checking until the clip is ready
    return new Promise<boolean>((resolve, reject) => {
      const interval = setInterval(() => {
        request(options, function (error, response, body) {
          if (error) {
            reject(error);
          } else {
            if (response.statusCode === 200) {
              if (body.result_url) {
                clearInterval(interval);
                resolve(true);
              }
            } else {
              reject(body.description);
            }
          }
        });
      }, 5000);
    });
  }

  async download(clipId: string) {
    if (!clipId) {
      return '';
    }

    const options = {
      method: 'GET',
      url: `https://api.d-id.com/clips/${clipId}`,
      headers: {
        accept: 'application/json',
        authorization: `Basic ${Buffer.from(
          this.configService.get<string>('D_ID_API_KEY'),
        ).toString('base64')}`,
      },
      json: true,
    };

    const url = new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          if (response.statusCode === 200 && body.result_url) {
            {
              resolve(body.result_url);
            }
          } else {
            reject(body.description);
          }
        }
      });
    });

    // save the file
    const file = await url;
    console.log('Downloading file:', file);
    const fileName = `generated/output-game-${clipId}.mp4`;
    const fileStream = fs.createWriteStream(fileName);

    return new Promise<string>((resolve, reject) => {
      request(file)
        .pipe(fileStream)
        .on('close', () => {
          resolve(fileName);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async fetchClips() {
    const options = {
      method: 'GET',
      url: 'https://api.d-id.com/clips',
      headers: {
        accept: 'application/json',
        authorization: `Basic ${Buffer.from(
          this.configService.get<string>('D_ID_API_KEY'),
        ).toString('base64')}`,
      },
      json: true,
    };

    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          if (response.statusCode === 200) {
            resolve(body);
          } else {
            reject(body);
          }
        }
      });
    });
  }
}
