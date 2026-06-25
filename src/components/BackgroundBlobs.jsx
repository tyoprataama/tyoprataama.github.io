// Ambient blurred colour blobs fixed behind all content.
const blobs = [
  { background: '#0071e3', width: 500, height: 500, top: -100, right: -100, animationDelay: '0s' },
  { background: '#ff5f3f', width: 400, height: 400, bottom: 100, left: -80, animationDelay: '3s' },
  { background: '#00c48c', width: 300, height: 300, top: '40%', left: '40%', animationDelay: '6s' },
]

export default function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[80px] opacity-[0.18] animate-blob"
          style={b}
        />
      ))}
    </div>
  )
}
