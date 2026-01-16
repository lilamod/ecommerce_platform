import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is missing');
    }

    sgMail.setApiKey(apiKey);
  }

async sendVerificationEmail(email: string, token: string) {
  console.log("callingggggggnp")
  const frontendUrl = this.configService.get<string>('FRONTEND_URL');
  const fromEmail = this.configService.get<string>('SMTP_FROM');
  // Change to /auth/verify-email to match your frontend route
  const url = `${frontendUrl}/auth/verify-email?token=${token}`;
console.log("url",url, "email", email, "fromEmail", fromEmail)
  try {
    await sgMail.send({
      to: email,
      from: {
        email: fromEmail,
        name: 'FullStack Commerce Platform',
      },
      subject: 'Verify your email',
      html: `
        <p>Click the link below to verify your email:</p>
        <a href="${url}">${url}</a>
      `,
    }).then(()=>{
      console.log("Mail send successfully")
    }).catch(err =>{
      console.log(err)
    });
  } catch (error) {
    console.error(error.response?.body || error);
    throw new InternalServerErrorException(
      'Failed to send verification email',
    );
  }
}
}
