import { Controller, Get, Post, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { CreateCallDto, UpdateCallDto, CallResponseDto, CallListResponseDto } from '../../common/dto/call.dto';

@ApiTags('calls')
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new call record' })
  @ApiResponse({ status: 201, description: 'Call created successfully', type: CallResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCall(@Body() createCallDto: CreateCallDto): Promise<CallResponseDto> {
    return await this.callsService.createCall(createCallDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calls with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Calls retrieved successfully', type: CallListResponseDto })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<CallListResponseDto> {
    return await this.callsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific call by ID' })
  @ApiResponse({ status: 200, description: 'Call retrieved successfully', type: CallResponseDto })
  @ApiResponse({ status: 404, description: 'Call not found' })
  async findOne(@Param('id') id: string): Promise<CallResponseDto> {
    return await this.callsService.findOne(id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update a call record' })
  @ApiResponse({ status: 200, description: 'Call updated successfully', type: CallResponseDto })
  @ApiResponse({ status: 404, description: 'Call not found' })
  async updateCall(
    @Param('id') id: string,
    @Body() updateCallDto: UpdateCallDto,
  ): Promise<CallResponseDto> {
    return await this.callsService.updateCall(id, updateCallDto);
  }
} 