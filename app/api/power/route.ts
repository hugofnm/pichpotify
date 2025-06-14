import { NextRequest, NextResponse } from 'next/server'

// Function to shut down the server
export async function GET(req: NextRequest) {
  try {
    // launch the shutdown script
    require('child_process').exec('sudo /sbin/shutdown -r now', function (msg: string) { console.log(msg) });
    return NextResponse.json({ message: 'Server is shutting down...' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' })
  }
}