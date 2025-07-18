import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call, CallDocument, CallStatus, CallAction } from '../../common/entities/call.entity';
import { CreateCallDto, UpdateCallDto, CallResponseDto, CallListResponseDto } from '../../common/dto/call.dto';

@Injectable()
export class CallsService {
  constructor(
    @InjectModel(Call.name)
    private callModel: Model<CallDocument>,
  ) {}

  async createCall(createCallDto: CreateCallDto): Promise<Call> {
    const call = new this.callModel(createCallDto);
    const savedCall = await call.save();
    return savedCall.toObject();
  }

  async updateCall(id: string, updateCallDto: UpdateCallDto): Promise<Call> {
    const updatedCall = await this.callModel.findByIdAndUpdate(id, updateCallDto, { new: true });
    return updatedCall.toObject();
  }

  async findByTwilioCallSid(twilioCallSid: string): Promise<Call> {
    const call = await this.callModel.findOne({ twilioCallSid });
    return call ? call.toObject() : null;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<CallListResponseDto> {
    const skip = (page - 1) * limit;
    
    const [calls, total] = await Promise.all([
      this.callModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.callModel.countDocuments(),
    ]);

    return {
      calls: calls as any,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Call> {
    const call = await this.callModel.findById(id);
    return call ? call.toObject() : null;
  }

  async updateCallStatus(twilioCallSid: string, status: CallStatus, metadata?: any): Promise<Call> {
    const call = await this.findByTwilioCallSid(twilioCallSid);
    if (!call) {
      throw new Error(`Call with Twilio SID ${twilioCallSid} not found`);
    }

    const updateData: any = { status };
    if (metadata) {
      updateData.metadata = { ...call.metadata, ...metadata };
    }

    return await this.updateCall((call as any)._id.toString(), updateData);
  }

  async updateCallAction(twilioCallSid: string, action: CallAction, additionalData?: any): Promise<Call> {
    const call = await this.findByTwilioCallSid(twilioCallSid);
    if (!call) {
      throw new Error(`Call with Twilio SID ${twilioCallSid} not found`);
    }

    const updateData: any = { action, ...additionalData };
    return await this.updateCall((call as any)._id.toString(), updateData);
  }
} 