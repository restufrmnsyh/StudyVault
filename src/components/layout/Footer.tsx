import { Container } from "@/components/common";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container>
        <p className="text-center text-sm text-text-muted">
          © {new Date().getFullYear()} StudyVault. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
