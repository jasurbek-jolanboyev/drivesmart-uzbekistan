import { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { TopicsList } from '@/components/TopicsList';
import { TrainingSession } from '@/components/TrainingSession';
import { Statistics } from '@/components/Statistics';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ExamStart } from '@/components/ExamStart';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trainingMode, setTrainingMode] = useState<{ active: boolean; topicId?: string; isExam?: boolean }>({ active: false });

  const handleStartTraining = (topicId?: string) => {
    setTrainingMode({ active: true, topicId, isExam: false });
  };

  const handleStartExam = () => {
    setTrainingMode({ active: true, isExam: true });
  };

  const handleCloseTraining = () => {
    setTrainingMode({ active: false });
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    if (trainingMode.active) {
      return (
        <TrainingSession 
          topicId={trainingMode.topicId} 
          isExam={trainingMode.isExam}
          onClose={handleCloseTraining} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onStartTraining={() => handleStartTraining()}
            onSelectTopics={() => setActiveTab('topics')}
            onStartExam={() => setActiveTab('exam')}
          />
        );
      case 'topics':
        return <TopicsList onSelectTopic={(id) => handleStartTraining(id)} />;
      case 'exam':
        return <ExamStart onStart={handleStartExam} />;
      case 'stats':
        return <Statistics />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="md:ml-20 pb-24 md:pb-8 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
