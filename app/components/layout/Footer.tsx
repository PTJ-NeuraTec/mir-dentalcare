import Container from "./Container";

export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 48 }}>
            <Container>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                    © {new Date().getFullYear()} MIR Dental Care — Demo
                </div>
            </Container>
        </footer>
    );
}
