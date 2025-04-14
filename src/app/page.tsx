import { geistMono, geistSans } from "./layout";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <div className="flex gap-4">
        <h1 className="text-primary text-3xl font-bold">Hello world</h1>
        <h1
          className={`text-primary  text-3xl font-bold`}
        >
          Hello world
        </h1>
      </div>
    </main>
  );
}
