import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export async function GET() {
  const fox = `data:image/jpeg;base64,${(
    await readFile(join(process.cwd(), 'public', 'swufefox.jpg'))
  ).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#0a2230',
          color: '#f8f8f5',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '72%',
            padding: '64px 0 56px 64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                background: '#fff',
                border: '1px solid #e0b36a',
              }}
            >
              <img src={fox} width={54} height={54} alt="" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}>
              <div style={{ fontSize: 22, letterSpacing: 2 }}>SWUFEFOX</div>
              <div style={{ fontSize: 16, color: '#9c9c9c' }}>/ notes</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 16, color: '#e0b36a', letterSpacing: 4 }}>
              SWUFE // OPEN SOURCE
            </div>
            <div style={{ marginTop: 18, fontSize: 92, lineHeight: 1, letterSpacing: -3 }}>
              SWUFEFOX
            </div>
            <div style={{ display: 'flex', width: 240, height: 12, marginTop: 28, background: '#e0b36a' }} />
          </div>
          <div style={{ display: 'flex', maxWidth: 600, fontSize: 20, lineHeight: 1.4, color: '#9c9c9c' }}>
            A student-led open-source community at SWUFE. We build software, research markets, and open-source what we learn.
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28%',
            background: '#f6efe3',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 260,
              height: 260,
              background: '#fff',
              border: '1px solid #e0b36a',
            }}
          >
            <img src={fox} width={240} height={240} alt="" />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
