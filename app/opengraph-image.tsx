import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Character Counter Pro'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #0f172a, #1e40af)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Geist, sans-serif',
          color: 'white',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 6.1H3" />
            <path d="M21 12.1H3" />
            <path d="M15.1 18H3" />
          </svg>
        </div>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            margin: '0',
            marginBottom: '20px',
          }}
        >
          Character Counter{' '}
          <span style={{ color: '#3b82f6', marginLeft: '10px' }}>Pro</span>
        </h1>
        <p style={{ fontSize: '32px', margin: '0', marginBottom: '40px' }}>
          Professional text analysis in real-time
        </p>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
            }}
          >
            Characters
          </div>
          <div
            style={{
              padding: '10px 20px',
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
            }}
          >
            Words
          </div>
          <div
            style={{
              padding: '10px 20px',
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
            }}
          >
            Sentences
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
