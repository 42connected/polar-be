// import {
//   Injectable,
//   ConflictException,
//   NotFoundException,
// } from '@nestjs/common';
// import { WebClient } from '@slack/client';
// import {
//   ApproveMessageDto,
//   CancelMessageDto,
//   ReservationMessageDto,
// } from 'src/v1/dto/slack/send-message.dto';

// @Injectable()
// export class SlackService {
//   client = new WebClient(process.env.SLACK_BOT_TOKEN);

//   async getIdByUsername(username: string): Promise<string> {
//     const email = username + '@student.42seoul.kr';
//     try {
//       const result = await this.client.users.lookupByEmail({
//         email: email,
//       });
//       const jsonToString = JSON.stringify(result);
//       const index = jsonToString.indexOf('id');
//       const id = jsonToString.substring(index + 5, index + 16);
//       return id;
//     } catch {
//       throw new NotFoundException('유저를 찾을 수 없습니다');
//     }
//   }

//   async sendReservationMessageToMentor(
//     reservationMessageDto: ReservationMessageDto,
//   ): Promise<boolean> {
//     const {
//       mentorSlackId,
//       cadetSlackId,
//       reservationTime,
//       mentoringTime,
//       isCommon,
//     } = reservationMessageDto;
//     const reservationTimeTmp: string = reservationTime.toDateString();
//     const tmp = reservationTimeTmp.split(' ');
//     const reservationTimeToString =
//       tmp[1] +
//       ' ' +
//       tmp[2] +
//       ', ' +
//       tmp[3] +
//       ' ' +
//       reservationTime.getHours() +
//       ':' +
//       reservationTime.getMinutes() +
//       ' for ' +
//       mentoringTime +
//       ' hours';
//     let commonType: string;
//     if (isCommon) {
//       commonType = '공통과정';
//     } else {
//       commonType = '심화과정';
//     }
//     try {
//       const channel = await this.getIdByUsername(mentorSlackId);
//       await this.client.chat.postMessage({
//         text: 'New mentoring request',
//         blocks: [
//           {
//             type: 'header',
//             text: {
//               type: 'plain_text',
//               text: 'New mentoring request',
//               emoji: true,
//             },
//           },
//         ],
//         attachments: [
//           {
//             blocks: [
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Requested by:*\n<@${cadetSlackId}>`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Intra Profile:*\n<https://profile.intra.42.fr/users/${cadetSlackId}|${cadetSlackId}>\n`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Type:*\n${commonType}`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*When:*\n${reservationTimeToString}`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Web Page:*\n<https://intra.42.fr | 42POLAR>\n`,
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//         channel: channel,
//       });
//       return true;
//     } catch (error) {
//       throw new ConflictException('슬랙 메세지 전송에 실패했습니다');
//     }
//   }

//   // 멘토이름, 승인여부, 카뎃아이
//   //
//   async sendApprovedMessageToCadet(
//     approveMessageDto: ApproveMessageDto,
//   ): Promise<true> {
//     const { mentorSlackId, cadetSlackId, reservationTime, mentoringTime } =
//       approveMessageDto;
//     const reservationTimeTmp: string = reservationTime.toDateString();
//     const tmp = reservationTimeTmp.split(' ');
//     const reservationTimeToString =
//       tmp[1] +
//       ' ' +
//       tmp[2] +
//       ', ' +
//       tmp[3] +
//       ' ' +
//       reservationTime.getHours() +
//       ':' +
//       reservationTime.getMinutes() +
//       ' for ' +
//       mentoringTime +
//       ' hours';
//     try {
//       const channel = await this.getIdByUsername(cadetSlackId);
//       await this.client.chat.postMessage({
//         text: 'Your mentoring reques',
//         blocks: [
//           {
//             type: 'header',
//             text: {
//               type: 'plain_text',
//               text: 'Mentoring approved',
//               emoji: true,
//             },
//           },
//         ],
//         attachments: [
//           {
//             blocks: [
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Mentor:*\n<@${mentorSlackId}>`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*When:*\n${reservationTimeToString}`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Web Page:*\n<https://intra.42.fr | 42POLAR>\n`,
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//         channel: channel,
//       });
//       return true;
//     } catch (error) {
//       throw new ConflictException('슬랙 메세지 전송에 실패했습니다');
//     }
//   }
//   async sendCanceldMessageToCadet(
//     cancelMessageDto: CancelMessageDto,
//   ): Promise<true> {
//     const { mentorSlackId, cadetSlackId } = cancelMessageDto;
//     try {
//       const channel = await this.getIdByUsername(cadetSlackId);
//       await this.client.chat.postMessage({
//         text: 'Mentoring canceld',
//         blocks: [
//           {
//             type: 'header',
//             text: {
//               type: 'plain_text',
//               text: 'Mentoring canceld',
//               emoji: true,
//             },
//           },
//         ],
//         attachments: [
//           {
//             blocks: [
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Mentor:*\n<@${mentorSlackId}>`,
//                   },
//                 ],
//               },
//               {
//                 type: 'section',
//                 fields: [
//                   {
//                     type: 'mrkdwn',
//                     text: `*Web Page:*\n<https://intra.42.fr | 42POLAR>\n`,
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//         channel: channel,
//       });
//       return true;
//     } catch (error) {
//       throw new ConflictException('슬랙 메세지 전송에 실패했습니다');
//     }
//   }
// }
