import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function forwardRequest(
  request: NextRequest,
  method: string,
  paramsPromise: Promise<{ path: string[] }>
) {
  const params = await paramsPromise;
  const path = params.path.join('/');
  const url = `${API_URL}/${path}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    };

    const cookies = request.headers.get('cookie');
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    let body: unknown = null;
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        body = await request.json();
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Proxy] ${method} /${path}`, {
        url,
        body: method !== 'GET' ? body : undefined,
      });
    }

    const response = await axios({
      method,
      url,
      data: body,
      headers,
      withCredentials: true,
    });

    const setCookieHeaders = response.headers['set-cookie'];
    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie: string) => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(`[API Proxy Error] ${method} /${path}`, {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });

    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      success: false,
      message: axiosError.message || 'An unexpected error occurred',
      data: null,
    };

    return NextResponse.json(data, { status });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return forwardRequest(request, 'GET', params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return forwardRequest(request, 'POST', params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return forwardRequest(request, 'PUT', params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return forwardRequest(request, 'DELETE', params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return forwardRequest(request, 'PATCH', params);
}
