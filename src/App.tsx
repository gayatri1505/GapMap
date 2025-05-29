import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ResumeAnalyzer />
      <Toaster />
    </div>
  );
}

export default App;
