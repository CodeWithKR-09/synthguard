import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Receive the file securely from the browser
    const formData = await request.formData();

    // 2. Node.js forwards the file to Python, completely bypassing browser ALPN/CORS blocks
    const backendResponse = await fetch("http://127.0.0.1:8000/api/v1/analyze", {
      method: "POST",
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json({ error: `PyTorch crash: ${errorText}` }, { status: backendResponse.status });
    }

    // 3. Return the AI results to the frontend
    const data = await backendResponse.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Next.js Server-Side Proxy Error:", error);
    return NextResponse.json(
      { error: "Node.js could not reach Python. Ensure Uvicorn is running on port 8000." }, 
      { status: 504 }
    );
  }
}