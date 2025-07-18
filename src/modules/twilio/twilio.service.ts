import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CallsService } from '../calls/calls.service';
import { CallStatus, CallAction } from '../../common/entities/call.entity';
import { CreateCallDto } from '../../common/dto/call.dto';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private readonly personalPhoneNumber: string;

  constructor(
    private readonly callsService: CallsService,
    private readonly configService: ConfigService,
  ) {
    this.personalPhoneNumber = this.configService.get('PERSONAL_PHONE_NUMBER', '+1234567890');
  }

  async handleIncomingCall(callData: any): Promise<string> {
    this.logger.log(`Incoming call from ${callData.From} to ${callData.To}`);

    // Create call record
    const createCallDto: CreateCallDto = {
      callerNumber: callData.From,
      calledNumber: callData.To,
      twilioCallSid: callData.CallSid,
    };

    await this.callsService.createCall(createCallDto);

    // Generate TwiML for IVR menu
    return this.generateIVRMenu();
  }

  async handleDigitPressed(callData: any): Promise<string> {
    const digit = callData.Digits;
    const callSid = callData.CallSid;

    this.logger.log(`Digit pressed: ${digit} for call ${callSid}`);

    switch (digit) {
      case '1':
        return await this.handleCallForward(callSid);
      case '2':
        return await this.handleVoicemail(callSid);
      default:
        return this.generateInvalidOptionResponse();
    }
  }

  async handleCallStatusUpdate(callData: any): Promise<void> {
    const callSid = callData.CallSid;
    const callStatus = callData.CallStatus;
    const callDuration = callData.CallDuration;

    this.logger.log(`Call status update: ${callStatus} for call ${callSid}`);

    let status: CallStatus;
    switch (callStatus) {
      case 'ringing':
        status = CallStatus.RINGING;
        break;
      case 'in-progress':
        status = CallStatus.IN_PROGRESS;
        break;
      case 'completed':
        status = CallStatus.COMPLETED;
        break;
      case 'failed':
        status = CallStatus.FAILED;
        break;
      case 'busy':
        status = CallStatus.BUSY;
        break;
      case 'no-answer':
        status = CallStatus.NO_ANSWER;
        break;
      case 'canceled':
        status = CallStatus.CANCELED;
        break;
      default:
        status = CallStatus.RINGING;
    }

    await this.callsService.updateCallStatus(callSid, status, {
      duration: callDuration,
      timestamp: new Date().toISOString(),
    });
  }

  async handleRecordingComplete(recordingData: any): Promise<void> {
    const callSid = recordingData.CallSid;
    const recordingSid = recordingData.RecordingSid;
    const recordingUrl = recordingData.RecordingUrl;

    this.logger.log(`Recording completed: ${recordingSid} for call ${callSid}`);

    await this.callsService.updateCallAction(callSid, CallAction.VOICEMAIL, {
      voicemailUrl: recordingUrl,
      recordingSid: recordingSid,
    });
  }

  private generateIVRMenu(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather numDigits="1" action="/twilio/gather" method="POST" timeout="10">
        <Say voice="alice" language="en-US">
            Welcome to our IVR system. 
            Press 1 to speak with a representative, or press 2 to leave a voicemail.
        </Say>
    </Gather>
    <Say voice="alice" language="en-US">
        We didn't receive any input. Goodbye.
    </Say>
    <Hangup/>
</Response>`;
  }

  private async handleCallForward(callSid: string): Promise<string> {
    await this.callsService.updateCallAction(callSid, CallAction.FORWARDED, {
      forwardedTo: this.personalPhoneNumber,
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        Connecting you to a representative now.
    </Say>
    <Dial>${this.personalPhoneNumber}</Dial>
</Response>`;
  }

  private async handleVoicemail(callSid: string): Promise<string> {
    await this.callsService.updateCallAction(callSid, CallAction.VOICEMAIL);

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        Please leave your message after the beep.
    </Say>
    <Record 
        action="/twilio/recording-complete" 
        method="POST"
        maxLength="120"
        playBeep="true"
        recordingStatusCallback="/twilio/recording-status"
        recordingStatusCallbackMethod="POST"
    />
    <Say voice="alice" language="en-US">
        Thank you for your message. Goodbye.
    </Say>
    <Hangup/>
</Response>`;
  }

  private generateInvalidOptionResponse(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        Invalid option. Please try again.
    </Say>
    <Redirect method="POST">/twilio/incoming</Redirect>
</Response>`;
  }
} 