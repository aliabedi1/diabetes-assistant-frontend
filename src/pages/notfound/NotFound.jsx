import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">404</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-500">The page you are looking for does not exist or was moved.</p>
        <Button as={Link} to="/" className="mt-8">Back home</Button>
      </div>
    </main>
  );
}
