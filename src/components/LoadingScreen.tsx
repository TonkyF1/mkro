export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold">
          <span className="bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
            MK
          </span>
          <span className="bg-gradient-to-br from-secondary to-secondary-light bg-clip-text text-transparent">
            RO
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}