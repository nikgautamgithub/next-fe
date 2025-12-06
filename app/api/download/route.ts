import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * File Download Route
 * Handles file downloads (CSV, Excel, PDF, etc.) from backend
 * Streams binary data with proper headers for file downloads
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      endpoint,
      filename,
      contentType = 'text/csv',
      method = 'POST',
      data: requestData,
    } = body;

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const cookies = request.headers.get('cookie');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data: requestData || {},
      headers,
      responseType: 'arraybuffer', // Important for binary data
      withCredentials: true,
    });

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename || 'download'}"`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error('[Download Error]', {
      message: axiosError.message,
      status: axiosError.response?.status,
    });

    return NextResponse.json(
      {
        success: false,
        message: axiosError.message || 'Failed to download file',
        data: null,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}

/**
 * GET handler for downloads with query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const filename = searchParams.get('filename') || 'download';
    const contentType = searchParams.get('contentType') || 'text/csv';

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint query parameter is required' }, { status: 400 });
    }

    const cookies = request.headers.get('cookie');
    const headers: Record<string, string> = {};

    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await axios({
      method: 'GET',
      url: `${API_URL}${endpoint}`,
      params: Object.fromEntries(searchParams.entries()),
      headers,
      responseType: 'arraybuffer',
      withCredentials: true,
    });

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error('[Download Error]', {
      message: axiosError.message,
      status: axiosError.response?.status,
    });

    return NextResponse.json(
      {
        success: false,
        message: axiosError.message || 'Failed to download file',
        data: null,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
