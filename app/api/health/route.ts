import { NextResponse } from 'next/server';

// Rota leve para verificar se o container subiu corretamente
// Railway Health Check Path: /api/health

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, 
    { status: 200 }
  );
}