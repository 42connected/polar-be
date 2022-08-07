import { Injectable, NotFoundException } from '@nestjs/common';
import { WebClient } from '@slack/client';

@Injectable()
export class SlackService {
  client = new WebClient(process.env.SLACK_BOT_TOKEN);

  async getIdByUsername(username: string): Promise<string> {
    const email = username + '@student.42seoul.kr';
    try {
      const result = await this.client.users.lookupByEmail({
        email: email,
      });
      // const str = ObjectMapper.serialize(result);
      const test = JSON.stringify(result);
      console.log(test);
      // const index = str.indexOf('id');
      // const id = str.substring(index + 5, index + 16);
      return 'null';
    } catch {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }
  }
}
