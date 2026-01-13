import Brand from "../ui/Brand";
import Container from "./Container";

export default function Header() {
    return (
        <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Container>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Brand />
                    <nav style={{ display: "flex", gap: 16, fontSize: 14, opacity: 0.85 }}>
                        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>Inicio</a>
                        <a href="/status" style={{ textDecoration: "none", color: "inherit" }}>Estado</a>
                    </nav>
                </div>
            </Container>
        </header>
    );
}
