import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CallStatus {
  RINGING = 'ringing',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  BUSY = 'busy',
  NO_ANSWER = 'no-answer',
  CANCELED = 'canceled',
}

export enum CallAction {
  FORWARDED = 'forwarded',
  VOICEMAIL = 'voicemail',
  HANGUP = 'hangup',
}

export type CallDocument = Call & Document;

@Schema({ timestamps: true })
export class Call {
  _id: string;

  @Prop({ required: true })
  callerNumber: string;

  @Prop({ required: true })
  calledNumber: string;

  @Prop({ required: true, unique: true })
  twilioCallSid: string;

  @Prop({ 
    type: String, 
    enum: CallStatus, 
    default: CallStatus.RINGING 
  })
  status: CallStatus;

  @Prop({ 
    type: String, 
    enum: CallAction 
  })
  action: CallAction;

  @Prop()
  duration: number;

  @Prop()
  voicemailUrl: string;

  @Prop()
  forwardedTo: string;

  @Prop()
  recordingSid: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const CallSchema = SchemaFactory.createForClass(Call); 