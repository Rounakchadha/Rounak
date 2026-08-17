import { ImageResponse } from 'next/og'
import { profile } from '@/data/profile'

export const runtime = 'edge'
export const alt = `${profile.name} — ${profile.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 78% 30%, rgba(41,151,255,0.35), rgba(0,0,0,0) 55%)',
          padding: '96px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#86868b',
            marginBottom: 28,
          }}
        >
          {profile.role}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: -4,
            color: '#f5f5f7',
            lineHeight: 1,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#2997ff',
            marginTop: 40,
          }}
        >
          {profile.siteUrl.replace('https://', '')}
        </div>
      </div>
    ),
    { ...size }
  )
}
