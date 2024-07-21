import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class LangchainService {
  private openai: OpenAI;
  private readonly logger = new Logger(LangchainService.name);

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: configService.get('OPENAI_API_KEY'), // Replace with your actual API key
    });
  }

  async enhanceDescription(
    description: string,
    name: string,
    category: string,
  ): Promise<string> {
    try {
      const prompt = `You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis. Your task is to enhance the description of a product based on the information provided.\n\nProduct name: ${name}\nProduct description: ${description}\nCategory: ${category}\n\nNew Description:`;
      const response = await this.openai.completions.create({
        model: 'text-davinci-003', // Replace with GPT-4 model if available
        prompt,
        max_tokens: 150,
      });

      return response.choices[0].text.trim();
    } catch (error) {
      this.logger.error(`Error enhancing description: ${error.message}`);
      throw new Error(`Error enhancing description: ${error.message}`);
    }
  }
}
