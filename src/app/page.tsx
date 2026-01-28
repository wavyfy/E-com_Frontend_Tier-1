import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold">E-com</h1>
      <p className="text-gray-500">A simple, scalable e-commerce platform.</p>

      <Link href="/products">
        <Button>Browse products</Button>
      </Link>
    </main>
  );
}
