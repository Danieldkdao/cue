export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto p-5">
      <div className="w-full flex flex-col gap-2 items-center mt-20">
        <h1 className="text-4xl font-semibold text-center">Your Snippets</h1>
        <p className="text-xl text-muted-foreground text-center">
          View, manage, sort, and search through your snippets.
        </p>
      </div>
    </div>
  );
}
