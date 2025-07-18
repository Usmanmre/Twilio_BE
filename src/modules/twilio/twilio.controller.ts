import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { TwilioService } from './twilio.service';

@ApiTags('twilio')
@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('incoming')
  @ApiOperation({ summary: 'Handle incoming Twilio calls' })
  @ApiResponse({ status: 200, description: 'TwiML response for IVR menu' })
  async handleIncomingCall(@Body() callData: any, @Res() res: Response): Promise<void> {
    try {
      const twiml = await this.twilioService.handleIncomingCall(callData);
      res.setHeader('Content-Type', 'text/xml');
      res.status(HttpStatus.OK).send(twiml);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing call');
    }
  }

  @Post('gather')
  @ApiOperation({ summary: 'Handle digit input from IVR menu' })
  @ApiResponse({ status: 200, description: 'TwiML response based on digit pressed' })
  async handleDigitPressed(@Body() callData: any, @Res() res: Response): Promise<void> {
    try {
      const twiml = await this.twilioService.handleDigitPressed(callData);
      res.setHeader('Content-Type', 'text/xml');
      res.status(HttpStatus.OK).send(twiml);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing digit input');
    }
  }

  @Post('status-callback')
  @ApiOperation({ summary: 'Handle call status updates from Twilio' })
  @ApiResponse({ status: 200, description: 'Status update processed successfully' })
  async handleCallStatusUpdate(@Body() callData: any, @Res() res: Response): Promise<void> {
    try {
      await this.twilioService.handleCallStatusUpdate(callData);
      res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing status update');
    }
  }

  @Post('recording-complete')
  @ApiOperation({ summary: 'Handle recording completion' })
  @ApiResponse({ status: 200, description: 'Recording processed successfully' })
  async handleRecordingComplete(@Body() recordingData: any, @Res() res: Response): Promise<void> {
    try {
      await this.twilioService.handleRecordingComplete(recordingData);
      res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing recording');
    }
  }

  @Post('recording-status')
  @ApiOperation({ summary: 'Handle recording status updates' })
  @ApiResponse({ status: 200, description: 'Recording status processed successfully' })
  async handleRecordingStatus(@Body() recordingData: any, @Res() res: Response): Promise<void> {
    try {
      // This endpoint can be used for additional recording status handling
      // For now, we'll just acknowledge the request
      res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing recording status');
    }
  }


} 