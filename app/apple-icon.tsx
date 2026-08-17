import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 88, fontWeight: 800, color: '#f5f5f7', letterSpacing: -2 }}>
          RC<span style={{ color: '#2997ff' }}>.</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
