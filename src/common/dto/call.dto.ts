import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from "class-validator";
import { CallStatus, CallAction } from "../entities/call.entity";

export class CreateCallDto {
  @ApiProperty({ description: "Phone number of the caller" })
  @IsString()
  callerNumber: string;

  @ApiProperty({ description: "Phone number that was called" })
  @IsString()
  calledNumber: string;

  @ApiProperty({ description: "Twilio Call SID" })
  @IsString()
  twilioCallSid: string;
}

export class UpdateCallDto {
  @ApiProperty({
    description: "Call status",
    enum: CallStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(CallStatus)
  status?: CallStatus;

  @ApiProperty({
    description: "Action taken on the call",
    enum: CallAction,
    required: false,
  })
  @IsOptional()
  @IsEnum(CallAction)
  action?: CallAction;

  @ApiProperty({ description: "Call duration in seconds", required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: "URL to voicemail recording", required: false })
  @IsOptional()
  @IsString()
  voicemailUrl?: string;

  @ApiProperty({
    description: "Number the call was forwarded to",
    required: false,
  })
  @IsOptional()
  @IsString()
  forwardedTo?: string;

  @ApiProperty({ description: "Twilio Recording SID", required: false })
  @IsOptional()
  @IsString()
  recordingSid?: string;
}

export class CallResponseDto {
  @ApiProperty({ description: "Unique call identifier" })
  _id: string;

  @ApiProperty({ description: "Phone number of the caller" })
  callerNumber: string;

  @ApiProperty({ description: "Phone number that was called" })
  calledNumber: string;

  @ApiProperty({ description: "Twilio Call SID" })
  twilioCallSid: string;

  @ApiProperty({ description: "Call status", enum: CallStatus })
  status: CallStatus;

  @ApiProperty({
    description: "Action taken on the call",
    enum: CallAction,
    nullable: true,
  })
  action: CallAction;

  @ApiProperty({ description: "Call duration in seconds", nullable: true })
  duration: number;

  @ApiProperty({ description: "URL to voicemail recording", nullable: true })
  voicemailUrl: string;

  @ApiProperty({
    description: "Number the call was forwarded to",
    nullable: true,
  })
  forwardedTo: string;

  @ApiProperty({ description: "Twilio Recording SID", nullable: true })
  recordingSid: string;

  @ApiProperty({ description: "Call creation timestamp" })
  createdAt: Date;

  @ApiProperty({ description: "Call last update timestamp" })
  updatedAt: Date;
}

export class CallListResponseDto {
  @ApiProperty({ type: [CallResponseDto], description: "List of calls" })
  calls: CallResponseDto[];

  @ApiProperty({ description: "Total number of calls" })
  total: number;

  @ApiProperty({ description: "Current page number" })
  page: number;

  @ApiProperty({ description: "Number of calls per page" })
  limit: number;
}
