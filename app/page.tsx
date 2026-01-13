export default function Home() {
  return (
    <main style={{ padding: "4rem", fontFamily: "system-ui" }}>
      <h1>MIR Dental Care</h1>
      <p>Frontend operativo en Vercel.</p>
      <p>Entorno: demo.mirdentalcare.org</p>
      <p>Última actualización: {new Date().toLocaleString()}</p>
    </main>
  );
}
