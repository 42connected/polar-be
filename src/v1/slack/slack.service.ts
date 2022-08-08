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
      const jsonToString = JSON.stringify(result);
      const index = jsonToString.indexOf('id');
      const id = jsonToString.substring(index + 5, index + 16);
      return id;
    } catch {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }
  }

  async sendReservationMessage(
    username: string,
    reservationTime: Date,
    mentoringTime: number,
    isCommon: boolean,
  ): Promise<void> {
    const reservationTimeTmp: string = reservationTime.toDateString();
    const tmp = reservationTimeTmp.split(' ');
    const reservationTimeToString =
      tmp[1] +
      ' ' +
      tmp[2] +
      ', ' +
      tmp[3] +
      ' ' +
      reservationTime.getHours() +
      ':' +
      reservationTime.getMinutes() +
      ' for ' +
      mentoringTime +
      ' hours';
    let commonType: string;
    if (isCommon) {
      commonType = '공통과정';
    } else {
      commonType = '심화과정';
    }
    try {
      const channel = await this.getIdByUsername(username);
      await this.client.chat.postMessage({
        text: 'New mentoring request',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'New mentoring request',
              emoji: true,
            },
          },
        ],
        attachments: [
          {
            blocks: [
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*Create by:*\n<https://profile.intra.42.fr/users/${username}|${username}>`,
                  },
                ],
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*Type:*\n${commonType}`,
                  },
                ],
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*When:*\n${reservationTimeToString}`,
                  },
                ],
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      emoji: true,
                      text: 'Go',
                    },
                    style: 'primary',
                    url: 'https://profile.intra.42.fr/',
                  },
                ],
              },
            ],
          },
        ],
        channel: channel,
      });
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }
  }
}
