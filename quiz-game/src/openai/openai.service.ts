import { OpenAI } from 'openai';
import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class OpenAIService {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async generateAudio(content: string) {
    // create folder if not exists
    if (!fs.existsSync('generated')) {
      fs.mkdirSync('generated');
    }

    // console.log('Creating audio');
    const mp3 = await this.client.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: content,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const path = `generated/generated.${Date.now()}.mp3`;
    await fs.promises.writeFile(path, buffer);

    return path;
  }
}
